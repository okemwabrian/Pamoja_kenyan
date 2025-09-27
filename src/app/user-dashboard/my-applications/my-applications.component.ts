import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    // Mock data - replace with real API call
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
}