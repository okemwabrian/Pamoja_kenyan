import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-beneficiaries',
  standalone: false,
  templateUrl: './beneficiaries.html',
  styleUrls: ['./beneficiaries.css']
})
export class Beneficiaries implements OnInit {

  beneficiaries: any[] = [];
  maskedBeneficiaries: any[] = [];
  displayedColumns: string[] = ['name', 'phone', 'email'];
  isLoading = true;

  // ✅ snake_case to match Django serializer
  formData = {
    full_name: '',
    email: '',
    current_names: '',
    new_names: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  loadBeneficiaries(): void {
    this.http.get<any[]>('http://localhost:8000/api/beneficiaries/list/').subscribe({
      next: (data) => {
        this.beneficiaries = data;
        this.maskedBeneficiaries = data.map(b => ({
          name: this.maskName(b.name),
          phone: this.maskPhone(b.phone),
          email: this.maskEmail(b.email)
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // Mock data for development
        const mockData = [
          { name: 'Ian Doe', phone: '+16125551234', email: 'ian@gmail.com' },
          { name: 'Jane Smith', phone: '+16125555678', email: 'jane@example.com' }
        ];
        this.beneficiaries = mockData;
        this.maskedBeneficiaries = mockData.map(b => ({
          name: this.maskName(b.name),
          phone: this.maskPhone(b.phone),
          email: this.maskEmail(b.email)
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  maskName(name: string): string {
    const [first, last] = name.split(' ');
    const maskedFirst = first.substring(0, 3) + '***';
    const maskedLast = last ? last.charAt(0) + '***' : '';
    return `${maskedFirst} ${maskedLast}`;
  }

  maskPhone(phone: string): string {
    return phone.slice(0, 5) + '*****';
  }

  maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    const maskedUser = user.substring(0, 3) + '****';
    return `${maskedUser}@${domain}`;
  }

  onSubmit() {
    this.http.post('http://localhost:8000/api/beneficiaries/request/', this.formData).subscribe({
      next: (res) => {
        alert('✅ Change request submitted successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error submitting form:', err);
        alert('❌ Failed to submit request. Please try again.');
      }
    });
  }

  resetForm() {
    this.formData = {
      full_name: '',
      email: '',
      current_names: '',
      new_names: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    };
  }
}
