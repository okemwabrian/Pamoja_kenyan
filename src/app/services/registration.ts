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
    return raw ? JSON.parse(raw) : null;
  }

  clearData(): void {
    localStorage.removeItem(this.key);
  }
}
