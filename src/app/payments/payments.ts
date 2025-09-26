import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payments',
  standalone: true,
  templateUrl: './payments.html',
  styleUrls: ['./payments.css'],
  imports: [CommonModule, RouterModule]
})
export class Payments implements OnInit, AfterViewInit {
  registrationData: any = null;
  paymentCompleted: boolean = false;
  paypalLoaded: boolean = false;
  paypalLoadError: boolean = false;
  private readonly apiUrl = environment.production ? 'https://api.pamojakenyamn.com' : 'http://localhost:8000';
  private readonly paypalClientId = environment.production ? 'PROD_CLIENT_ID' : 'AcKeWOPTHodpfp9ana6qegVblvkw5AlwDZb-iTlvzTQHPADeoNjkV9w8ChY2khzu59kuHaBlshC33yMg';

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.registrationData = this.registrationService.getData();
    if (!this.registrationData) {
      this.router.navigate(['/single-application']);
    }
  }

  ngAfterViewInit(): void {
    if (!this.registrationData) return;
    
    this.loadPayPalScript()
      .then(() => {
        this.paypalLoaded = true;
        setTimeout(() => {
          const container = document.getElementById('paypal-button-container');
          if (!container) {
            this.paypalLoadError = true;
            return;
          }

          const paypal = (window as any).paypal;
          if (!paypal?.Buttons) {
            this.paypalLoadError = true;
            return;
          }

          paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            },
            createOrder: (_data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: { value: '627.30' }
                }]
              });
            },
            onApprove: (_data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                this.onPaymentSuccess(details);
              });
            },
            onError: () => {
              this.paypalLoadError = true;
            }
          }).render('#paypal-button-container');
        }, 0);
      })
      .catch(() => {
        this.paypalLoadError = true;
      });
  }

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&currency=USD&components=buttons,funding-eligibility`;
      script.integrity = 'sha384-...';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('PayPal script failed to load'));
      document.body.appendChild(script);
    });
  }

  onPaymentSuccess(details: any): void {
    this.paymentCompleted = true;

    const payload = {
      payer_name: this.sanitizeInput(`${details.payer?.name?.given_name || ''} ${details.payer?.name?.surname || ''}`),
      payer_email: this.sanitizeInput(details.payer?.email_address || ''),
      paypal_order_id: this.sanitizeInput(details.id || ''),
      amount: details.purchase_units?.[0]?.amount?.value || '0',
      currency: details.purchase_units?.[0]?.amount?.currency_code || 'USD',
      registration_data: this.registrationData
    };

    this.http.post(`${this.apiUrl}/api/payments/`, payload).subscribe({
      next: () => {
        // Payment recorded successfully
      },
      error: () => {
        // Handle payment recording error
      }
    });
  }

  private sanitizeInput(input: string): string {
    return input.replace(/[\r\n\t]/g, '').trim();
  }
}
