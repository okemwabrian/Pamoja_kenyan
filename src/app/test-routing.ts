import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-routing',
  standalone: true,
  template: `
    <div style="padding: 2rem; background: white; margin: 2rem; border-radius: 10px;">
      <h1>🔧 Routing Test Page</h1>
      <p>If you can see this, routing is working!</p>
      
      <div style="margin: 2rem 0;">
        <h3>Navigation Test:</h3>
        <a routerLink="/" style="margin-right: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Home</a>
        <a routerLink="/login" style="margin-right: 1rem; padding: 0.5rem 1rem; background: #27ae60; color: white; text-decoration: none; border-radius: 5px;">Login</a>
        <a routerLink="/about" style="margin-right: 1rem; padding: 0.5rem 1rem; background: #e74c3c; color: white; text-decoration: none; border-radius: 5px;">About</a>
      </div>
      
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
        <h4>Current URL:</h4>
        <code>{{ getCurrentUrl() }}</code>
      </div>
    </div>
  `,
  imports: [CommonModule, RouterModule]
})
export class TestRouting {
  getCurrentUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : 'SSR Mode';
  }
}