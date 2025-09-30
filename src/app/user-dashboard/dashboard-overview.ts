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
    private contentService: ContentService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // Load membership info from applications
    this.http.get('http://localhost:8000/api/applications/my-applications/', options).subscribe({
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
    this.http.get('http://localhost:8000/api/applications/my-applications/', options).subscribe({
      next: (apps: any) => {
        this.recentApplications = apps.slice(0, 3);
      },
      error: () => {
        this.recentApplications = [];
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

    // Load recent activities from backend
    this.http.get('http://localhost:8000/api/activities/', options).subscribe({
      next: (activities: any) => {
        this.recentActivities = activities.slice(0, 5);
      },
      error: () => {
        this.recentActivities = [];
      }
    });

    // Load events from backend only
    this.http.get('http://localhost:8000/api/notifications/events/', options).subscribe({
      next: (events: any) => {
        this.events = events.slice(0, 3);
      },
      error: () => {
        this.events = [];
      }
    });

    // Load announcements from backend only
    this.http.get('http://localhost:8000/api/notifications/announcements/', options).subscribe({
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

  calculateShares(amount: number): number {
    // $200 = Single membership, $400 = Double membership
    if (amount >= 400) return 400;
    if (amount >= 200) return 200;
    return amount || 0;
  }
}