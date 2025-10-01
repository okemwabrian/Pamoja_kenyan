import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upgrade',
  standalone: true,
  templateUrl: './upgrade.html',
  styleUrls: ['./upgrade.css'],
  animations: [
    trigger('formAppear', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.97) translateZ(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1) translateZ(0)' }))
      ])
    ])
  ],
  imports: [
    CommonModule,         // ✅ Needed for *ngIf, *ngFor, etc.
    ReactiveFormsModule,  // ✅ Needed for formGroup, formControlName
    RouterModule          // ✅ Needed for routerLink (if used)
  ]
})
export class Upgrade implements OnInit {
  registrationForm!: FormGroup;
  message: string = '';
  backendErrors: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
  first_name: ['', Validators.required],
  middle_name: [''],
  last_name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  confirm_email: ['', [Validators.required, Validators.email]],
  address1: ['', Validators.required],
  address2: [''],
  city: ['', Validators.required],
  state_province: ['', Validators.required],
  zip_code: ['', Validators.required],
  phone_main: ['', Validators.required],
  phone_optional: [''],
  minnesota_id: [null, Validators.required],  // File input
  spouse: [''],
  spouse_phone: [''],
  authorized_rep: [''],
  authorized_rep_phone: [''],
  existing_member_id: ['', Validators.required],
  declaration_accepted: [false, Validators.requiredTrue]
}, { validators: this.emailMatchValidator });

  }

  emailMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirm_email')?.value;

    return email === confirmEmail ? null : { emailMismatch: true };
  }

  get minnesotaIdControl(): AbstractControl | null {
    return this.registrationForm.get('minnesotaId');
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.registrationForm.patchValue({ minnesotaId: file });
      this.minnesotaIdControl?.markAsDirty();
    }
  }

  onSubmit(): void {
    this.backendErrors = null;
    if (this.registrationForm.invalid) {
      this.message = 'Please fix errors before submitting.';
      this.registrationForm.markAllAsTouched();
      this.scrollToFirstError();
      return;
    }

    const formData = new FormData();
    const values = this.registrationForm.value;

    for (const key in values) {
      if (!values.hasOwnProperty(key)) continue;

      const value = values[key];

      if (key === 'minnesotaId') {
        if (value instanceof File) {
          formData.append('minnesota_id', value);
        }
      } else {
        if (value === null || value === undefined || value === '') continue;

        if (typeof value === 'boolean') {
          formData.append(this.camelToSnakeCase(key), value ? 'true' : 'false');
        } else {
          formData.append(this.camelToSnakeCase(key), value);
        }
      }
    }

    this.http.post(`${environment.apiUrl}/upgrades/upgrade/`, formData).subscribe({
      next: () => {
        this.router.navigate(['/payments'], {
          queryParams: {
            upgradeType: 'double-family',
            amount: 500
          }
        });
      },
      error: (error) => {
        console.error('Submission error:', error);
        if (error.error) {
          this.backendErrors = error.error;
          console.error('Backend validation errors:', this.backendErrors);
        }
        this.message = 'There was an error submitting your upgrade. Please check the form and try again.';
        this.scrollToFirstError();
      }
    });
  }

  private scrollToFirstError(): void {
    const firstInvalidControl: HTMLElement | null = document.querySelector(
      '.ng-invalid[formControlName]'
    );
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidControl.focus();
    }
  }

  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
