import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private router: Router, private http: HttpClient) { }

  onSubmit() {
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

    const payload = {
      full_name: this.formData.fullName,
      email: this.formData.email,
      shares: this.formData.shares,
      payment_method: this.formData.paymentMethod,
      comments: this.formData.comments,
    };

    this.http.post<any>('http://localhost:8000/api/shares/purchase/', payload)
      .subscribe({
        next: (res) => {
          alert(res.message || 'Shares purchased successfully!');
          this.router.navigate(['/payments'], {
            queryParams: {
              name: this.formData.fullName,
              email: this.formData.email,
              shares: this.formData.shares,
              method: this.formData.paymentMethod,
              amount: (this.formData.shares ?? 0) * 10 // $10 per share assumed
            }
          });

        },
        error: (err) => {
          alert('Error: ' + (err.error?.message || 'Could not process purchase.'));
        }
      });
  }
}
