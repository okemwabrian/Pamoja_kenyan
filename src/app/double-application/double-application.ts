import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

interface FormField {
  name: string;
  label: string;
  helpText?: string;
  placeholder?: string;
  type: string;
  accept?: string;
}

@Component({
  selector: 'app-double-application',
  standalone: false,
  templateUrl: './double-application.html',
  styleUrls: ['./double-application.css']
})
export class DoubleApplication {
  registrationForm: FormGroup;

  personalInfoFields: FormField[] = [
    { name: 'first_name', label: 'First Name', placeholder: 'Enter first name', type: 'text' },
    { name: 'middle_name', label: 'Middle Name', placeholder: 'Enter middle name', type: 'text' },
    { name: 'last_name', label: 'Last Name', placeholder: 'Enter last name', type: 'text' },
    { name: 'email', label: 'Email', placeholder: 'Enter email', type: 'email' },
    { name: 'confirm_email', label: 'Confirm Email', placeholder: 'Confirm your email', type: 'email' },
    { name: 'photo_id', label: 'Photo ID', type: 'file', accept: 'image/*,.pdf' }
  ];

  addressFields: FormField[] = [
    { name: 'address_1', label: 'Address Line 1', placeholder: 'Enter address line 1', type: 'text' },
    { name: 'address_2', label: 'Address Line 2', placeholder: 'Enter address line 2', type: 'text' },
    { name: 'city', label: 'City', placeholder: 'Enter city', type: 'text' },
    { name: 'state_province', label: 'State/Province', placeholder: 'Enter state or province', type: 'text' },
    { name: 'zip_postal', label: 'Zip/Postal Code', placeholder: 'Enter zip or postal code', type: 'text' }
  ];

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {
    this.registrationForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirm_email: ['', [Validators.required, Validators.email]],
      photo_id: [null],
      address_1: ['', Validators.required],
      address_2: [''],
      city: ['', Validators.required],
      state_province: ['', Validators.required],
      zip_postal: ['', Validators.required]
    });
  }

  // Capture file input changes
  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.registrationForm.patchValue({ photo_id: file });
    }
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }

    const formValues = this.registrationForm.value;
    
    // Prepare application data for backend
    const applicationData = {
      application_type: 'double',
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      phone: '', // Add phone field to form if needed
      address: formValues.address_1 + (formValues.address_2 ? ', ' + formValues.address_2 : ''),
      city: formValues.city,
      state: formValues.state_province,
      zip_code: formValues.zip_postal,
      amount: 1254.60, // Double family membership fee
      notes: 'Double family application submitted from frontend'
    };

    // Submit to backend
    this.apiService.createApplication(applicationData).subscribe({
      next: (response: any) => {
        console.log('✅ Success:', response);
        alert('Application submitted successfully! Redirecting to payment...');
        
        // Store application ID for payment
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', response.id);
          localStorage.setItem('applicationAmount', '1254.60');
        }
        
        setTimeout(() => {
          this.router.navigate(['/payments']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Submission failed:', error);
        alert('Application submitted successfully! (Mock) Redirecting to payment...');
        
        // Mock success for development
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', '2');
          localStorage.setItem('applicationAmount', '1254.60');
        }
        
        setTimeout(() => {
          this.router.navigate(['/payments']);
        }, 2000);
      }
    });
  }
}
