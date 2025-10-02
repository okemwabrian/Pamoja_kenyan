import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  imports: [CommonModule, FormsModule]
})
export class Contact {
  formData = {
    name: '',
    email: '',
    subject: '',
    helpType: 'membership',
    message: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  private readonly apiUrl = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      name: this.sanitizeInput(this.formData.name),
      email: this.sanitizeInput(this.formData.email),
      subject: this.sanitizeInput(this.formData.subject),
      help_type: this.formData.helpType,
      message: this.sanitizeInput(this.formData.message)
    };

    this.http.post(`${environment.apiUrl}/notifications/contact/submit/`, payload).subscribe({
      next: (response: any) => {
        this.successMessage = 'Message sent successfully! We will get back to you soon.';
        this.resetForm();
        this.isSubmitting = false;
        
        // Send notification to admin
        this.notifyAdmin(payload);
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Please try again later.';
        this.isSubmitting = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.formData.name || !this.formData.email || !this.formData.subject || !this.formData.message) {
      this.errorMessage = 'Please fill in all required fields.';
      return false;
    }
    if (!this.isValidEmail(this.formData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private sanitizeInput(input: string): string {
    return input.replace(/[\r\n\t]/g, '').trim();
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

  private notifyAdmin(contactData: any) {
    // Send real-time notification to admin
    this.http.post(`${environment.apiUrl}/admin/notifications/contact/`, {
      type: 'contact_message',
      title: `New Contact: ${contactData.subject}`,
      message: `${contactData.name} (${contactData.email}) sent a message about ${contactData.help_type}`,
      priority: 'high',
      contact_id: Date.now()
    }).subscribe({
      next: () => console.log('Admin notified'),
      error: () => console.log('Failed to notify admin')
    });
  }
}
