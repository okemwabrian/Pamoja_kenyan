import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [CommonModule, RouterModule]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users from backend. Please check if the backend is running.';
        this.users = [];
        this.loading = false;
      }
    });
  }

  toggleUserStatus(user: User): void {
    const originalStatus = user.is_active;
    user.is_active = !user.is_active;
    
    this.apiService.updateUserStatus(user.id, user.is_active).subscribe({
      next: () => {
        console.log('User status updated successfully');
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        user.is_active = originalStatus; // Revert on error
        alert('Failed to update user status. Please try again.');
      }
    });
  }

  deleteUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      this.apiService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          console.log('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getUserDisplayName(user: User): string {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  }
}