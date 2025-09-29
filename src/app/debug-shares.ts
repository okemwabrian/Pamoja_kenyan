import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-debug-shares',
  standalone: true,
  template: `
    <div style="padding: 2rem; background: white; margin: 2rem; border-radius: 10px;">
      <h1>🔧 Shares Navigation Debug</h1>
      
      <div style="margin: 2rem 0;">
        <h3>Test Navigation:</h3>
        <button 
          (click)="testPaymentsNavigation()" 
          class="btn btn-primary me-3">
          Test Payments Navigation
        </button>
        
        <button 
          (click)="testHomeNavigation()" 
          class="btn btn-secondary">
          Test Home Navigation
        </button>
      </div>
      
      <div style="margin: 2rem 0;">
        <h3>Direct Links:</h3>
        <a routerLink="/payments" class="btn btn-success me-3">Direct Payments Link</a>
        <a routerLink="/shares" class="btn btn-info">Back to Shares</a>
      </div>
      
      <div style="margin: 2rem 0;">
        <h3>Debug Info:</h3>
        <p><strong>Current URL:</strong> {{ getCurrentUrl() }}</p>
        <p><strong>Router Available:</strong> {{ routerAvailable }}</p>
      </div>
    </div>
  `,
  imports: [CommonModule, RouterModule]
})
export class DebugShares {
  routerAvailable = false;

  constructor(private router: Router) {
    this.routerAvailable = !!this.router;
  }

  getCurrentUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : 'SSR Mode';
  }

  testPaymentsNavigation() {
    console.log('🧪 Testing payments navigation...');
    
    this.router.navigate(['/payments'], {
      queryParams: {
        type: 'shares',
        name: 'Debug User',
        email: 'debug@test.com',
        shares: 3,
        method: 'paypal',
        amount: 300,
        description: 'Debug test purchase'
      }
    }).then(success => {
      console.log('Navigation result:', success);
      if (!success) {
        alert('Navigation failed!');
      }
    }).catch(error => {
      console.error('Navigation error:', error);
      alert('Navigation error: ' + error.message);
    });
  }

  testHomeNavigation() {
    console.log('🧪 Testing home navigation...');
    this.router.navigate(['/']).then(success => {
      console.log('Home navigation result:', success);
    });
  }
}