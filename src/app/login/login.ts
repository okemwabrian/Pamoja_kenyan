import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule]
})
export class Login {
  identifier: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login() {
    console.log('Login method called');
    this.errorMessage = '';

    if (this.identifier && this.password) {
      if (this.password.length < 4) {
        this.snackBar.open('Password must be at least 4 characters.', 'Close', { duration: 3000 });
        return;
      }

      // Try backend login first
      this.authService.loginWithBackend({
        identifier: this.identifier,
        password: this.password
      }).subscribe({
        next: (response) => {
          this.snackBar.open('Login successful!', 'Close', { duration: 2500 });
          this.router.navigate(['/user-dashboard']);
        },
        error: (error) => {
          console.log('Backend login failed, using mock login');
          // Fallback to mock login for development
          const dummyToken = 'sample-jwt-token';
          this.authService.login(dummyToken);
          
          // Set admin role for testing
          if (this.identifier === 'admin' || this.identifier === 'admin@pamojakenyamn.com') {
            localStorage.setItem('userRole', 'admin');
          } else {
            localStorage.setItem('userRole', 'user');
          }
          
          this.snackBar.open('Login successful! (Mock)', 'Close', { duration: 2500 });
          this.router.navigate(['/user-dashboard']);
        }
      });
    } else {
      this.snackBar.open('Please enter your username/email and password.', 'Close', { duration: 3000 });
    }
  }
}
