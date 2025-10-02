import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; border: 2px solid #ccc; margin: 20px;">
      <h3>Backend Connection Test</h3>
      
      <button (click)="testConnection()" [disabled]="testing">
        {{ testing ? 'Testing...' : 'Test Backend Connection' }}
      </button>
      
      <div *ngIf="results.length > 0" style="margin-top: 20px;">
        <h4>Test Results:</h4>
        <div *ngFor="let result of results" 
             [style.color]="result.success ? 'green' : 'red'"
             style="margin: 5px 0; padding: 5px; border-left: 3px solid;">
          <strong>{{result.test}}:</strong> {{result.message}}
          <div *ngIf="result.data" style="font-size: 12px; margin-top: 5px;">
            Data: {{result.data | json}}
          </div>
        </div>
      </div>
    </div>
  `
})
export class TestConnectionComponent {
  testing = false;
  results: any[] = [];

  constructor(private http: HttpClient) {}

  async testConnection() {
    this.testing = true;
    this.results = [];

    // Test 1: Basic backend connectivity
    await this.testEndpoint('Backend Reachable', 'GET', 'http://127.0.0.1:8000/');
    
    // Test 2: API base
    await this.testEndpoint('API Base', 'GET', 'http://127.0.0.1:8000/api/');
    
    // Test 3: Public announcements
    await this.testEndpoint('Public Announcements', 'GET', 'http://127.0.0.1:8000/api/notifications/announcements/');
    
    // Test 4: Login endpoint
    await this.testEndpoint('Login Endpoint', 'POST', 'http://127.0.0.1:8000/api/auth/login/', {
      username: 'admin',
      password: 'admin123'
    });
    
    // Test 5: Contact endpoint
    await this.testEndpoint('Contact Submit', 'POST', 'http://127.0.0.1:8000/api/notifications/contact/submit/', {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message'
    });
    
    // Test 6: Application endpoint
    await this.testEndpoint('Application Submit', 'POST', 'http://127.0.0.1:8000/api/applications/submit/', {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com'
    });

    this.testing = false;
  }

  private testEndpoint(testName: string, method: string, url: string, data?: any): Promise<void> {
    return new Promise((resolve) => {
      const request = method === 'GET' 
        ? this.http.get(url)
        : this.http.post(url, data, {
            headers: { 'Content-Type': 'application/json' }
          });

      request.subscribe({
        next: (response) => {
          this.results.push({
            test: testName,
            success: true,
            message: 'SUCCESS - Connected!',
            data: response
          });
          resolve();
        },
        error: (error) => {
          let message = 'FAILED';
          if (error.status === 0) {
            message = 'CORS ERROR or Backend Not Running';
          } else if (error.status === 404) {
            message = 'ENDPOINT NOT FOUND (404)';
          } else if (error.status === 400) {
            message = 'BAD REQUEST (400) - Data format issue';
          } else {
            message = `ERROR ${error.status}: ${error.statusText}`;
          }
          
          this.results.push({
            test: testName,
            success: false,
            message: message,
            data: error.error
          });
          resolve();
        }
      });
    });
  }
}