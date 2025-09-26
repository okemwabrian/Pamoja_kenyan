import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('fadeInStagger', [
      transition(':enter', [
        query('.card, .why-choose-us, .upgrade-info, .testimonial', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(200, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('bannerAppear', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class Home {
  constructor(private router: Router) {}

  onSignup() {
    this.router.navigate(['/single-application']);
  }

  onBuyShares() {
    this.router.navigate(['/shares']);
  }

  onUpgrade() {
    this.router.navigate(['/upgrade']);
  }

  onReadMore() {
    alert('More info will be available soon.');
  }

  // ✅ Added: formData object for [(ngModel)]
  formData = {
    fullName: '',
    email: '',
    shares: 1,
    paymentMethod: '',
    comments: ''
  };

  // ✅ Added: onSubmit() method for (ngSubmit)
  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Add your backend call or form processing logic here
  }
}
