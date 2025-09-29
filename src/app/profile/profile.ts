import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SuccessAnimation } from '../shared/success-animation';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [CommonModule, ReactiveFormsModule, SuccessAnimation]
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  userInfo: any = {};
  message = '';
  isLoading = false;
  showSuccess = false;
  successMessage = '';
  activeTab = 'profile';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      zip_code: ['']
    });

    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password');
    const confirmPassword = form.get('confirm_password');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  loadUserProfile() {
    if (typeof window === 'undefined') return;

    this.userInfo = {
      username: localStorage.getItem('userUsername') || '',
      first_name: localStorage.getItem('userName')?.split(' ')[0] || '',
      last_name: localStorage.getItem('userName')?.split(' ')[1] || '',
      email: localStorage.getItem('userEmail') || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: ''
    };

    this.profileForm.patchValue(this.userInfo);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.message = '';
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.message = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const formData = this.profileForm.value;
        localStorage.setItem('userName', formData.first_name + ' ' + formData.last_name);
        localStorage.setItem('userEmail', formData.email);
      }

      this.isLoading = false;
      this.successMessage = 'Profile updated successfully!';
      this.showSuccess = true;
    }, 1000);
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.message = 'Please fill in all password fields correctly.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Password changed successfully!';
      this.showSuccess = true;
      this.passwordForm.reset();
    }, 1000);
  }

  getUserRole(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole') || 'user';
    }
    return 'user';
  }

  getLastLoginTime(): string {
    if (typeof window !== 'undefined') {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const date = new Date(loginTime);
        return date.toLocaleString();
      }
    }
    return 'Just now';
  }

  onSuccessComplete() {
    this.showSuccess = false;
  }
}