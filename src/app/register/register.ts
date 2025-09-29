import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
})
export class Register {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService
  ) {}

  register() {
    console.log('Register method called');
    this.errorMessage = '';
    this.successMessage = '';

    // Frontend validations
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
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
    this.http.post('http://localhost:8000/api/auth/register/', payload).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
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
        
        if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
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
