import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendConnectionService } from '../services/backend-connection.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  template: `
    <div class="connection-status" [class.connected]="isConnected" [class.disconnected]="!isConnected">
      <span class="status-indicator"></span>
      <span class="status-text">
        {{ isConnected ? 'Backend Connected' : 'Backend Disconnected - Using Mock Data' }}
      </span>
      <button class="retry-btn" *ngIf="!isConnected" (click)="retryConnection()">
        Retry
      </button>
    </div>
  `,
  styles: [`
    .connection-status {
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .connected {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .disconnected {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .connected .status-indicator {
      background: #28a745;
    }
    .disconnected .status-indicator {
      background: #dc3545;
    }
    .retry-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 2px 6px;
      border-radius: 2px;
      cursor: pointer;
      font-size: 10px;
    }
  `],
  imports: [CommonModule]
})
export class ConnectionStatusComponent implements OnInit {
  isConnected = false;

  constructor(private connectionService: BackendConnectionService) {}

  ngOnInit() {
    this.connectionService.isConnected$.subscribe(connected => {
      this.isConnected = connected;
    });
  }

  retryConnection() {
    this.connectionService.checkConnection();
  }
}