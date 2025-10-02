import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class Register {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  register() {
    console.log('Register method called');
    console.log('Form values:', { username: this.username, email: this.email, password: this.password, confirmPassword: this.confirmPassword });
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Frontend validations
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      this.isLoading = false;
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.isLoading = false;
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      this.isLoading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.isLoading = false;
      return;
    }

    // ✅ Send payload matching backend expectations
    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      confirm_password: this.confirmPassword, // Needed for Django serializer
    };

    console.log('Sending registration request:', payload);
    
    // Send registration request to backend
    this.apiService.register(payload).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.successMessage = 'Registration successful! Please login with your credentials.';
        
        // Clear form
        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        console.error('Error details:', error.error);
        this.isLoading = false;
        
        if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error.status === 400) {
          this.errorMessage = 'Registration data invalid: ' + JSON.stringify(error.error);
        } else if (error.error?.username) {
          this.errorMessage = 'Username already exists. Please choose a different username.';
        } else if (error.error?.email) {
          this.errorMessage = 'Email already registered. Please use a different email.';
        } else {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      }
    });
  }

  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
