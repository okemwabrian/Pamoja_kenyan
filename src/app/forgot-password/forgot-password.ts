import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

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
    if (!this.forgotPasswordForm.value.email) {
      this.message = 'Please enter your email address.';
      return;
    }
    
    if (this.isLoading) return;

    this.isLoading = true;
    const email = this.forgotPasswordForm.get('email')?.value;

    this.http.post(`${environment.apiUrl}/auth/password-reset/`, { email }).subscribe({
      next: (response: any) => {
        this.message = 'If this email exists in our system, you will receive password reset instructions.';
        this.isLoading = false;
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        this.message = 'If this email exists in our system, you will receive password reset instructions.';
        this.isLoading = false;
        this.forgotPasswordForm.reset();
      }
    });
  }
}