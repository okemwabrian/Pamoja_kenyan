import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



interface FormField {
  name: string;
  label: string;
  helpText?: string;
  placeholder?: string;
  type: string;
  accept?: string;   // optional property for file inputs
}

@Component({
  selector: 'app-double-application',
  standalone: false,
  templateUrl: './double-application.html',
  styleUrl: './double-application.css'
})
export class DoubleApplication {
  registrationForm: FormGroup;

  personalInfoFields: FormField[] = [
    { name: 'first_name', label: 'First Name', placeholder: 'Enter first name', type: 'text' },
    { name: 'middle_name', label: 'Middle Name', placeholder: 'Enter middle name', type: 'text' },
    { name: 'last_name', label: 'Last Name', placeholder: 'Enter last name', type: 'text' },
    { name: 'email', label: 'Email', placeholder: 'Enter email', type: 'email' },
    { name: 'confirm_email', label: 'Confirm Email', placeholder: 'Confirm your email', type: 'email' },
    // example file input with accept
    { name: 'photo_id', label: 'Photo ID', placeholder: '', type: 'file', accept: 'image/*,.pdf' }
  ];

  addressFields: FormField[] = [
    { name: 'address_1', label: 'Address Line 1', placeholder: 'Enter address line 1', type: 'text' },
    { name: 'address_2', label: 'Address Line 2', placeholder: 'Enter address line 2', type: 'text' },
    { name: 'city', label: 'City', placeholder: 'Enter city', type: 'text' },
    { name: 'state_province', label: 'State/Province', placeholder: 'Enter state or province', type: 'text' },
    { name: 'zip_postal', label: 'Zip/Postal Code', placeholder: 'Enter zip or postal code', type: 'text' }
  ];

  constructor(private fb: FormBuilder) {
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

  onSubmit() {
    if (this.registrationForm.valid) {
      // submit logic here
      console.log('Form submitted:', this.registrationForm.value);
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}