import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface LoginPayload {
  identifier: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  phone?: string;
}

interface AuthResponse {
  user: any;
  tokens: {
    access: string;
    refresh: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private loggedIn: BehaviorSubject<boolean>;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  }

  // Backend login method
  loginWithBackend(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, payload)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem('authToken', response.tokens.access);
            localStorage.setItem('refreshToken', response.tokens.refresh);
            localStorage.setItem('userRole', response.user.role);
            localStorage.setItem('userData', JSON.stringify(response.user));
          }
          this.loggedIn.next(true);
        })
      );
  }

  // Simple login for testing
  login(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('authToken', token);
    }
    this.loggedIn.next(true);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
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
    return localStorage.getItem('authToken');
  }

  private hasToken(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return !!localStorage.getItem('authToken');
  }

  // Register method calling backend API
  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register/`, payload)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem('authToken', response.tokens.access);
            localStorage.setItem('refreshToken', response.tokens.refresh);
            localStorage.setItem('userRole', response.user.role);
            localStorage.setItem('userData', JSON.stringify(response.user));
          }
          this.loggedIn.next(true);
        })
      );
  }

  // Get user data
  getUserData(): any {
    if (!this.isBrowser) return null;
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Get user role
  getUserRole(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('userRole');
  }
}
