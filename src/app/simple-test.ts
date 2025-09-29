import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-simple-test',
  standalone: true,
  template: `
    <div style="padding: 2rem; background: white; margin: 2rem; border-radius: 10px;">
      <h1>🚀 System Test</h1>
      
      <div style="margin: 2rem 0;">
        <h3>Navigation Test:</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a routerLink="/" class="test-btn">Home</a>
          <a routerLink="/login" class="test-btn">Login</a>
          <a routerLink="/register" class="test-btn">Register</a>
          <a routerLink="/about" class="test-btn">About</a>
          <a routerLink="/membership" class="test-btn">Membership</a>
        </div>
      </div>
      
      <div style="margin: 2rem 0;">
        <h3>Backend Test:</h3>
        <button (click)="testBackend()" class="test-btn" [disabled]="testing">
          {{ testing ? 'Testing...' : 'Test Backend Connection' }}
        </button>
        <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
          <strong>Status:</strong> {{ backendStatus }}
        </div>
      </div>
    </div>
    
    <style>
      .test-btn {
        padding: 0.75rem 1.5rem;
        background: #667eea;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        display: inline-block;
        transition: background 0.3s ease;
      }
      .test-btn:hover {
        background: #5a6fd8;
      }
      .test-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    </style>
  `,
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class SimpleTest {
  backendStatus = 'Not tested';
  testing = false;

  constructor(private http: HttpClient) {}

  testBackend() {
    this.testing = true;
    this.backendStatus = 'Testing connection...';

    this.http.get('http://localhost:8000/api/').subscribe({
      next: (response) => {
        this.backendStatus = '✅ Backend Connected!';
        this.testing = false;
      },
      error: (error) => {
        this.backendStatus = `❌ Backend Error: ${error.status === 0 ? 'Server not running' : error.status}`;
        this.testing = false;
      }
    });
  }
}