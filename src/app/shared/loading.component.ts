import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading-container" *ngIf="show">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #86B0BD;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(226, 161, 111, 0.3);
      border-top: 4px solid #E2A16F;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
  imports: [CommonModule]
})
export class LoadingComponent {
  @Input() show = false;
  @Input() message = 'Loading...';
}