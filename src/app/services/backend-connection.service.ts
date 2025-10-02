import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendConnectionService {
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  public isConnected$ = this.isConnectedSubject.asObservable();
  
  private connectionStatus = 'disconnected';
  private lastChecked: Date | null = null;

  constructor(private http: HttpClient) {
    this.checkConnection();
    // Check connection every 30 seconds
    setInterval(() => this.checkConnection(), 30000);
  }

  checkConnection(): void {
    this.http.get(`${environment.apiUrl}/health/`, { timeout: 5000 }).subscribe({
      next: () => {
        this.connectionStatus = 'connected';
        this.isConnectedSubject.next(true);
        this.lastChecked = new Date();
        console.log('✅ Backend connected:', environment.apiUrl);
      },
      error: (error) => {
        this.connectionStatus = 'disconnected';
        this.isConnectedSubject.next(false);
        this.lastChecked = new Date();
        console.log('❌ Backend disconnected:', environment.apiUrl, error.status);
      }
    });
  }

  getConnectionStatus(): string {
    return this.connectionStatus;
  }

  getLastChecked(): Date | null {
    return this.lastChecked;
  }

  isBackendConnected(): boolean {
    return this.connectionStatus === 'connected';
  }
}