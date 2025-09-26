import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-membership',
  standalone: true,
  templateUrl: './membership.html',
  styleUrl: './membership.css',
  imports: [CommonModule, RouterModule]
})
export class Membership {
  constructor(private router: Router) {}

  onSingleApplication() {
    this.router.navigate(['/single-application']);
  }

  onDoubleApplication() {
    this.router.navigate(['/double-application']);
  }
}
