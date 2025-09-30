import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class PaymentHistoryComponent implements OnInit {
  payments: any[] = [];

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.apiService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: () => {
        this.payments = [];
      }
    });
  }
}