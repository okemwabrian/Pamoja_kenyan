import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Payment {
  id: number;
  payer_name: string;
  payer_email: string;
  paypal_order_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  imports: [CommonModule, RouterModule]
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  loading = false;
  totalAmount = 0;
  private apiUrl = environment.production ? 'https://api.pamojakenyamn.com' : 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.http.get<Payment[]>(`${this.apiUrl}/api/admin/payments/`).subscribe({
      next: (data) => {
        this.payments = data;
        this.calculateTotal();
        this.loading = false;
      },
      error: () => {
        // Mock data for development
        this.payments = [
          { id: 1, payer_name: 'John Doe', payer_email: 'john@example.com', paypal_order_id: 'PAY123456', amount: 627.30, currency: 'USD', status: 'completed', created_at: '2024-01-15' },
          { id: 2, payer_name: 'Jane Smith', payer_email: 'jane@example.com', paypal_order_id: 'PAY789012', amount: 1254.60, currency: 'USD', status: 'completed', created_at: '2024-01-20' },
          { id: 3, payer_name: 'Bob Johnson', payer_email: 'bob@example.com', paypal_order_id: 'PAY345678', amount: 627.30, currency: 'USD', status: 'pending', created_at: '2024-01-25' }
        ];
        this.calculateTotal();
        this.loading = false;
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
  }

  getCompletedPaymentsCount(): number {
    return this.payments.filter(p => p.status === 'completed').length;
  }

  exportPayments(): void {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = ['ID', 'Payer Name', 'Email', 'PayPal Order ID', 'Amount', 'Currency', 'Status', 'Date'];
    const rows = this.payments.map(p => [
      p.id,
      p.payer_name,
      p.payer_email,
      p.paypal_order_id,
      p.amount,
      p.currency,
      p.status,
      p.created_at
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}