import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
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
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
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
        
        // Use AuthService to set authentication data
        this.authService.setAuthData(response);

        this.isLoading = false;
        const fullName = (response.user?.first_name || '') + ' ' + (response.user?.last_name || '');
        const displayName = fullName.trim() || response.user?.username || 'User';
        
        if (response.user.is_admin || response.user.is_staff || response.user.is_superuser) {
          this.successMessage = `Welcome back, Admin ${displayName}! Redirecting to dashboard...`;
        } else {
          this.successMessage = `Welcome back, ${displayName}! Redirecting...`;
        }
        this.showSuccess = true;
      },
      error: (error) => {
        console.error('Login failed:', error);
        console.error('Error details:', error.error);
        this.isLoading = false;
        
        if (error.status === 0) {
          this.message = 'Cannot connect to server. Please check if backend is running.';
        } else if (error.status === 400) {
          this.message = 'Login data invalid: ' + JSON.stringify(error.error);
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
    const userData = this.authService.getUserData();
    if (userData && (userData.isStaff || userData.isSuperuser || userData.role === 'admin')) {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/home']);
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

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  // Temporary test login to bypass backend issues
  // testLogin() {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('authToken', 'test-token-123');
  //     localStorage.setItem('refreshToken', 'test-refresh-123');
  //     localStorage.setItem('userName', 'Test User');
  //     localStorage.setItem('userRole', 'user');
  //     localStorage.setItem('userId', '1');
  //     localStorage.setItem('userEmail', 'test@test.com');
  //   }
    
  //   this.successMessage = 'Test login successful! Redirecting...';
  //   this.showSuccess = true;
  // }
}