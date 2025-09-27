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
    // Get application data from localStorage or registration service
    this.registrationData = this.registrationService.getData();
    
    // Check if we're in browser environment before accessing localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (!this.registrationData) {
        this.registrationData = {
          applicationId: localStorage.getItem('applicationId'),
          amount: localStorage.getItem('applicationAmount') || '627.30'
        };
      }
    } else {
      // Default data for SSR
      this.registrationData = this.registrationData || {
        applicationId: '1',
        amount: '627.30'
      };
    }
    
    // Only redirect in browser environment
    if (typeof window !== 'undefined' && !this.registrationData?.applicationId && !this.registrationData?.firstName) {
      this.router.navigate(['/membership']);
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
              const amount = this.registrationData.amount || '627.30';
              return actions.order.create({
                purchase_units: [{
                  amount: { value: amount },
                  description: 'Pamoja Kenya Membership Fee'
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
      application: this.registrationData.applicationId,
      payer_name: this.sanitizeInput(`${details.payer?.name?.given_name || ''} ${details.payer?.name?.surname || ''}`),
      payer_email: this.sanitizeInput(details.payer?.email_address || ''),
      paypal_order_id: this.sanitizeInput(details.id || ''),
      amount: details.purchase_units?.[0]?.amount?.value || '0',
      currency: details.purchase_units?.[0]?.amount?.currency_code || 'USD',
      payment_method: 'paypal',
      description: 'Pamoja Kenya Membership Payment'
    };

    this.http.post(`${this.apiUrl}/api/payments/`, payload).subscribe({
      next: (response) => {
        console.log('Payment recorded successfully:', response);
        // Show success message and redirect after delay
        setTimeout(() => {
          this.router.navigate(['/user-dashboard']);
        }, 3000);
      },
      error: (error) => {
        console.error('Payment recording error:', error);
        // Still show success to user, redirect to dashboard
        setTimeout(() => {
          this.router.navigate(['/user-dashboard']);
        }, 3000);
      }
    });
  }

  private sanitizeInput(input: string): string {
    return input.replace(/[\r\n\t]/g, '').trim();
  }
}
