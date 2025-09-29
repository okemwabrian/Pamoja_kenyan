import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-connection-test',
  standalone: true,
  templateUrl: './connection-test.html',
  imports: [CommonModule]
})
export class ConnectionTest implements OnInit {
  backendStatus = 'Testing...';
  backendUrl = 'http://localhost:8000';
  testResults: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.testBackendConnection();
  }

  testBackendConnection() {
    // Test basic connection
    this.http.get(`${this.backendUrl}/api/auth/test/`).subscribe({
      next: (response) => {
        this.backendStatus = 'Connected ✅';
        this.testResults.push({ test: 'Basic Connection', status: 'Success', response });
        this.testAuthEndpoints();
      },
      error: (error) => {
        this.backendStatus = 'Disconnected ❌';
        this.testResults.push({ test: 'Basic Connection', status: 'Failed', error: error.message });
      }
    });
  }

  testAuthEndpoints() {
    // Test login endpoint
    this.http.post(`${this.backendUrl}/api/auth/login/`, {}).subscribe({
      next: (response) => {
        this.testResults.push({ test: 'Login Endpoint', status: 'Available', response });
      },
      error: (error) => {
        this.testResults.push({ test: 'Login Endpoint', status: 'Available (400 expected)', error: error.status });
      }
    });

    // Test register endpoint
    this.http.post(`${this.backendUrl}/api/auth/register/`, {}).subscribe({
      next: (response) => {
        this.testResults.push({ test: 'Register Endpoint', status: 'Available', response });
      },
      error: (error) => {
        this.testResults.push({ test: 'Register Endpoint', status: 'Available (400 expected)', error: error.status });
      }
    });
  }
}