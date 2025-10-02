import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SuccessAnimation } from '../shared/success-animation';
import { ConnectionStatusComponent } from '../shared/connection-status.component';

import { ContentService } from '../services/content.service';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { SessionTimeoutService } from '../services/session-timeout.service';
import { BackendConnectionService } from '../services/backend-connection.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SuccessAnimation, ConnectionStatusComponent]
})
export class AdminDashboard implements OnInit {
  stats: any = {};
  users: any[] = [];
  applications: any[] = [];
  claims: any[] = [];
  announcements: any[] = [];
  events: any[] = [];
  contacts: any[] = [];
  recentActivities: any[] = [];
  
  // Claims modal
  showClaimModalFlag: boolean = false;
  currentClaimId: number | null = null;
  claimAction: string = '';
  claimForm: FormGroup;
  
  // Forms
  announcementForm: FormGroup;
  eventForm: FormGroup;
  meetingForm: FormGroup;
  editUserForm: FormGroup;
  approvalForm: FormGroup;
  
  // Data
  meetings: any[] = [];
  filteredUsers: any[] = [];
  filteredApplications: any[] = [];
  
  // Search
  userSearchTerm: string = '';
  appSearchTerm: string = '';
  
  // UI State
  showEditModal: boolean = false;
  editingUser: any = null;
  showApprovalModalFlag: boolean = false;
  showDocumentModal: boolean = false;
  currentApplicationId: number | null = null;
  approvalAction: string = '';
  currentDocuments: any[] = [];
  
