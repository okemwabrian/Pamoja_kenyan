import { Component } from '@angular/core';

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

  onSubmit(): void {
    if (
      this.formData.name &&
      this.formData.email &&
      this.formData.subject &&
      this.formData.message
    ) {
      console.log('✅ Contact Form Submitted:', this.formData);
      alert('✅ Message sent! We will get back to you soon.');
      // Optional: Reset form
      this.formData = {
        name: '',
        email: '',
        subject: '',
        helpType: 'membership',
        message: ''
      };
    } else {
      alert('❌ Please fill in all required fields.');
    }
  }
}
