import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SharePurchase {
  fullName: string;
  email: string;
  shares: number | null;
  paymentMethod: 'paypal' | 'bank' | 'card' | '';
  comments?: string;
}

@Component({
  selector: 'app-shares',
  standalone: true,
  templateUrl: './shares.html',
  styleUrls: ['./shares.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class Shares {
  formData: SharePurchase = {
    fullName: '',
    email: '',
    shares: null,
    paymentMethod: '',
    comments: ''
  };

  constructor(private router: Router, private http: HttpClient) { }

  onSubmit() {
    // Validate required fields
    if (!this.formData.fullName?.trim()) {
      alert('Please enter your full name');
      return;
    }
    
    if (!this.formData.email?.trim()) {
      alert('Please enter your email');
      return;
    }
    
    if (!this.formData.shares || this.formData.shares < 1) {
      alert('Please enter a valid number of shares (minimum 1)');
      return;
    }
    
    if (!this.formData.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const totalAmount = this.formData.shares * 100;

    // Navigate to payments page
    this.router.navigate(['/payments'], {
      queryParams: {
        type: 'shares',
        name: this.formData.fullName,
        email: this.formData.email,
        shares: this.formData.shares,
        method: this.formData.paymentMethod,
        amount: totalAmount,
        description: `Purchase of ${this.formData.shares} shares at $100 each`
      }
    });
  }
}
