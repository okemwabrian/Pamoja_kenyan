import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SuccessAnimation } from '../shared/success-animation';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
  imports: [CommonModule, ReactiveFormsModule, SuccessAnimation]
})
export class AdminLogin {
  loginForm: FormGroup;
  message: string = '';
  isLoading: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.loginForm.value.username || !this.loginForm.value.password) {
      this.message = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    const credentials = this.loginForm.value;

    this.http.post('http://localhost:8000/api/auth/login/', credentials).subscribe({
      next: (response: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
          localStorage.setItem('userName', response.user.first_name + ' ' + response.user.last_name);
          localStorage.setItem('userRole', response.user.is_staff ? 'admin' : 'user');
          localStorage.setItem('userId', response.user.id);
        }

        this.isLoading = false;
        // Check if user is actually admin
        if (!response.user.is_staff) {
          this.message = 'Access denied. Admin privileges required.';
          this.isLoading = false;
          return;
        }
        
        this.successMessage = 'Admin login successful!';
        this.showSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.message = 'Cannot connect to server. Please check if backend is running.';
        } else {
          this.message = error.error?.error || 'Invalid credentials or not an admin user.';
        }
      }
    });
  }

  onSuccessComplete() {
    this.router.navigate(['/admin-dashboard']);
  }
}