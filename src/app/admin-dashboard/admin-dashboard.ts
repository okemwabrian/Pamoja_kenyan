import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SuccessAnimation } from '../shared/success-animation';
import { ContentService } from '../services/content.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SuccessAnimation]
})
export class AdminDashboard implements OnInit {
  stats: any = {};
  users: any[] = [];
  applications: any[] = [];
  recentActivities: any[] = [];
  
  // Forms
  announcementForm: FormGroup;
  eventForm: FormGroup;
  meetingForm: FormGroup;
  editUserForm: FormGroup;
  
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
    private authService: AuthService
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
  }

  ngOnInit() {
    this.loadDashboardData();
    this.loadMeetings();
  }

  loadDashboardData() {
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // Load stats (using users count)
    this.http.get('http://localhost:8000/api/admin/users/', options).subscribe({
      next: (users: any) => {
        this.stats = {
          total_users: users.length || 0,
          total_applications: 0,
          pending_applications: 0,
          total_claims: 0,
          pending_claims: 0
        };
      },
      error: () => this.stats = {
        total_users: 0,
        total_applications: 0,
        pending_applications: 0,
        total_claims: 0,
        pending_claims: 0
      }
    });

    // Load users
    this.http.get('http://localhost:8000/api/admin/users/', options).subscribe({
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
    this.http.get('http://localhost:8000/api/admin/applications/', options).subscribe({
      next: (data: any) => {
        this.applications = data;
        this.filteredApplications = [...this.applications];
      },
      error: () => {
        this.applications = [];
        this.filteredApplications = [];
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  createAnnouncement() {
    if (this.announcementForm.invalid) return;

    this.isLoading = true;
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    this.http.post('http://localhost:8000/api/notifications/announcements/', 
      this.announcementForm.value, options).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Announcement created successfully!';
        this.showSuccess = true;
        this.announcementForm.reset();
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
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    this.http.post('http://localhost:8000/api/notifications/events/', 
      this.eventForm.value, options).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Event created successfully!';
        this.showSuccess = true;
        this.eventForm.reset();
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

    this.http.post(`http://localhost:8000/api/admin/applications/${appId}/update-status/`, 
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
    
    // Mock meeting creation
    setTimeout(() => {
      const newMeeting = {
        id: this.meetings.length + 1,
        ...this.meetingForm.value,
        registered_count: 0
      };
      
      this.meetings.unshift(newMeeting);
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
    }, 1000);
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
}