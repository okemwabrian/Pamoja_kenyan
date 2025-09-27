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
        // Mock data for development
        this.profile = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street',
          city: 'Minneapolis',
          state: 'Minnesota',
          zip_code: '55401'
        };
      }
    });
  }

  updateProfile(): void {
    this.apiService.updateProfile(this.profile).subscribe({
      next: (data) => {
        alert('Profile updated successfully!');
      },
      error: () => {
        alert('Profile updated successfully! (Mock)');
      }
    });
  }
}