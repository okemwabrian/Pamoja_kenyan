import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-backend',
  standalone: true,
  template: `
    <div style="padding: 2rem; background: white; margin: 2rem; border-radius: 10px;">
      <h1>🔌 Backend Connection Test</h1>
      
      <div style="margin: 2rem 0;">
        <h3>Connection Status:</h3>
        <div [style.color]="connectionStatus === 'Connected' ? 'green' : 'red'">
          {{ connectionStatus }}
        </div>
      </div>

      <div style="margin: 2rem 0;">
        <h3>Quick Login Test:</h3>
        <form (ngSubmit)="testLogin()" style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px;">
          <input 
            type="text" 
            [(ngModel)]="testCredentials.username" 
            name="username"
            placeholder="Username" 
            style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
          
          <input 
            type="password" 
            [(ngModel)]="testCredentials.password" 
            name="password"
            placeholder="Password" 
            style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
          
          <button 
            type="submit" 
            [disabled]="isLoading"
            style="padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
            {{ isLoading ? 'Testing...' : 'Test Login' }}
          </button>
        </form>
        
        <div style="margin-top: 1rem;">
          <button 
            (click)="fillTestCredentials('admin', 'admin123')"
            style="margin-right: 0.5rem; padding: 0.5rem 1rem; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Fill Admin
          </button>
          <button 
            (click)="fillTestCredentials('testuser', 'test123')"
            style="padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Fill Test User
          </button>
        </div>
      </div>

      <div style="margin: 2rem 0;">
        <h3>Response:</h3>
        <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto;">{{ responseMessage }}</pre>
      </div>

      <div style="margin: 2rem 0;">
        <h3>Backend URLs to Check:</h3>
        <ul>
          <li><a href="http://localhost:8000/api/" target="_blank">API Root</a></li>
          <li><a href="http://localhost:8000/admin/" target="_blank">Django Admin</a></li>
          <li><a href="http://localhost:8000/api/simple-login/" target="_blank">Login Endpoint</a></li>
        </ul>
      </div>
    </div>
  `,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class TestBackend implements OnInit {
  connectionStatus = 'Testing...';
  responseMessage = 'No response yet';
  isLoading = false;
  
  testCredentials = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.testConnection();
  }

  testConnection() {
    this.http.get('http://localhost:8000/api/').subscribe({
      next: (response) => {
        this.connectionStatus = 'Connected ✅';
        this.responseMessage = JSON.stringify(response, null, 2);
      },
      error: (error) => {
        this.connectionStatus = 'Connection Failed ❌';
        this.responseMessage = `Error: ${error.status} - ${error.message}`;
        
        if (error.status === 0) {
          this.responseMessage += '\n\nPossible issues:\n1. Backend server not running\n2. CORS not configured\n3. Wrong URL';
        }
      }
    });
  }

  fillTestCredentials(username: string, password: string) {
    this.testCredentials.username = username;
    this.testCredentials.password = password;
  }

  testLogin() {
    if (!this.testCredentials.username || !this.testCredentials.password) {
      this.responseMessage = 'Please fill in both username and password';
      return;
    }

    this.isLoading = true;
    this.responseMessage = 'Sending login request...';

    this.http.post('http://localhost:8000/api/simple-login/', this.testCredentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.responseMessage = `SUCCESS! 🎉\n\nUser: ${response.user?.first_name} ${response.user?.last_name}\nRole: ${response.user?.is_staff ? 'Admin' : 'User'}\nToken: ${response.access?.substring(0, 20)}...`;
      },
      error: (error) => {
        this.isLoading = false;
        this.responseMessage = `LOGIN FAILED ❌\n\nStatus: ${error.status}\nError: ${error.error?.error || error.message}\n\nFull Response:\n${JSON.stringify(error.error, null, 2)}`;
      }
    });
  }
}