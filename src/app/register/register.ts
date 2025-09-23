import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class Register {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  register() {
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

    this.http.post<any>('http://localhost:8000/api/register/', payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Registered successfully!';
        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        
        // this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.error && typeof error.error === 'object') {
          // Collect and display multiple errors from Django if needed
          const errors = Object.values(error.error)
            .flat()
            .join(' ');
          this.errorMessage = errors || 'Something went wrong. Please try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      },
    });
  }

  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
