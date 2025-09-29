import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Form submitted!', this.loginForm.value);
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.message = 'Please fill in all required fields.';
      console.log('Form is invalid:', this.loginForm.errors);
      return;
    }

    this.isLoading = true;
    this.message = 'Connecting to server...';

    const credentials = this.loginForm.value;
    console.log('Sending credentials:', credentials);

    this.http.post('http://localhost:8000/api/auth/login/', credentials).subscribe({
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
        const fullName = response.user.first_name + ' ' + response.user.last_name;
        this.successMessage = `Welcome back, ${fullName}! Redirecting to your dashboard...`;
        this.showSuccess = true;
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        
        if (error.status === 0) {
          this.message = 'Unable to connect to server. Is the backend running on http://localhost:8000?';
        } else {
          this.message = error.error?.error || `Login failed: ${error.status} ${error.statusText}`;
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
}