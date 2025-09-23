import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  formData = {
    name: '',
    email: '',
    subject: '',
    helpType: 'membership',
    message: ''
  };

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (
      this.formData.name &&
      this.formData.email &&
      this.formData.subject &&
      this.formData.message
    ) {
      this.http.post('http://localhost:8000/api/contact/submit/', this.formData).subscribe({
        next: (res) => {
          console.log('✅ Contact Form Submitted:', res);
          alert('✅ Message sent! We will get back to you soon.');
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Submission error:', err);
          alert('❌ Something went wrong. Please try again later.');
        }
      });
    } else {
      alert('❌ Please fill in all required fields.');
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      helpType: 'membership',
      message: ''
    };
  }
}
