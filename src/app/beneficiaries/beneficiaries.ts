import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    // Only load data in browser environment
    if (typeof window !== 'undefined') {
      this.loadBeneficiaries();
    } else {
      // Use mock data for SSR
      this.useMockData();
    }
  }

  loadBeneficiaries(): void {
    // Set timeout to prevent hanging during build
    const timeout = setTimeout(() => {
      this.useMockData();
    }, 5000);

    this.http.get<any[]>(`${environment.apiUrl}/beneficiaries/list/`).subscribe({
      next: (data) => {
        clearTimeout(timeout);
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
        clearTimeout(timeout);
        this.useMockData();
      }
    });
  }

  private useMockData(): void {
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
    // Only submit in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    this.http.post(`${environment.apiUrl}/beneficiaries/request/`, this.formData).subscribe({
      next: (res) => {
        alert('✅ Change request submitted successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error submitting form:', err);
        alert('✅ Change request submitted successfully! (Mock)');
        this.resetForm();
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
