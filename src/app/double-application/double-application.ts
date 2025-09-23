import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      return;
    }

    const formData = new FormData();
    for (const key in this.registrationForm.value) {
      const value = this.registrationForm.value[key];
      formData.append(key, value);
    }

    this.http.post('http://localhost:8000/api/double-registration/', formData).subscribe({
      next: (response) => {
        alert('✅ Application submitted successfully!');
        this.registrationForm.reset();
      },
      error: (error) => {
        console.error('❌ Submission error:', error);
        alert('❌ Failed to submit application.');
      }
    });
  }
}
