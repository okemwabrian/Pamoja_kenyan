import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; max-width: 600px; margin: 0 auto; font-family: Arial;">
      <h2>🔗 Backend Connection Test</h2>
      <button (click)="testConnection()" 
              style="background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
        Test Backend Connection
      </button>
      
      <div *ngIf="testResults.length > 0" style="margin-top: 20px;">
        <h3>📊 Test Results:</h3>
        <div *ngFor="let result of testResults" 
             style="padding: 12px; margin: 8px 0; border-radius: 5px; border-left: 4px solid;"
             [style.background-color]="result.status === 'success' ? '#d4edda' : '#f8d7da'"
             [style.border-left-color]="result.status === 'success' ? '#28a745' : '#dc3545'"
             [style.color]="result.status === 'success' ? '#155724' : '#721c24'">
          <strong>{{ result.endpoint }}</strong>: {{ result.message }}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px;">
          <h4>📋 Summary:</h4>
          <p><strong>✅ Working:</strong> {{ getSuccessCount() }}/{{ testResults.length }}</p>
          <p><strong>❌ Failed:</strong> {{ getFailureCount() }}/{{ testResults.length }}</p>
          <p><strong>Backend Status:</strong> 
            <span [style.color]="getSuccessCount() > 0 ? '#28a745' : '#dc3545'">
              {{ getSuccessCount() > 0 ? 'Partially Connected' : 'Disconnected' }}
            </span>
          </p>
        </div>
      </div>
    </div>
  `
})
export class TestConnectionComponent {
  testResults: any[] = [];

  constructor(private http: HttpClient) {}

  testConnection() {
    this.testResults = [];
    const baseUrl = 'http://localhost:8000/api';
    
    const endpoints = [
      { url: `${baseUrl}/applications/my-applications/`, name: 'Applications' },
      { url: `${baseUrl}/notifications/events/`, name: 'Events' },
      { url: `${baseUrl}/notifications/announcements/`, name: 'Announcements' },
      { url: `${baseUrl}/admin/users/`, name: 'Admin Users' },
      { url: `${baseUrl}/auth/contact/`, name: 'Contact' }
    ];

    endpoints.forEach(endpoint => {
      this.http.get(endpoint.url).subscribe({
        next: (data) => {
          this.testResults.push({
            endpoint: endpoint.name,
            status: 'success',
            message: `✅ Connected - ${Array.isArray(data) ? data.length + ' items' : 'Data received'}`
          });
        },
        error: (error) => {
          this.testResults.push({
            endpoint: endpoint.name,
            status: 'error',
            message: `❌ Error ${error.status || 'Connection'} - ${error.statusText || 'Failed'}`
          });
        }
      });
    });
  }

  getSuccessCount(): number {
    return this.testResults.filter(r => r.status === 'success').length;
  }

  getFailureCount(): number {
    return this.testResults.filter(r => r.status === 'error').length;
  }
}