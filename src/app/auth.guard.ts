import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard: Access granted');
      return true;
    } else {
      console.log('AuthGuard: Access denied, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdmin = this.authService.isAdmin();
    const userData = this.authService.getUserData();
    
    console.log('AdminGuard check:', { isAuthenticated, isAdmin, userData });
    
    if (isAuthenticated && isAdmin) {
      console.log('AdminGuard: Access granted');
      return true;
    } else {
      console.log('AdminGuard: Access denied, redirecting to admin-login');
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}