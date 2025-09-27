import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class PaymentHistoryComponent implements OnInit {
  payments: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    // Mock data - replace with real API call
    this.payments = [
      {
        id: 1,
        amount: 627.30,
        payment_method: 'paypal',
        status: 'completed',
        transaction_id: 'PAY123456789',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        amount: 1254.60,
        payment_method: 'stripe',
        status: 'pending',
        transaction_id: 'STR987654321',
        created_at: '2024-01-20T14:30:00Z'
      }
    ];
  }
}