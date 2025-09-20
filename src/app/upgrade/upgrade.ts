import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-upgrade',
  standalone: false,
  templateUrl: './upgrade.html',
  styleUrl: './upgrade.css',
  animations: [
    trigger('formAppear', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.97) translateZ(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1) translateZ(0)' }))
      ])
    ])
  ]
})
export class Upgrade implements OnInit {
  registrationForm!: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private router: Router) {}


  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      // Personal Info
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],

      // Address
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      zip: ['', Validators.required],

      // Contact
      phoneMain: ['', Validators.required],
      phoneOptional: [''],
      minnesotaId: [null, Validators.required],  // Handled via file input

      // Spouse / Authorized Rep
      spouse: [''],
      spousePhone: [''],
      authorizedRep: [''],
      authorizedRepPhone: [''],

      // Declaration + Membership
      declarationAccepted: [false, Validators.requiredTrue],
      existingMemberId: ['', Validators.required]
    }, {
      validators: [this.emailMatchValidator]
    });
  }

  // ✅ Email match validator
  emailMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  // ✅ Handle file input separately
  get minnesotaIdControl(): AbstractControl | null {
    return this.registrationForm.get('minnesotaId');
  }

  // ✅ File input change handler (optional if using ngModel or reactive approach)
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.registrationForm.patchValue({ minnesotaId: file });
      this.minnesotaIdControl?.markAsDirty();
    }
  }

  onSubmit(): void {
  if (this.registrationForm.invalid) {
    this.message = 'Please fix errors before submitting.';
    this.registrationForm.markAllAsTouched();
    this.scrollToFirstError();
    return;
  }

  const formData = new FormData();
  const values = this.registrationForm.value;

  // Append each control to FormData
  for (const key in values) {
    if (key === 'minnesotaId') {
      const file = values[key];
      if (file instanceof File) {
        formData.append('minnesotaId', file);
      }
    } else {
      formData.append(key, values[key]);
    }
  }

  // Optional: Save formData to a service if needed

  // Navigate to payment page with query parameters
  this.router.navigate(['/payments'], {
    queryParams: {
      upgradeType: 'double-family',
      amount: 500
    }
  });

  // Optionally reset form or show a message
  // this.registrationForm.reset();
}

  // Optional: scroll to first error field for better UX
  private scrollToFirstError(): void {
    const firstInvalidControl: HTMLElement | null = document.querySelector(
      '.ng-invalid[formControlName]'
    );
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidControl.focus();
    }
  }
}
