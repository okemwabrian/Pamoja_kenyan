import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-success-animation',
  standalone: true,
  template: `
    <div *ngIf="show" class="success-overlay">
      <div class="success-circle">
        <div class="checkmark">
          <div class="checkmark-stem"></div>
          <div class="checkmark-kick"></div>
        </div>
      </div>
      <p class="success-message">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./success-animation.css'],
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('checkmark', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('400ms 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class SuccessAnimation implements OnChanges {
  @Input() show: boolean = false;
  @Input() message: string = 'Success!';
  @Output() complete = new EventEmitter<void>();

  ngOnChanges() {
    if (this.show) {
      setTimeout(() => {
        this.show = false;
        this.complete.emit();
      }, 2500);
    }
  }
}