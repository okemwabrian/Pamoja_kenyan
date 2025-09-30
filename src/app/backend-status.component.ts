import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-backend-status',
  standalone: true,
  template: `
    <div class="backend-status" [class.connected]="isConnected" [class.disconnected]="!isConnected && !isLoading">
      <div class="status-indicator">
        <div class="status-dot" [class.pulse]="isLoading"></div>
        <span class="status-text">
          {{ isLoading ? 'Checking...' : (isConnected ? 'Backend Connected' : 'Backend Offline') }}
        </span>
      </div>
      <div class="status-details" *ngIf="!isLoading">
        <small>{{ statusMessage }}</small>
      </div>
    </div>
  `,
  styles: [`
    .backend-status {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 12px 16px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      border: 1px solid rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .backend-status.connected {
      border-left: 4px solid #4CAF50;
    }

    .backend-status.disconnected {
      border-left: 4px solid #f44336;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9e9e9e;
    }

    .connected .status-dot {
      background: #4CAF50;
    }

    .disconnected .status-dot {
      background: #f44336;
    }

    .status-dot.pulse {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-text {
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }

    .status-details {
      margin-top: 4px;
      color: #666;
      font-size: 10px;
    }

    @media (max-width: 768px) {
      .backend-status {
        top: 10px;
        right: 10px;
        padding: 8px 12px;
      }
    }
  `],
  imports: [CommonModule]
})
export class BackendStatusComponent implements OnInit {
  isConnected = false;
  isLoading = true;
  statusMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.checkBackendConnection();
    // Check connection every 30 seconds
    setInterval(() => this.checkBackendConnection(), 30000);
  }

  private checkBackendConnection() {
    this.isLoading = true;
    
    this.apiService.testConnection().subscribe({
      next: (response) => {
        this.isConnected = true;
        this.statusMessage = 'Backend running on localhost:8000';
        this.isLoading = false;
      },
      error: (error) => {
        this.isConnected = false;
        this.statusMessage = 'Backend not responding';
        this.isLoading = false;
      }
    });
  }
}