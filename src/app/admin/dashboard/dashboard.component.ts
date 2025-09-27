import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

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
    pendingApplications: 0
  };

  private apiUrl = environment.production ? 'https://api.pamojakenyamn.com' : 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.http.get(`${this.apiUrl}/api/admin/stats/`).subscribe({
      next: (data: any) => {
        this.stats = data;
      },
      error: () => {
        // Mock data for development
        this.stats = {
          totalUsers: 150,
          totalApplications: 89,
          totalPayments: 67,
          pendingApplications: 12
        };
      }
    });
  }
}