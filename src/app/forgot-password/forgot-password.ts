import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ForgotPassword {
  forgotPasswordForm: FormGroup;
  message: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.forgotPasswordForm.get('email')?.value;

    this.http.post('http://localhost:8000/api/auth/password-reset/', { email }).subscribe({
      next: (response: any) => {
        this.message = 'Password reset email sent! Please check your inbox.';
        this.isLoading = false;
      },
      error: (error) => {
        this.message = 'Password reset email sent! Please check your inbox.';
        this.isLoading = false;
      }
    });
  }
}