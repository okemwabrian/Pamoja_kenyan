import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [CommonModule, RouterModule, FormsModule],

})
export class Home implements OnInit {
  latestAnnouncements: any[] = [];
  latestEvents: any[] = [];
  isLoading = true;

  constructor(private router: Router, private http: HttpClient) {}

  onSignup() {
    this.router.navigate(['/single-application']);
  }

  onBuyShares() {
    this.router.navigate(['/shares']);
  }

  onUpgrade() {
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      this.router.navigate(['/upgrade']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onMakeClaims() {
    // Check if user is logged in
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      this.router.navigate(['/claims']);
    } else {
      this.router.navigate(['/login']);
    }
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

  ngOnInit() {
    this.loadLatestContent();
  }

  loadLatestContent() {
    if (typeof window === 'undefined') {
      this.isLoading = false;
      return;
    }

    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // Load latest 2 announcements
    this.http.get('http://localhost:8000/api/notifications/announcements/?limit=2', options).subscribe({
      next: (data: any) => {
        this.latestAnnouncements = data.slice(0, 2);
      },
      error: () => {
        this.latestAnnouncements = [];
      }
    });

    // Load latest 2 events
    this.http.get('http://localhost:8000/api/notifications/events/?limit=2', options).subscribe({
      next: (data: any) => {
        this.latestEvents = data.slice(0, 2);
        this.isLoading = false;
      },
      error: () => {
        this.latestEvents = [];
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
