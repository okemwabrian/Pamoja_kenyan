import { Injectable } from '@angular/core';
import { ContentService } from './services/content.service';

@Injectable({
  providedIn: 'root'
})
export class ClearDataService {
  
  constructor(private contentService: ContentService) {}

  clearAllDefaultData() {
    // Clear any cached data
    if (typeof window !== 'undefined') {
      // Clear localStorage except auth tokens
      const authToken = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userName = localStorage.getItem('userName');
      const userRole = localStorage.getItem('userRole');
      
      localStorage.clear();
      
      // Restore auth data if it exists
      if (authToken) localStorage.setItem('authToken', authToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (userName) localStorage.setItem('userName', userName);
      if (userRole) localStorage.setItem('userRole', userRole);
    }
    
    // Reset content service to empty
    this.contentService['eventsSubject'].next([]);
    this.contentService['announcementsSubject'].next([]);
    
    console.log('✅ All default data cleared - only backend data will be shown');
  }
}