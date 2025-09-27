import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Application {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  application_type: string;
  status: string;
  created_at: string;
  amount: number;
}

@Component({
  selector: 'app-applications',
  standalone: true,
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = false;
  filterStatus = 'all';
  private apiUrl = environment.production ? 'https://api.pamojakenyamn.com' : 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.http.get<Application[]>(`${this.apiUrl}/api/admin/applications/`).subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: () => {
        // Mock data for development
        this.applications = [
          { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '123-456-7890', application_type: 'single', status: 'pending', created_at: '2024-01-15', amount: 627.30 },
          { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone: '098-765-4321', application_type: 'double', status: 'approved', created_at: '2024-01-20', amount: 1254.60 },
          { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', phone: '555-123-4567', application_type: 'single', status: 'rejected', created_at: '2024-01-25', amount: 627.30 }
        ];
        this.loading = false;
      }
    });
  }

  get filteredApplications(): Application[] {
    if (this.filterStatus === 'all') {
      return this.applications;
    }
    return this.applications.filter(app => app.status === this.filterStatus);
  }

  updateApplicationStatus(applicationId: number, status: string): void {
    this.http.patch(`${this.apiUrl}/api/admin/applications/${applicationId}/`, { status }).subscribe({
      next: () => {
        const app = this.applications.find(a => a.id === applicationId);
        if (app) {
          app.status = status;
        }
      },
      error: () => {
        alert('Error updating application status');
      }
    });
  }

  deleteApplication(applicationId: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.http.delete(`${this.apiUrl}/api/admin/applications/${applicationId}/`).subscribe({
        next: () => {
          this.applications = this.applications.filter(a => a.id !== applicationId);
        },
        error: () => {
          alert('Error deleting application');
        }
      });
    }
  }
}