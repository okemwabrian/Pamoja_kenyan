import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
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
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Admin login attempt:', this.loginForm.value);
    
    if (!this.loginForm.value.username || !this.loginForm.value.password) {
      this.message = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;
    this.message = 'Connecting to server...';

    const credentials = this.loginForm.value;

    console.log('Sending credentials to backend:', credentials);
    this.apiService.login(credentials).subscribe({
      next: (response: any) => {
        // Use AuthService to set authentication data
        this.authService.setAuthData(response);

        this.isLoading = false;
        console.log('Login response:', response);
        console.log('User object:', response.user);
        console.log('is_staff:', response.user?.is_staff);
        console.log('is_superuser:', response.user?.is_superuser);
        
        // Check if user is actually admin
        if (!response.user || (!response.user.is_staff && !response.user.is_superuser)) {
          this.message = `Access denied. Admin privileges required. User: ${response.user?.username}, is_staff: ${response.user?.is_staff}, is_superuser: ${response.user?.is_superuser}`;
          // Clear any stored data if not admin
          this.authService.clearAuthState();
          return;
        }
        
        this.successMessage = 'Admin login successful!';
        this.showSuccess = true;
      },
      error: (error) => {
        console.error('Login error details:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response body:', error.error);
        
        this.isLoading = false;
        if (error.status === 0) {
          this.message = 'Cannot connect to server. Please check if backend is running.';
        } else if (error.status === 400) {
          // Try to get specific error message for 400 errors
          let errorMsg = 'Bad request - invalid credentials or user data';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (error.error.detail) {
              errorMsg = error.error.detail;
            } else if (error.error.message) {
              errorMsg = error.error.message;
            } else if (error.error.non_field_errors) {
              errorMsg = error.error.non_field_errors[0] || errorMsg;
            }
          }
          this.message = errorMsg;
        } else {
          this.message = error.error?.error || error.error?.detail || 'Invalid credentials or not an admin user.';
        }
      }
    });
  }

  onSuccessComplete() {
    this.router.navigate(['/admin-dashboard']);
  }
}