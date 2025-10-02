import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuccessAnimation } from '../shared/success-animation';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-claims',
  standalone: true,
  templateUrl: './claims.html',
  styleUrls: ['./claims.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SuccessAnimation]
})
export class Claims implements OnInit {
  claimForm: FormGroup;
  userClaims: any[] = [];
  message: string = '';
  isLoading: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';

  claimTypes = [
    { value: 'death', label: 'Death Benefit' },
    { value: 'medical', label: 'Medical Benefit' },
    { value: 'education', label: 'Education Benefit' },
    { value: 'emergency', label: 'Emergency Benefit' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.claimForm = this.fb.group({
      claim_type: ['', Validators.required],
      amount_requested: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      supporting_documents: [null]
    });
  }

  ngOnInit() {
    this.loadUserClaims();
  }

  loadUserClaims() {
    this.apiService.getClaims().subscribe({
      next: (claims: any) => {
        this.userClaims = claims;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
        this.userClaims = [];
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.claimForm.patchValue({ supporting_documents: file });
    }
  }

  onSubmit() {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    if (typeof window === 'undefined') return;
    
    this.isLoading = true;
    const token = localStorage.getItem('authToken');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const formData = new FormData();
    const formValues = this.claimForm.value;
    
    formData.append('claim_type', formValues.claim_type);
    formData.append('amount_requested', formValues.amount_requested);
    formData.append('description', formValues.description);
    
    if (formValues.supporting_documents) {
      formData.append('supporting_documents', formValues.supporting_documents);
    }

    this.apiService.createClaim(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Claim submitted successfully!';
        this.showSuccess = true;
        this.claimForm.reset();
        this.loadUserClaims();
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Failed to submit claim: ' + (error.error?.message || 'Server error');
        console.error('Claim submission error:', error);
      }
    });
  }

  onSuccessComplete() {
    this.showSuccess = false;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'paid': return 'status-paid';
      default: return 'status-pending';
    }
  }
}