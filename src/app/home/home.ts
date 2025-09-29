import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [CommonModule, RouterModule, FormsModule],

})
export class Home {
  constructor(private router: Router) {}

  onSignup() {
    this.router.navigate(['/single-application']);
  }

  onBuyShares() {
    this.router.navigate(['/shares']);
  }

  onUpgrade() {
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      this.router.navigate(['/upgrade']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onMakeClaims() {
    // Check if user is logged in
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      this.router.navigate(['/claims']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // ✅ Added: formData object for [(ngModel)]
  formData = {
    fullName: '',
    email: '',
    shares: 1,
    paymentMethod: '',
    comments: ''
  };

  // ✅ Added: onSubmit() method for (ngSubmit)
  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Add your backend call or form processing logic here
  }
}
