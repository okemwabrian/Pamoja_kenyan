import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.apiService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: () => {
        // Mock data for development
        this.applications = [
          {
            id: 1,
            application_type: 'single',
            amount: 627.30,
            status: 'approved',
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            application_type: 'double',
            amount: 1254.60,
            status: 'pending',
            created_at: '2024-01-20T14:30:00Z'
          }
        ];
      }
    });
  }
}