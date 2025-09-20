import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments',
  standalone: true,
  templateUrl: './payments.html',
  styleUrls: ['./payments.css'],
  imports: [CommonModule]
})
export class Payments implements OnInit, AfterViewInit {
  registrationData: any = null;
  paymentCompleted: boolean = false;
  paypalLoaded: boolean = false;
  paypalLoadError: boolean = false;

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    console.log('Payments component loaded');
    this.registrationData = this.registrationService.getData();

    if (!this.registrationData) {
      console.warn('No registration data found. Redirecting...');
      this.router.navigate(['/single-application']);
    }
  }

  ngAfterViewInit(): void {
    if (!this.registrationData) return;

    console.log('AfterViewInit: loading PayPal script...');
    this.loadPayPalScript()
      .then(() => {
        console.log('✅ PayPal SDK script loaded');
        this.paypalLoaded = true;

        // Delay rendering to allow *ngIf to render container
        setTimeout(() => {
          const container = document.getElementById('paypal-button-container');
          console.log('paypal-button-container element:', container);

          if (!container) {
            console.error('❌ Error: paypal-button-container not found in DOM');
            this.paypalLoadError = true;
            return;
          }

          const paypal = (window as any).paypal;
          if (!paypal || !paypal.Buttons) {
            console.error('❌ window.paypal.Buttons is undefined');
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
            fundingSource: undefined, // allows all eligible funding sources
            createOrder: (_data: any, actions: any) => {
              console.log('✅ createOrder called');
              return actions.order.create({
                purchase_units: [{
                  amount: { value: '627.30' }
                }]
              });
            },
            onApprove: (_data: any, actions: any) => {
              console.log('✅ onApprove called');
              return actions.order.capture().then((details: any) => {
                this.onPaymentSuccess(details);
              });
            },
            onError: (err: any) => {
              console.error('❌ PayPal Buttons error:', err);
              this.paypalLoadError = true;
            }
          }).render('#paypal-button-container');
        }, 0); // Ensures DOM update after *ngIf
      })
      .catch(err => {
        this.paypalLoadError = true;
        console.error('❌ Failed to load PayPal SDK script', err);
      });
  }

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        console.log('ℹ️ PayPal already available');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AcKeWOPTHodpfp9ana6qegVblvkw5AlwDZb-iTlvzTQHPADeoNjkV9w8ChY2khzu59kuHaBlshC33yMg&currency=USD&components=buttons,funding-eligibility';
      script.onload = () => {
        console.log('✅ PayPal script onload');
        resolve();
      };
      script.onerror = (err) => {
        console.error('❌ Error loading PayPal script', err);
        reject(err);
      };
      document.body.appendChild(script);
    });
  }

  onPaymentSuccess(details: any): void {
    console.log('✅ Payment successful!', details);
    this.paymentCompleted = true;

    // Optionally send registrationData + payment details to backend
  }
}
