import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private warningTimer: any;
  private logoutTimer: any;
  private warningShown = false;
  private readonly USER_WARNING_TIME = 9 * 60 * 1000; // 9 minutes for users
  private readonly USER_LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes for users
  private readonly ADMIN_TIMEOUT_DISABLED = true; // Admins don't timeout

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (typeof document !== 'undefined') {
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, () => this.resetTimer(), true);
      });
    }
  }

  startTimer() {
    this.resetTimer();
  }

  private resetTimer() {
    this.clearTimers();
    this.warningShown = false;

    // Check if user is admin - no timeout for admins
    if (this.isAdmin()) {
      return; // Admins don't get timed out
    }

    // Set warning timer (9 minutes) for regular users
    this.warningTimer = setTimeout(() => {
      this.showWarning();
    }, this.USER_WARNING_TIME);

    // Set logout timer (10 minutes) for regular users
    this.logoutTimer = setTimeout(() => {
      this.forceLogout();
    }, this.USER_LOGOUT_TIME);
  }

  private showWarning() {
    if (this.warningShown) return;
    this.warningShown = true;

    const confirmed = confirm('Your session will expire in 1 minute due to inactivity. Click OK to stay logged in.');
    
    if (confirmed) {
      this.resetTimer();
    }
  }

  private forceLogout() {
    alert('Your session has expired due to inactivity. You will be logged out.');
    this.authService.logout();
  }

  private clearTimers() {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  stopTimer() {
    this.clearTimers();
  }

  private isAdmin(): boolean {
    if (typeof window === 'undefined') return false;
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user.is_admin === true;
    } catch {
      return false;
    }
  }
}