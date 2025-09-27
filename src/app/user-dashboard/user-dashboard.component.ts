import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class UserDashboardComponent implements OnInit {
  userStats = {
    applications: 0,
    payments: 0,
    membershipStatus: 'Pending',
    totalPaid: 0
  };

  recentActivities: any[] = [];
  private apiUrl = 'http://localhost:8000';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserStats();
    this.loadRecentActivities();
  }

  loadUserStats(): void {
    const token = localStorage.getItem('authToken');
    const options = token ? {
      headers: { 'Authorization': `Bearer ${token}` }
    } : {};
    
    this.http.get(`${this.apiUrl}/api/auth/stats/`, options).subscribe({
      next: (data: any) => {
        this.userStats = data;
      },
      error: () => {
        // Mock data for development
        this.userStats = {
          applications: 2,
          payments: 1,
          membershipStatus: 'Active',
          totalPaid: 627.30
        };
      }
    });
  }

  loadRecentActivities(): void {
    // Mock data for development - replace with real API call when backend is ready
    this.recentActivities = [
      { type: 'payment', description: 'Payment completed for Single Membership', date: '2024-01-20', status: 'success' },
      { type: 'application', description: 'Single Family Application submitted', date: '2024-01-15', status: 'pending' },
      { type: 'profile', description: 'Profile information updated', date: '2024-01-10', status: 'info' }
    ];
  }

  navigateToApplications(): void {
    this.router.navigate(['/user-dashboard/applications']);
  }

  navigateToPayments(): void {
    this.router.navigate(['/user-dashboard/payments']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/user-dashboard/profile']);
  }
}