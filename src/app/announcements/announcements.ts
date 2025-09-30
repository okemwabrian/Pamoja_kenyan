import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-announcements',
  standalone: true,
  templateUrl: './announcements.html',
  styleUrls: ['./announcements.css'],
  imports: [CommonModule, RouterModule]
})
export class Announcements implements OnInit {
  announcements: any[] = [];
  events: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAnnouncements();
    this.loadEvents();
  }

  loadAnnouncements() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    this.http.get('http://localhost:8000/api/notifications/announcements/', options).subscribe({
      next: (data: any) => {
        this.announcements = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
        this.announcements = [];
        this.isLoading = false;
      }
    });
  }

  loadEvents() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    this.http.get('http://localhost:8000/api/notifications/events/', options).subscribe({
      next: (data: any) => {
        this.events = data;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.events = [];
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  }
}