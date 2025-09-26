import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../services/registration';
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

    const formData = new FormData();
    const formValues = this.registrationForm.value;

    // Append form fields
    Object.keys(formValues).forEach(key => {
      if (key !== 'minnesotaId') {
        formData.append(this.camelToSnake(key), formValues[key]);
      }
    });

    // Append file if available
    if (this.fileToUpload) {
      formData.append('minnesota_id', this.fileToUpload);
    }

    // Store form data for payments page
    this.registrationService.setData(formValues);

    // Submit to backend
    this.http.post('http://127.0.0.1:8000/api/single-application/apply/', formData).subscribe({
      next: (response: any) => {
        console.log('✅ Success:', response);
        this.message = 'Registration submitted successfully! Redirecting to payment...';
        this.router.navigate(['/payments']);
      },
      error: error => {
        console.error('❌ Submission failed:', error);
        this.message = 'Something went wrong. Please try again.';
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
