import { Component, OnInit } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8000/api/beneficiaries/list/').subscribe(data => {
      this.beneficiaries = data;
      this.maskedBeneficiaries = data.map(b => ({
        name: this.maskName(b.name),
        phone: this.maskPhone(b.phone),
        email: this.maskEmail(b.email)
      }));
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
