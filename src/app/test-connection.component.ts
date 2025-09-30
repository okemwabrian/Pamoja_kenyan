import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  template: `
    <div class="test-container">
      <h2>Backend Connection Test</h2>
      <button (click)="testConnection()" [disabled]="testing" class="test-btn">
        {{ testing ? 'Testing...' : 'Test Backend Connection' }}
      </button>
      
      <div *ngIf="result" class="result" [class.success]="success" [class.error]="!success">
        <h3>{{ success ? '✅ Success' : '❌ Failed' }}</h3>
        <p>{{ result }}</p>
      </div>

      <div class="endpoints">
        <h3>Available Endpoints:</h3>
        <ul>
          <li>POST /api/auth/login/ - User login</li>
          <li>POST /api/auth/register/ - User registration</li>
          <li>GET /api/applications/my-applications/ - User applications</li>
          <li>GET /api/admin/users/ - Admin: Get users</li>
          <li>GET /api/admin/stats/ - Admin: Dashboard stats</li>
          <li>GET /api/events/ - Get events</li>
          <li>GET /api/announcements/ - Get announcements</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .test-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .test-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .result {
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
    }
    
    .result.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .result.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .endpoints {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .endpoints ul {
      list-style-type: none;
      padding: 0;
    }
    
    .endpoints li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #dee2e6;
      font-family: monospace;
    }
  `],
  imports: [CommonModule]
})
export class TestConnectionComponent {
  testing = false;
  result = '';
  success = false;

  constructor(private apiService: ApiService) {}

  testConnection() {
    this.testing = true;
    this.result = '';
    
    this.apiService.testConnection().subscribe({
      next: (response) => {
        this.success = true;
        this.result = 'Backend is connected and responding! ✅';
        this.testing = false;
      },
      error: (error) => {
        this.success = false;
        if (error.includes('Error Code: 0')) {
          this.result = 'Backend is not running. Please start: py manage.py runserver';
        } else {
          this.result = `Connection test result: ${error}`;
        }
        this.testing = false;
      }
    });
  }
}