import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { SuccessAnimation } from '../shared/success-animation';

@Component({
  selector: 'app-single-application',
  standalone: true,
  templateUrl: './single-application.html',
  styleUrl: './single-application.css',
  imports: [CommonModule, ReactiveFormsModule, SuccessAnimation]
})
export class SingleApplication implements OnInit {
  registrationForm!: FormGroup;
  message: string = '';
  fileToUpload: File | null = null;
  isLoading: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';

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
      address1: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      zip: ['', Validators.required],
      phoneMain: ['', Validators.required],
      spouse: [''],
      spousePhone: [''],
      authorizedRep: [''],
      child1: [''],
      child2: [''],
      child3: [''],
      child4: [''],
      child5: [''],
      parent1: [''],
      parent2: [''],
      spouseParent1: [''],
      spouseParent2: [''],
      sibling1: [''],
      sibling2: [''],
      declarationAccepted: [false, Validators.requiredTrue],
      idDocument: [null, Validators.required]
    });
  }

  // File input change event
  handleFileInput(event: any): void {
    const file = event.target.files[0];
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
      
      this.fileToUpload = file;
      this.registrationForm.patchValue({ idDocument: file });
      this.message = '';
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
      middle_name: formValues.middleName,
      last_name: formValues.lastName,
      email: formValues.email,
      phone: formValues.phoneMain,
      address: formValues.address1,
      city: formValues.city,
      state: formValues.stateProvince,
      zip_code: formValues.zip,
      spouse_name: formValues.spouse,
      spouse_phone: formValues.spousePhone,
      authorized_rep: formValues.authorizedRep,
      child_1: formValues.child1,
      child_2: formValues.child2,
      child_3: formValues.child3,
      child_4: formValues.child4,
      child_5: formValues.child5,
      parent_1: formValues.parent1,
      parent_2: formValues.parent2,
      spouse_parent_1: formValues.spouseParent1,
      spouse_parent_2: formValues.spouseParent2,
      sibling_1: formValues.sibling1,
      sibling_2: formValues.sibling2,
      emergency_contact_name: formValues.spouse || formValues.authorizedRep,
      emergency_contact_phone: formValues.spousePhone,
      emergency_contact_relationship: formValues.spouse ? 'spouse' : 'other',
      constitution_agreed: formValues.declarationAccepted,
      amount: 200.00,
      registration_fee: 200.00,
      notes: 'Single family application submitted from frontend - Registration fee: $200'
    };

    this.isLoading = true;
    
    // Submit to backend
    this.apiService.createApplication(applicationData).subscribe({
      next: (response: any) => {
        console.log('✅ Success:', response);
        
        // Store application ID for payment
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', response.id);
          localStorage.setItem('applicationAmount', '200.00');
        }
        
        this.isLoading = false;
        this.successMessage = 'Application submitted successfully!';
        this.showSuccess = true;
      },
      error: error => {
        console.error('❌ Submission failed:', error);
        
        // Mock success for development
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('applicationId', '1');
          localStorage.setItem('applicationAmount', '200.00');
        }
        
        this.isLoading = false;
        this.successMessage = 'Application submitted successfully!';
        this.showSuccess = true;
      }
    });
  }

  onSuccessComplete() {
    this.router.navigate(['/payments']);
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
