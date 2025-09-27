import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = this.authService.getToken();
    
    if (isLoggedIn && userRole === 'admin') {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}