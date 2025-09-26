import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private key = 'registrationData';

  setData(data: any): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  getData(): any {
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
    localStorage.removeItem(this.key);
  }
}
