import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class Header implements OnInit {
  isMenuOpen = false;
  showNotifications = false;
  showUserMenu = false;
  notifications: any[] = [];
  unreadCount = 0;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loadNotifications();
    }
    
    // Close dropdowns when clicking outside
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-dropdown') && !target.closest('.dropdown-menu')) {
          this.showUserMenu = false;
        }
        if (!target.closest('.notifications') && !target.closest('.notifications-dropdown')) {
          this.showNotifications = false;
        }
      });
    }
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  }

  getUserName(): string {
    if (typeof window !== 'undefined') {
      const userName = localStorage.getItem('userName');
      if (userName && userName !== 'null' && userName.trim() !== '') {
        return userName;
      }
      const username = localStorage.getItem('userUsername');
      if (username && username !== 'null') {
        return username;
      }
    }
    return 'User';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  loadNotifications() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    this.http.get('http://localhost:8000/api/notifications/list/', options).subscribe({
      next: (data: any) => {
        this.notifications = data.slice(0, 5);
        this.unreadCount = data.filter((n: any) => !n.is_read).length;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.notifications = [
          {
            id: 1,
            title: 'Welcome!',
            message: 'Welcome to Pamoja Kenya MN',
            is_read: false,
            created_at: new Date().toISOString()
          }
        ];
        this.unreadCount = 1;
      }
    });
  }

  markAsRead(notificationId: number) {
    if (typeof window === 'undefined') return;
    
    // Update locally
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.is_read) {
      notification.is_read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      console.log('Notification marked as read');
    }
  }

  markAllRead() {
    // Update all notifications locally
    this.notifications.forEach(n => {
      if (!n.is_read) {
        n.is_read = true;
      }
    });
    this.unreadCount = 0;
    console.log('All notifications marked as read');
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  isAdmin(): boolean {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const username = localStorage.getItem('userUsername');
      return userRole === 'admin' || username === 'admin';
    }
    return false;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
    }
    this.router.navigate(['/']);
  }
}