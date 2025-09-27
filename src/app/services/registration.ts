import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private key = 'registrationData';

  setData(data: any): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.key, JSON.stringify(data));
    }
  }

  getData(): any {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }
    
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error('Failed to parse registration data:', error);
      return null;
    }
  }

  clearData(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.key);
    }
  }
}
