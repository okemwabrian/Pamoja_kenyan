import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
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
  private apiUrl = environment.production ? 'https://api.pamojakenyamn.com' : 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.http.get<User[]>(`${this.apiUrl}/api/admin/users/`).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        // Mock data for development
        this.users = [
          { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user', created_at: '2024-01-15', is_active: true },
          { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user', created_at: '2024-01-20', is_active: true },
          { id: 3, username: 'admin_user', email: 'admin@pamojakenyamn.com', role: 'admin', created_at: '2024-01-01', is_active: true }
        ];
        this.loading = false;
      }
    });
  }

  toggleUserStatus(user: User): void {
    user.is_active = !user.is_active;
    this.http.patch(`${this.apiUrl}/api/admin/users/${user.id}/`, { is_active: user.is_active }).subscribe({
      next: () => {
        console.log('User status updated');
      },
      error: () => {
        user.is_active = !user.is_active; // Revert on error
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/api/admin/users/${userId}/`).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
        },
        error: () => {
          alert('Error deleting user');
        }
      });
    }
  }
}