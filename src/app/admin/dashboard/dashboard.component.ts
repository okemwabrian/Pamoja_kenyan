import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalApplications: 0,
    totalPayments: 0,
    pendingApplications: 0,
    activeUsers: 0,
    totalRevenue: 0,
    recentRegistrations: 0
  };
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getAdminStats().subscribe({
      next: (data: any) => {
        this.stats = { ...this.stats, ...data };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard statistics from backend. Please check if the backend is running.';
        this.stats = {
          totalUsers: 0,
          totalApplications: 0,
          totalPayments: 0,
          pendingApplications: 0,
          activeUsers: 0,
          totalRevenue: 0,
          recentRegistrations: 0
        };
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }
}