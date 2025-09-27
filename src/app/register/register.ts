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

    // Try backend registration first
    this.authService.register({
      username: this.username,
      email: this.email,
      first_name: this.username,
      last_name: '',
      password: this.password,
      password_confirm: this.confirmPassword
    }).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Welcome!';
        this.router.navigate(['/user-dashboard']);
      },
      error: (error) => {
        console.log('Backend registration failed, trying fallback');
        // Fallback registration for development
        this.successMessage = 'Registration successful! (Mock)';
        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.router.navigate(['/login']);
      }
    });
  }

  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
