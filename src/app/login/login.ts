import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
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
    this.errorMessage = '';

    if (this.identifier && this.password) {
      if (this.password.length < 4) {
        this.snackBar.open('Password must be at least 4 characters.', 'Close', { duration: 3000 });
        return;
      }

      // Simulated login success
      const dummyToken = 'sample-jwt-token';
      this.authService.login(dummyToken);
      this.snackBar.open('Login successful!', 'Close', { duration: 2500 });

      this.router.navigate(['/']);
    } else {
      this.snackBar.open('Please enter your username/email and password.', 'Close', { duration: 3000 });
    }
  }
}
