import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule]
})
export class ProfileComponent implements OnInit {
  profile = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  };

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.apiService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: () => {
        console.error('Failed to load profile from backend');
      }
    });
  }

  isUpdating = false;
  message = '';

  updateProfile(): void {
    this.isUpdating = true;
    this.message = '';
    
    this.apiService.updateProfile(this.profile).subscribe({
      next: (data) => {
        this.message = 'Profile updated successfully!';
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Profile update error:', error);
        this.message = 'Failed to update profile. Please try again.';
        this.isUpdating = false;
      }
    });
  }
}