import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../services/content.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  templateUrl: './dashboard-overview.html',
  styleUrls: ['./dashboard-overview.css'],
  imports: [CommonModule, RouterModule]
})
export class DashboardOverview implements OnInit {
  userStats: any = {};
  recentApplications: any[] = [];
  recentClaims: any[] = [];
  recentActivities: any[] = [];
  notifications: any[] = [];
  events: any[] = [];
  announcements: any[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // Load user stats
    this.http.get('http://localhost:8000/api/auth/stats/', options).subscribe({
      next: (stats: any) => {
        this.userStats = stats;
      },
      error: () => {
        this.userStats = {
          applications: 2,
          claims: 1,
          payments: 3,
          membershipStatus: 'Active',
          totalPaid: 627.30
        };
      }
    });

    // Load recent applications
    this.http.get('http://localhost:8000/api/applications/my-applications/', options).subscribe({
      next: (apps: any) => {
        this.recentApplications = apps.slice(0, 3);
      },
      error: () => {
        this.recentApplications = [
          {
            id: 1,
            type: 'Single Family',
            status: 'Approved',
            amount: 627.30,
            created_at: '2025-09-20'
          }
        ];
      }
    });

    // Mock recent claims
    this.recentClaims = [];

    // Load notifications
    this.http.get('http://localhost:8000/api/notifications/list/', options).subscribe({
      next: (notifications: any) => {
        this.notifications = notifications.slice(0, 5);
      },
      error: () => {
        this.notifications = [];
      }
    });

    // Mock recent activities
    this.recentActivities = [
      {
        id: 1,
        action: 'Application Submitted',
        description: 'Single family membership application',
        date: '2025-09-28',
        type: 'application'
      },
      {
        id: 2,
        action: 'Payment Made',
        description: 'Membership fee payment of $627.30',
        date: '2025-09-27',
        type: 'payment'
      },
      {
        id: 3,
        action: 'Profile Updated',
        description: 'Contact information updated',
        date: '2025-09-26',
        type: 'profile'
      }
    ];

    // Load events from ContentService
    this.contentService.events$.subscribe(events => {
      this.events = events;
    });

    // Load announcements from ContentService
    this.contentService.announcements$.subscribe(announcements => {
      this.announcements = announcements;
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
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userName') || 'User';
    }
    return 'User';
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
}