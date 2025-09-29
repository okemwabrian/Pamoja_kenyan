import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-shares',
  standalone: true,
  template: `
    <div style="padding: 2rem; background: white; margin: 2rem; border-radius: 10px;">
      <h1>🧮 Shares Calculator Test</h1>
      
      <div style="margin: 2rem 0;">
        <h3>Quick Calculation Test:</h3>
        <div style="display: flex; gap: 1rem; align-items: center; margin: 1rem 0;">
          <label>Shares:</label>
          <input 
            type="number" 
            [(ngModel)]="shares" 
            min="1" 
            style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; width: 100px;">
          <span style="font-weight: bold; color: #007A3D;">
            Total: {{ shares && shares > 0 ? ('$' + (shares * 100).toFixed(2)) : '$0.00' }}
          </span>
        </div>
      </div>
      
      <div style="margin: 2rem 0;">
        <h3>Direct Payment Links:</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a 
            routerLink="/payments" 
            [queryParams]="{
              type: 'shares',
              name: 'Test User',
              email: 'test@example.com',
              shares: 1,
              method: 'paypal',
              amount: 100,
              description: '1 share purchase'
            }"
            class="test-btn">
            1 Share ($100)
          </a>
          
          <a 
            routerLink="/payments" 
            [queryParams]="{
              type: 'shares',
              name: 'Test User',
              email: 'test@example.com',
              shares: 5,
              method: 'paypal',
              amount: 500,
              description: '5 shares purchase'
            }"
            class="test-btn">
            5 Shares ($500)
          </a>
          
          <a 
            routerLink="/payments" 
            [queryParams]="{
              type: 'shares',
              name: 'Test User',
              email: 'test@example.com',
              shares: 10,
              method: 'paypal',
              amount: 1000,
              description: '10 shares purchase'
            }"
            class="test-btn">
            10 Shares ($1000)
          </a>
        </div>
      </div>
      
      <div style="margin: 2rem 0;">
        <h3>Navigation Test:</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a routerLink="/shares" class="test-btn">Back to Shares</a>
          <a routerLink="/payments" class="test-btn">Payments Page</a>
          <a routerLink="/" class="test-btn">Home</a>
        </div>
      </div>
    </div>
    
    <style>
      .test-btn {
        padding: 0.75rem 1.5rem;
        background: #667eea;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        display: inline-block;
        transition: background 0.3s ease;
      }
      .test-btn:hover {
        background: #5a6fd8;
        color: white;
      }
    </style>
  `,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class TestShares {
  shares: number = 1;
}