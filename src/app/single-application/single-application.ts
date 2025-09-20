import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration';

@Component({
  selector: 'app-single-application',
  standalone: false,
  templateUrl: './single-application.html',
  styleUrl: './single-application.css'
})
export class SingleApplication implements OnInit {
  registrationForm!: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      zip: ['', Validators.required],
      phoneMain: ['', Validators.required],
      phoneOptional: [''],
      minnesotaId: [null],
      spouse: [''],
      spousePhone: [''],
      authorizedRep: [''],
      authorizedRepPhone: [''],
      declarationAccepted: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('✅ Form Submitted:', this.registrationForm.value);
      this.message = 'Registration submitted successfully! Redirecting to payment...';

      // Store data in service
      this.registrationService.setData(this.registrationForm.value);

      // Navigate to payment page
      this.router.navigate(['/payments']);

    } else {
      this.message = 'Please fill all required fields correctly.';
      this.registrationForm.markAllAsTouched();
      console.log('Invalid Controls:', this.findInvalidControls());
    }
  }

  findInvalidControls(): string[] {
    const invalid = [];
    const controls = this.registrationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}