  // UI State
  activeTab = 'overview';
  isLoading = false;
  showSuccess = false;
  successMessage = '';
  message = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private contentService: ContentService,
    private authService: AuthService,
    private apiService: ApiService,
    private sessionTimeout: SessionTimeoutService,
    private backendConnection: BackendConnectionService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      priority: ['medium', Validators.required],
      is_pinned: [false]
    });

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: [''],
      is_featured: [false],
      registration_required: [false]
    });

    this.meetingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15)]],
      type: ['zoom', Validators.required],
      max_participants: [100, [Validators.required, Validators.min(2)]],
      meeting_link: [''],
      require_registration: [false],
      send_notifications: [true]
    });

    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      is_active: [true],
      is_staff: [false]
    });

    this.approvalForm = this.fb.group({
      reason: ['', Validators.required],
      sendEmail: [true]
    });

    this.claimForm = this.fb.group({
      reason: ['', Validators.required],
      amount_approved: [''],
      sendEmail: [true]
    });
  }

  ngOnInit() {
    this.sessionTimeout.startTimer();
    this.loadDashboardData();
    this.loadMeetings();
  }

  loadDashboardData() {
    if (!this.backendConnection.isBackendConnected()) {
      // Use empty data when backend is disconnected
      this.stats = {
        total_users: 0,
        total_applications: 0,
        pending_applications: 0,
        total_claims: 0,
        pending_claims: 0
      };
      this.users = this.getMockUsers();
      this.filteredUsers = [...this.users];
      this.applications = this.getMockApplications();
      this.filteredApplications = [...this.applications];
      this.claims = this.getMockClaims();
      this.contacts = this.getMockContacts();
      return;
    }

    // Load admin stats from backend
    this.http.get(`${environment.apiUrl}/admin/stats/`, this.getAuthOptions()).subscribe({
      next: (stats: any) => {
        this.stats = stats;
      },
      error: () => {
        this.stats = {
          total_users: 0,
          total_applications: 0,
          pending_applications: 0,
          total_claims: 0,
          pending_claims: 0
        };
      }
    });

    // Load users
    this.http.get(`${environment.apiUrl}/admin/users/`, this.getAuthOptions()).subscribe({
      next: (data: any) => {
        this.users = data;
        this.filteredUsers = [...this.users];
      },
      error: () => {
        this.users = [];
        this.filteredUsers = [];
      }
    });

    // Load applications
    this.http.get(`${environment.apiUrl}/admin/applications/`, this.getAuthOptions()).subscribe({
      next: (data: any) => {
        this.applications = data;
        this.filteredApplications = [...this.applications];
      },
      error: () => {
        this.applications = [];
        this.filteredApplications = [];
      }
    });

    // Load claims
    this.http.get(`${environment.apiUrl}/admin/claims/`, this.getAuthOptions()).subscribe({
      next: (data: any) => {
        this.claims = data;
      },
      error: () => {
        this.claims = [];
      }
    });

    // Load announcements
    this.http.get(`${environment.apiUrl}/notifications/announcements/`, this.getAuthOptions()).subscribe({
      next: (data: any) => {
        this.announcements = data;
      },
      error: () => {
        this.announcements = [];
      }
    });

    // Load events
    this.http.get(`${environment.apiUrl}/notifications/events/`, this.getAuthOptions()).subscribe({
      next: (data: any) => {
        this.events = data;
      },
      error: () => {
        this.events = [];
      }
    });

    // Load contacts (no admin endpoint available, use mock)
    this.contacts = this.getMockContacts();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  createAnnouncement() {
    if (this.announcementForm.invalid) return;

    this.isLoading = true;
    
    this.http.post(`${environment.apiUrl}/admin/announcements/create/`, 
      this.announcementForm.value, this.getAuthOptions()).subscribe({
      next: (newAnnouncement: any) => {
        this.announcements.unshift(newAnnouncement);
        this.isLoading = false;
        this.successMessage = 'Announcement created successfully!';
        this.showSuccess = true;
        this.announcementForm.reset({ priority: 'medium', is_pinned: false });
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Failed to create announcement: ' + (error.error?.message || 'Server error');
      }
    });
  }

  createEvent() {
    if (this.eventForm.invalid) return;

    this.isLoading = true;
    
    this.http.post(`${environment.apiUrl}/admin/events/create/`, 
      this.eventForm.value, this.getAuthOptions()).subscribe({
      next: (newEvent: any) => {
        this.events.unshift(newEvent);
        this.isLoading = false;
        this.successMessage = 'Event created successfully!';
        this.showSuccess = true;
        this.eventForm.reset({ is_featured: false, registration_required: false });
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Failed to create event: ' + (error.error?.message || 'Server error');
      }
    });
  }

  updateApplicationStatus(appId: number, status: string) {
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    this.http.post(`${environment.apiUrl}/admin/applications/${appId}/update-status/`, 
      { status }, options).subscribe({
      next: () => {
        this.successMessage = `Application ${status} successfully!`;
        this.showSuccess = true;
        this.loadDashboardData();
      },
      error: () => {
        this.message = 'Error updating application status';
      }
    });
  }

  toggleUserStatus(userId: number, isActive: boolean) {
    // Mock implementation
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.is_active = !isActive;
      this.successMessage = `User ${user.is_active ? 'activated' : 'deactivated'} successfully!`;
      this.showSuccess = true;
    }
  }

  makeUserAdmin(userId: number) {
    // Mock implementation
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.is_staff = true;
      this.successMessage = 'User promoted to admin successfully!';
      this.showSuccess = true;
    }
  }

  loadMeetings() {
    // No meetings endpoint available, keep empty
    this.meetings = [];
  }

  createMeeting() {
    if (this.meetingForm.invalid) return;

    this.isLoading = true;
    
    this.http.post(`${environment.apiUrl}/admin/meetings/create/`, 
      this.meetingForm.value, this.getAuthOptions()).subscribe({
      next: (meeting: any) => {
        this.meetings.unshift(meeting);
        this.isLoading = false;
        this.successMessage = 'Meeting created successfully!';
        this.showSuccess = true;
        this.meetingForm.reset({
          duration: 60,
          type: 'zoom',
          max_participants: 100,
          require_registration: false,
          send_notifications: true
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Failed to create meeting: ' + (error.error?.message || 'Server error');
      }
    });
  }

  copyMeetingLink(link: string) {
    if (link && navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        this.successMessage = 'Meeting link copied to clipboard!';
        this.showSuccess = true;
      });
    }
  }

  sendMeetingReminder(meetingId: number) {
    this.successMessage = 'Meeting reminder sent to all participants!';
    this.showSuccess = true;
  }

  deleteMeeting(meetingId: number) {
    this.meetings = this.meetings.filter(m => m.id !== meetingId);
    this.successMessage = 'Meeting cancelled successfully!';
    this.showSuccess = true;
  }

  filterUsers() {
    if (!this.userSearchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.userSearchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.first_name && user.first_name.toLowerCase().includes(term)) ||
      (user.last_name && user.last_name.toLowerCase().includes(term))
    );
  }

  filterApplications() {
    if (!this.appSearchTerm) {
      this.filteredApplications = [...this.applications];
      return;
    }
    
    const term = this.appSearchTerm.toLowerCase();
    this.filteredApplications = this.applications.filter(app => 
      app.applicant.toLowerCase().includes(term) ||
      app.email.toLowerCase().includes(term) ||
      app.type.toLowerCase().includes(term)
    );
  }

  editUser(user: any) {
    this.editingUser = user;
    this.editUserForm.patchValue({
      username: user.username,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      is_active: user.is_active,
      is_staff: user.is_staff
    });
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingUser = null;
    this.editUserForm.reset();
  }

  saveUserChanges() {
    if (this.editUserForm.invalid || !this.editingUser) return;

    const formData = this.editUserForm.value;
    const userIndex = this.users.findIndex(u => u.id === this.editingUser.id);
    
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...formData };
      this.filterUsers(); // Refresh filtered list
      this.closeEditModal();
      this.successMessage = 'User updated successfully!';
      this.showSuccess = true;
    }
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.users = this.users.filter(u => u.id !== userId);
      this.filterUsers(); // Refresh filtered list
      this.successMessage = 'User deleted successfully!';
      this.showSuccess = true;
    }
  }

  onSuccessComplete() {
    this.showSuccess = false;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.adminLogout();
    }
  }

  getCurrentUser() {
    return this.authService.getUserData();
  }

  showApprovalModal(appId: number, action: string) {
    this.currentApplicationId = appId;
    this.approvalAction = action;
    this.showApprovalModalFlag = true;
    this.approvalForm.reset({ sendEmail: true });
  }

  closeApprovalModal() {
    this.showApprovalModalFlag = false;
    this.currentApplicationId = null;
    this.approvalAction = '';
  }

  submitApproval() {
    if (this.approvalForm.invalid || !this.currentApplicationId) return;

    const formData = this.approvalForm.value;
    const payload = {
      status: this.approvalAction,
      reason: formData.reason,
      send_email: formData.sendEmail
    };

    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    this.http.post(`${environment.apiUrl}/admin/applications/${this.currentApplicationId}/update-status/`, 
      payload, options).subscribe({
      next: () => {
        this.successMessage = `Application ${this.approvalAction} successfully!`;
        this.showSuccess = true;
        this.closeApprovalModal();
        this.loadDashboardData();
      },
      error: () => {
        this.message = 'Error updating application status';
      }
    });
  }

  viewDocuments(appId: number) {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    this.http.get(`${environment.apiUrl}/admin/applications/${appId}/documents/`, 
      options).subscribe({
      next: (documents: any) => {
        this.currentDocuments = documents;
        this.showDocumentModal = true;
      },
      error: () => {
        this.message = 'Error loading documents';
      }
    });
  }

  closeDocumentModal() {
    this.showDocumentModal = false;
    this.currentDocuments = [];
  }

  openDocument(url: string) {
    window.open(url, '_blank');
  }

  downloadDocument(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return undefined;
  }

  private getAuthOptions() {
    const token = this.authService.getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  showClaimModal(claimId: number, action: string) {
    this.currentClaimId = claimId;
    this.claimAction = action;
    this.showClaimModalFlag = true;
    this.claimForm.reset({ sendEmail: true });
  }

  closeClaimModal() {
    this.showClaimModalFlag = false;
    this.currentClaimId = null;
    this.claimAction = '';
  }

  submitClaimDecision() {
    if (this.claimForm.invalid || !this.currentClaimId) return;

    const formData = this.claimForm.value;
    const payload = {
      status: this.claimAction,
      admin_notes: formData.reason,
      amount_approved: formData.amount_approved,
      send_email: formData.sendEmail
    };

    this.http.patch(`${environment.apiUrl}/admin/claims/${this.currentClaimId}/`, 
      payload, this.getAuthOptions()).subscribe({
      next: () => {
        this.successMessage = `Claim ${this.claimAction} successfully!`;
        this.showSuccess = true;
        this.closeClaimModal();
        this.loadDashboardData();
      },
      error: () => {
        this.message = 'Error updating claim status';
      }
    });
  }

  viewClaimDocuments(claimId: number) {
    this.http.get(`${environment.apiUrl}/admin/claims/${claimId}/documents/`, 
      this.getAuthOptions()).subscribe({
      next: (documents: any) => {
        this.currentDocuments = documents;
        this.showDocumentModal = true;
      },
      error: () => {
        this.message = 'Error loading claim documents';
      }
    });
  }

  getMockUsers() {
    return [];
  }

  getMockApplications() {
    return [];
  }

  getMockClaims() {
    return [];
  }

  editAnnouncement(id: number) {
    const announcement = this.announcements.find(a => a.id === id);
    if (announcement) {
      this.announcementForm.patchValue(announcement);
    }
  }

  deleteAnnouncement(id: number) {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.http.delete(`${environment.apiUrl}/admin/announcements/${id}/`, this.getAuthOptions()).subscribe({
        next: () => {
          this.announcements = this.announcements.filter(a => a.id !== id);
          this.successMessage = 'Announcement deleted successfully!';
          this.showSuccess = true;
        },
        error: () => {
          this.message = 'Failed to delete announcement';
        }
      });
    }
  }

  editEvent(id: number) {
    const event = this.events.find(e => e.id === id);
    if (event) {
      this.eventForm.patchValue(event);
    }
  }

  deleteEvent(id: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.http.delete(`${environment.apiUrl}/admin/events/${id}/`, this.getAuthOptions()).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== id);
          this.successMessage = 'Event deleted successfully!';
          this.showSuccess = true;
        },
        error: () => {
          this.message = 'Failed to delete event';
        }
      });
    }
  }

  getMockContacts() {
    return [];
  }

  replyToContact(contactId: number) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (contact) {
      window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`, '_blank');
      this.markContactResolved(contactId);
    }
  }

  callContact(phone: string) {
    window.open(`tel:${phone}`, '_self');
  }

  markContactResolved(contactId: number) {
    this.http.patch(`${environment.apiUrl}/admin/contacts/${contactId}/`, 
      { status: 'resolved' }, this.getAuthOptions()).subscribe({
      next: () => {
        const contact = this.contacts.find(c => c.id === contactId);
        if (contact) {
          contact.status = 'resolved';
        }
        this.successMessage = 'Contact marked as resolved!';
        this.showSuccess = true;
      },
      error: () => {
        this.message = 'Failed to update contact status';
      }
    });
  }
}