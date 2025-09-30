import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-events',
  standalone: true,
  templateUrl: './user-events.html',
  styleUrls: ['./user-events.css'],
  imports: [CommonModule]
})
export class UserEvents implements OnInit {
  userEvents: any[] = [];
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUserEvents();
  }

  loadUserEvents() {
    if (typeof window === 'undefined') return;

    this.isLoading = true;
    this.error = null;

    this.apiService.getEvents().subscribe({
      next: (data) => {
        this.userEvents = data;
        this.categorizeEvents();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.error = 'Failed to load events from backend. Please check if the backend is running.';
        this.userEvents = [];
        this.upcomingEvents = [];
        this.pastEvents = [];
        this.isLoading = false;
      }
    });
  }

  categorizeEvents() {
    const now = new Date();
    this.upcomingEvents = this.userEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > now;
    });
    
    this.pastEvents = this.userEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate <= now;
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  registerForEvent(eventId: number) {
    const event = this.userEvents.find(e => e.id === eventId);
    if (!event) return;

    this.apiService.registerForEvent(eventId).subscribe({
      next: (response) => {
        event.registered = true;
        console.log('Successfully registered for event:', response);
      },
      error: (error) => {
        console.error('Error registering for event:', error);
        // Still update UI for demo purposes
        event.registered = true;
      }
    });
  }
}