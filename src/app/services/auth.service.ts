import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isAdmin$ = this.isAdminSubject.asObservable();
  public userData$ = this.userDataSubject.asObservable();

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      this.isAuthenticatedSubject.next(true);
      this.isAdminSubject.next(userRole === 'admin');
      
      const userData = {
        id: userId,
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail'),
        role: userRole,
        isStaff: localStorage.getItem('isStaff') === 'true',
        isSuperuser: localStorage.getItem('isSuperuser') === 'true'
      };
      
      this.userDataSubject.next(userData);
      console.log('Auth status checked:', { authenticated: true, isAdmin: userRole === 'admin', userData });
    } else {
      this.clearAuthState();
    }
  }

  public setAuthData(response: any): void {
    if (typeof window === 'undefined') return;

    // Store tokens
    localStorage.setItem('authToken', response.tokens.access);
    localStorage.setItem('refreshToken', response.tokens.refresh);
    
    // Store user data
    localStorage.setItem('userName', response.user.first_name + ' ' + response.user.last_name);
    localStorage.setItem('userRole', response.user.is_staff ? 'admin' : 'user');
    localStorage.setItem('userId', response.user.id.toString());
    localStorage.setItem('userEmail', response.user.email);
    localStorage.setItem('isStaff', response.user.is_staff.toString());
    localStorage.setItem('isSuperuser', response.user.is_superuser.toString());

    // Update subjects
    this.isAuthenticatedSubject.next(true);
    this.isAdminSubject.next(response.user.is_staff);
    
    const userData = {
      id: response.user.id,
      name: response.user.first_name + ' ' + response.user.last_name,
      email: response.user.email,
      role: response.user.is_staff ? 'admin' : 'user',
      isStaff: response.user.is_staff,
      isSuperuser: response.user.is_superuser
    };
    
    this.userDataSubject.next(userData);
    console.log('Auth data set:', userData);
  }

  public clearAuthState(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isStaff');
      localStorage.removeItem('isSuperuser');
    }

    this.isAuthenticatedSubject.next(false);
    this.isAdminSubject.next(false);
    this.userDataSubject.next(null);
    console.log('Auth state cleared');
  }

  public logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  public adminLogout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken') && !!localStorage.getItem('userId');
  }

  public isAdmin(): boolean {
    if (typeof window === 'undefined') return false;
    return this.isAuthenticated() && localStorage.getItem('userRole') === 'admin';
  }

  public getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  public getUserData(): any {
    if (typeof window === 'undefined') return null;
    
    const userId = localStorage.getItem('userId');
    if (!userId) return null;

    return {
      id: userId,
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('userRole'),
      isStaff: localStorage.getItem('isStaff') === 'true',
      isSuperuser: localStorage.getItem('isSuperuser') === 'true'
    };
  }
}