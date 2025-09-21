import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // fixed typo here
})
export class Login {
  identifier: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';

    if (this.identifier && this.password) {
      if (this.password.length < 4) {
        this.errorMessage = 'Password must be at least 4 characters';
        return;
      }

      // Simulated login success
      const dummyToken = 'sample-jwt-token';
      this.authService.login(dummyToken);
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Please enter your username/email and password.';
    }
  }
}
