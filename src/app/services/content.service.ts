import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private eventsSubject = new BehaviorSubject<any[]>([]);
  private announcementsSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    // Initialize with empty arrays - no default data
    this.eventsSubject.next([]);
    this.announcementsSubject.next([]);
  }

  events$ = this.eventsSubject.asObservable();
  announcements$ = this.announcementsSubject.asObservable();

  addEvent(event: any) {
    const currentEvents = this.eventsSubject.value;
    const newEvent = {
      ...event,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    this.eventsSubject.next([newEvent, ...currentEvents]);
  }

  addAnnouncement(announcement: any) {
    const currentAnnouncements = this.announcementsSubject.value;
    const newAnnouncement = {
      ...announcement,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0]
    };
    this.announcementsSubject.next([newAnnouncement, ...currentAnnouncements]);
  }

  getEvents() {
    return this.eventsSubject.value;
  }

  getAnnouncements() {
    return this.announcementsSubject.value;
  }
}