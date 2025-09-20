import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SharePurchase {
  fullName: string;
  email: string;
  shares: number | null;
  paymentMethod: 'paypal' | 'bank' | 'card' | '';
  comments?: string;
}

@Component({
  selector: 'app-shares',
  standalone: false,
  templateUrl: './shares.html',
  styleUrls: ['./shares.css']
})
export class Shares {
  formData: SharePurchase = {
    fullName: '',
    email: '',
    shares: null,
    paymentMethod: '',
    comments: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    // Validate required fields
    if (
      !this.formData.fullName ||
      !this.formData.email ||
      !this.formData.shares ||
      this.formData.shares < 1 ||
      !this.formData.paymentMethod
    ) {
      alert('Please fill out all required fields correctly.');
      return;
    }

    const totalAmount = this.formData.shares * 10; // Assuming $10per share

    // Navigate to the payment page with query parameters
    this.router.navigate(['/payments'], {
      queryParams: {
        name: this.formData.fullName,
        email: this.formData.email,
        shares: this.formData.shares,
        method: this.formData.paymentMethod,
        amount: totalAmount
      }
    });

    console.log('✅ Form submitted:', this.formData);
  }
}
