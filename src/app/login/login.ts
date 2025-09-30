import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SuccessAnimation } from '../shared/success-animation';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, ReactiveFormsModule, SuccessAnimation]
})
export class Login {
  loginForm: FormGroup;
  message: string = '';
  isLoading: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Form submitted!', this.loginForm.value);
    
    if (!this.loginForm.value.username || !this.loginForm.value.password) {
      this.message = 'Please fill in all required fields.';
      return;
    }
    
    // Prevent double submission
    if (this.isLoading) return;

    this.isLoading = true;
    this.message = 'Connecting to server...';

    const credentials = this.loginForm.value;
    console.log('Sending credentials:', credentials);

    this.apiService.login(credentials).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
          
          const fullName = (response.user.first_name + ' ' + response.user.last_name).trim();
          const displayName = fullName || response.user.username;
          
          localStorage.setItem('userName', displayName);
          localStorage.setItem('userRole', response.user.is_staff ? 'admin' : 'user');
          localStorage.setItem('userId', response.user.id);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('userUsername', response.user.username);
          localStorage.setItem('loginTime', new Date().toISOString());
        }

        this.isLoading = false;
        const fullName = (response.user?.first_name || '') + ' ' + (response.user?.last_name || '');
        const displayName = fullName.trim() || response.user?.username || 'User';
        this.successMessage = `Welcome back, ${displayName}! Redirecting...`;
        this.showSuccess = true;
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        
        if (error.status === 0) {
          this.message = 'Cannot connect to server. Please check if backend is running.';
        } else if (error.status === 401) {
          this.message = 'Invalid username or password. Please check your credentials.';
        } else if (error.status === 405) {
          this.message = 'Login endpoint not configured properly on backend.';
        } else {
          this.message = `Login failed (${error.status}). Please try again.`;
        }
      }
    });
  }

  onSuccessComplete() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }

  fillCredentials(username: string, password: string) {
    this.message = '';
    this.loginForm.patchValue({
      username: username,
      password: password
    });
    
    // Show feedback that credentials were filled
    this.message = `Credentials filled for ${username === 'admin' ? 'Admin' : 'Test User'}. Click Sign In to continue.`;
    setTimeout(() => {
      if (this.message.includes('Credentials filled')) {
        this.message = '';
      }
    }, 3000);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Temporary test login to bypass backend issues
  testLogin() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', 'test-token-123');
      localStorage.setItem('refreshToken', 'test-refresh-123');
      localStorage.setItem('userName', 'Test User');
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userId', '1');
      localStorage.setItem('userEmail', 'test@test.com');
    }
    
    this.successMessage = 'Test login successful! Redirecting...';
    this.showSuccess = true;
  }
}