import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUserEvents();
  }

  loadUserEvents() {
    if (typeof window === 'undefined') return;

    // Mock data for demonstration
    this.userEvents = [
      {
        id: 1,
        title: 'Annual General Meeting',
        description: 'Join us for our annual general meeting to discuss the year\'s progress.',
        date: '2025-10-15T14:00:00Z',
        location: 'Community Center, Minneapolis',
        is_featured: true,
        registered: true,
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Financial Literacy Workshop',
        description: 'Learn about financial planning and investment strategies.',
        date: '2025-11-20T18:00:00Z',
        location: 'Online via Zoom',
        is_featured: false,
        registered: true,
        status: 'upcoming'
      },
      {
        id: 3,
        title: 'Community Fundraiser',
        description: 'Annual fundraising event for community development projects.',
        date: '2025-09-15T16:00:00Z',
        location: 'Pamoja Community Hall',
        is_featured: true,
        registered: false,
        status: 'past'
      }
    ];
    this.categorizeEvents();
    this.isLoading = false;
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
    if (event) {
      event.registered = true;
    }
  }
}