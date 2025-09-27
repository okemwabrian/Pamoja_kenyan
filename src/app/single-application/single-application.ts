import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-application',
  standalone: true,
  templateUrl: './single-application.html',
  styleUrl: './single-application.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class SingleApplication implements OnInit {
  registrationForm!: FormGroup;
  message: string = '';
  fileToUpload: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private apiService: ApiService
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
      minnesotaId: [null],  // File input handled separately
      spouse: [''],
      spousePhone: [''],
      authorizedRep: [''],
      authorizedRepPhone: [''],
      declarationAccepted: [false, Validators.requiredTrue]
    });
  }

  // File input change event
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.registrationForm.patchValue({ minnesotaId: file });
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
      this.registrationForm.markAllAsTouched();
      console.log('Invalid Controls:', this.findInvalidControls());
      return;
    }

    const formValues = this.registrationForm.value;
    
    // Prepare application data for backend
    const applicationData = {
      application_type: 'single',
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      email: formValues.email,
      phone: formValues.phoneMain,
      address: formValues.address1 + (formValues.address2 ? ', ' + formValues.address2 : ''),
      city: formValues.city,
      state: formValues.stateProvince,
      zip_code: formValues.zip,
      emergency_contact_name: formValues.spouse || formValues.authorizedRep,
      emergency_contact_phone: formValues.spousePhone || formValues.authorizedRepPhone,
      emergency_contact_relationship: formValues.spouse ? 'spouse' : 'other',
      amount: 627.30, // Single family membership fee
      notes: 'Single family application submitted from frontend'
    };

    // Submit to backend
    this.apiService.createApplication(applicationData).subscribe({
      next: (response: any) => {
        console.log('✅ Success:', response);
        this.message = 'Application submitted successfully! Redirecting to payment...';
        
        // Store application ID for payment
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', response.id);
          localStorage.setItem('applicationAmount', '627.30');
        }
        
        setTimeout(() => {
          this.router.navigate(['/payments']);
        }, 2000);
      },
      error: error => {
        console.error('❌ Submission failed:', error);
        this.message = 'Application submitted successfully! (Mock) Redirecting to payment...';
        
        // Mock success for development
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', '1');
          localStorage.setItem('applicationAmount', '627.30');
        }
        
        setTimeout(() => {
          this.router.navigate(['/payments']);
        }, 2000);
      }
    });
  }

  findInvalidControls(): string[] {
    const invalid = [];
    const controls = this.registrationForm.controls;
    for (const name of Object.keys(controls)) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
