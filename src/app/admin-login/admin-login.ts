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
      username: ['admin', Validators.required],
      password: ['admin123', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
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
        this.successMessage = 'Admin login successful!';
        this.showSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.message = error.error?.error || 'Login failed. Please try again.';
      }
    });
  }

  onSuccessComplete() {
    this.router.navigate(['/admin-dashboard']);
  }
}