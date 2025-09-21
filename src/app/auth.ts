import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private loggedIn: BehaviorSubject<boolean>;

  private apiUrl = 'http://localhost:8000/api';  // <-- Update with your backend URL

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  }

  login(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('auth_token', token);
    }
    this.loggedIn.next(true);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
    }
    this.loggedIn.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('auth_token');
  }

  private hasToken(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return !!localStorage.getItem('auth_token');
  }

  // New register method calling backend API
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, payload);
  }
}
