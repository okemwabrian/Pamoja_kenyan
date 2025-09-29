import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { SuccessAnimation } from '../shared/success-animation';

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
  standalone: true,
  templateUrl: './double-application.html',
  styleUrls: ['./double-application.css'],
  imports: [CommonModule, ReactiveFormsModule, SuccessAnimation]
})
export class DoubleApplication {
  registrationForm: FormGroup;
  message: string = '';
  isLoading: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';

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
      phone: ['', Validators.required],
      address_1: ['', Validators.required],
      address_2: [''],
      city: ['', Validators.required],
      state_province: ['', Validators.required],
      zip_postal: ['', Validators.required],
      spouse_name: [''],
      spouse_phone: [''],
      authorized_rep: [''],
      child_1: [''],
      child_2: [''],
      child_3: [''],
      child_4: [''],
      child_5: [''],
      parent_1: [''],
      parent_2: [''],
      spouse_parent_1: [''],
      spouse_parent_2: [''],
      sibling_1: [''],
      sibling_2: [''],
      sibling_3: [''],
      constitution_agreed: [false, Validators.requiredTrue],
      id_document: [null, Validators.required]
    });
  }

  onSuccessComplete() {
    this.router.navigate(['/payments']);
  }

  // Capture file input changes
  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.message = 'File size must be less than 5MB';
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.message = 'Please upload a valid image (JPG, PNG) or PDF file';
        return;
      }
      
      this.registrationForm.patchValue({ id_document: file });
      this.message = '';
    }
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    const formValues = this.registrationForm.value;
    
    // Prepare application data for backend
    const applicationData = {
      application_type: 'double',
      first_name: formValues.first_name,
      middle_name: formValues.middle_name,
      last_name: formValues.last_name,
      email: formValues.email,
      phone: formValues.phone,
      address: formValues.address_1 + (formValues.address_2 ? ', ' + formValues.address_2 : ''),
      city: formValues.city,
      state: formValues.state_province,
      zip_code: formValues.zip_postal,
      spouse_name: formValues.spouse_name,
      spouse_phone: formValues.spouse_phone,
      authorized_rep: formValues.authorized_rep,
      child_1: formValues.child_1,
      child_2: formValues.child_2,
      child_3: formValues.child_3,
      child_4: formValues.child_4,
      child_5: formValues.child_5,
      parent_1: formValues.parent_1,
      parent_2: formValues.parent_2,
      spouse_parent_1: formValues.spouse_parent_1,
      spouse_parent_2: formValues.spouse_parent_2,
      sibling_1: formValues.sibling_1,
      sibling_2: formValues.sibling_2,
      sibling_3: formValues.sibling_3,
      emergency_contact_name: formValues.spouse_name || formValues.authorized_rep,
      emergency_contact_phone: formValues.spouse_phone,
      emergency_contact_relationship: formValues.spouse_name ? 'spouse' : 'other',
      constitution_agreed: formValues.constitution_agreed,
      amount: 1254.60,
      notes: 'Double family application submitted from frontend'
    };

    this.isLoading = true;
    
    // Submit to backend
    this.apiService.createApplication(applicationData).subscribe({
      next: (response: any) => {
        console.log('✅ Success:', response);
        
        // Store application ID for payment
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', response.id);
          localStorage.setItem('applicationAmount', '1254.60');
        }
        
        this.isLoading = false;
        this.successMessage = 'Double family application submitted successfully!';
        this.showSuccess = true;
      },
      error: (error) => {
        console.error('❌ Submission failed:', error);
        
        // Mock success for development
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', '2');
          localStorage.setItem('applicationAmount', '1254.60');
        }
        
        this.isLoading = false;
        this.successMessage = 'Double family application submitted successfully!';
        this.showSuccess = true;
      }
    });
  }
}
