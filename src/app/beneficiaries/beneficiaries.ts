import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-beneficiaries',
  standalone: false,
  templateUrl: './beneficiaries.html',
  styleUrl: './beneficiaries.css'
})
export class Beneficiaries implements OnInit {

  beneficiaries = [
    {
      name: 'Okemwa Brian',
      phone: '+16123456789',
      email: 'okemwabrian@gmail.com'
    },
    {
      name: 'Jane Doe',
      phone: '+19876543210',
      email: 'jane.doe@example.com'
    }
  ];

  maskedBeneficiaries: { name: string; phone: string; email: string }[] = [];


  displayedColumns: string[] = ['name', 'phone', 'email'];

  formData = {
    fullName: '',
    email: '',
    currentNames: '',
    newNames: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  };

  ngOnInit(): void {
    this.maskedBeneficiaries = this.beneficiaries.map(b => ({
      name: this.maskName(b.name),
      phone: this.maskPhone(b.phone),
      email: this.maskEmail(b.email)
    }));
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
    console.log('Form submitted:', this.formData);
    // Later: send this data to the backend API.
  }
}