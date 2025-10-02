import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../services/content.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SessionTimeoutService } from '../services/session-timeout.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  templateUrl: './dashboard-overview.html',
  styleUrls: ['./dashboard-overview.css'],
  imports: [CommonModule, RouterModule]
})
export class DashboardOverview implements OnInit {
  userStats: any = {};
  membershipInfo: any = {};
  recentApplications: any[] = [];
  recentClaims: any[] = [];
  recentActivities: any[] = [];
  notifications: any[] = [];
  events: any[] = [];
  announcements: any[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    private contentService: ContentService,
    private apiService: ApiService,
    private authService: AuthService,
    private sessionTimeout: SessionTimeoutService
  ) {}

  ngOnInit() {
    this.sessionTimeout.startTimer();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // Load membership info from applications
    this.apiService.getMembershipInfo().subscribe({
      next: (apps: any) => {
        if (apps && apps.length > 0) {
          const latestApp = apps[0];
          this.membershipInfo = {
            type: latestApp.membership_type || 'Single',
            shares: this.calculateShares(latestApp.amount),
            status: latestApp.status || 'Active',
            totalPaid: latestApp.amount || 0
          };
        } else {
          this.membershipInfo = {
            type: 'None',
            shares: 0,
            status: 'Inactive',
            totalPaid: 0
          };
        }
      },
      error: () => {
        this.membershipInfo = {
          type: 'None',
          shares: 0,
          status: 'Inactive',
          totalPaid: 0
        };
      }
    });

    // Load recent applications
    this.apiService.getApplications().subscribe({
      next: (apps: any) => {
        this.recentApplications = apps.slice(0, 3);
        this.addToActivities(apps, 'application');
      },
      error: () => {
        this.recentApplications = [];
      }
    });

    // Load recent claims
    this.apiService.getClaims().subscribe({
      next: (claims: any) => {
        this.recentClaims = claims.slice(0, 3);
        this.addToActivities(claims, 'claim');
      },
      error: () => {
        this.recentClaims = [];
      }
    });

    // Load payments
    this.apiService.getPayments().subscribe({
      next: (payments: any) => {
        this.addToActivities(payments, 'payment');
      },
      error: () => {}
    });

    // Load events
    this.apiService.getEvents().subscribe({
      next: (events: any) => {
        this.events = events.slice(0, 3);
      },
      error: () => {
        this.events = [];
      }
    });

    // Load announcements
    this.apiService.getAnnouncements().subscribe({
      next: (announcements: any) => {
        this.announcements = announcements.slice(0, 3);
      },
      error: () => {
        this.announcements = [];
      }
    });

    this.isLoading = false;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'active': return 'status-active';
      default: return 'status-default';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'application': return '📋';
      case 'payment': return '💳';
      case 'claim': return '🏥';
      case 'profile': return '👤';
      default: return '📌';
    }
  }

  getUserName(): string {
    const userData = this.authService.getUserData();
    if (userData && userData.name) {
      return userData.name.split(' ')[0]; // First name only
    }
    return 'User';
  }

  addToActivities(items: any[], type: string) {
    const activities = items.slice(0, 2).map(item => ({
      type: type,
      action: this.getActivityAction(type, item),
      description: this.getActivityDescription(type, item),
      date: item.created_at || new Date().toISOString()
    }));
    this.recentActivities = [...this.recentActivities, ...activities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  getActivityAction(type: string, item: any): string {
    switch (type) {
      case 'application': return 'Application Submitted';
      case 'claim': return 'Claim Filed';
      case 'payment': return 'Payment Made';
      default: return 'Activity';
    }
  }

  getActivityDescription(type: string, item: any): string {
    switch (type) {
      case 'application': return `${item.membership_type || 'Membership'} application for $${item.amount}`;
      case 'claim': return `${item.claim_type} claim for $${item.amount_requested}`;
      case 'payment': return `Payment of $${item.amount} processed`;
      default: return 'Recent activity';
    }
  }

  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  }

  calculateShares(amount: number): number {
    // $200 = Single membership, $400 = Double membership
    if (amount >= 400) return 400;
    if (amount >= 200) return 200;
    return amount || 0;
  }
}