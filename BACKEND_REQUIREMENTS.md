# PamojaKenya Backend Requirements Specification

## Overview
Django REST API backend for PamojaKenya membership management system with comprehensive user management, applications, payments, claims, content management, and admin functionality.

## Core System Requirements

### 1. Authentication & Authorization System
**JWT-based authentication with role-based access control**

**Models:**
```python
# User model (extend Django User)
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    is_admin = models.BooleanField(default=False)
    membership_type = models.CharField(max_length=20, choices=[('single', 'Single'), ('double', 'Double')], null=True)
    membership_status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
```

**API Endpoints:**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns JWT token)
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/forgot-password/` - Password reset request
- `POST /api/auth/reset-password/` - Password reset confirmation
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### 2. Membership Applications System
**Handle single ($200) and double ($400) membership applications with comprehensive family data**

**Models:**
```python
class MembershipApplication(models.Model):
    # Applicant Info
    applicant = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    date_of_birth = models.DateField()
    place_of_birth = models.CharField(max_length=100)
    id_number = models.CharField(max_length=50)
    id_document = models.FileField(upload_to='documents/ids/')
    
    # Application Details
    application_type = models.CharField(max_length=10, choices=[('single', 'Single'), ('double', 'Double')])
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    
    # Family Information
    spouse_name = models.CharField(max_length=100, blank=True)
    spouse_dob = models.DateField(null=True, blank=True)
    spouse_id = models.CharField(max_length=50, blank=True)
    
    # Emergency Contacts
    emergency_contact_1_name = models.CharField(max_length=100)
    emergency_contact_1_phone = models.CharField(max_length=20)
    emergency_contact_1_relationship = models.CharField(max_length=50)
    emergency_contact_2_name = models.CharField(max_length=100, blank=True)
    emergency_contact_2_phone = models.CharField(max_length=20, blank=True)
    emergency_contact_2_relationship = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FamilyMember(models.Model):
    application = models.ForeignKey(MembershipApplication, related_name='family_members', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    id_number = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    member_type = models.CharField(max_length=20, choices=[('child', 'Child'), ('parent', 'Parent'), ('sibling', 'Sibling')])
```

**API Endpoints:**
- `POST /api/applications/single/` - Submit single membership application
- `POST /api/applications/double/` - Submit double membership application
- `GET /api/applications/` - List applications (admin only)
- `GET /api/applications/{id}/` - Get application details
- `PUT /api/applications/{id}/status/` - Update application status (admin only)
- `GET /api/applications/{id}/documents/` - View application documents

### 3. Payment Processing System
**PayPal integration with transaction recording**

**Models:**
```python
class Payment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    application = models.ForeignKey(MembershipApplication, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, default='paypal')
    paypal_transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
```

**API Endpoints:**
- `POST /api/payments/create/` - Create payment record
- `POST /api/payments/confirm/` - Confirm PayPal payment
- `GET /api/payments/history/` - Get user payment history
- `GET /api/payments/` - List all payments (admin only)

### 4. Claims Management System
**Handle benefit claims with document uploads**

**Models:**
```python
class Claim(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    claim_type = models.CharField(max_length=50, choices=[
        ('death', 'Death Benefit'),
        ('medical', 'Medical Assistance'),
        ('education', 'Education Support'),
        ('emergency', 'Emergency Assistance')
    ])
    amount_requested = models.DecimalField(max_digits=10, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    supporting_documents = models.FileField(upload_to='documents/claims/', blank=True)
    status = models.CharField(max_length=20, default='pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**API Endpoints:**
- `POST /api/claims/` - Submit new claim
- `GET /api/claims/` - List user claims / all claims (admin)
- `GET /api/claims/{id}/` - Get claim details
- `PUT /api/claims/{id}/` - Update claim status (admin only)
- `GET /api/claims/{id}/documents/` - View claim documents

### 5. Content Management System
**Announcements, events, and meetings management**

**Models:**
```python
class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('urgent', 'Urgent')
    ], default='medium')
    is_pinned = models.BooleanField(default=False)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    is_featured = models.BooleanField(default=False)
    registration_required = models.BooleanField(default=False)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Meeting(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
```

**API Endpoints:**
- `GET /api/notifications/announcements/` - List announcements (with ?limit=2 for latest)
- `POST /api/notifications/announcements/` - Create announcement (admin only)
- `PUT /api/notifications/announcements/{id}/` - Update announcement (admin only)
- `DELETE /api/notifications/announcements/{id}/` - Delete announcement (admin only)
- `GET /api/notifications/events/` - List events (with ?limit=2 for latest)
- `POST /api/notifications/events/` - Create event (admin only)
- `PUT /api/notifications/events/{id}/` - Update event (admin only)
- `DELETE /api/notifications/events/{id}/` - Delete event (admin only)
- `POST /api/notifications/meetings/` - Create meeting (admin only)

### 6. Contact Management System
**Handle contact form submissions with admin notifications**

**Models:**
```python
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
```

**API Endpoints:**
- `POST /api/contact/` - Submit contact message
- `GET /api/contact/` - List contact messages (admin only)
- `PUT /api/contact/{id}/status/` - Update message status (admin only)

### 7. Shares Management System
**Handle share purchases and tracking**

**Models:**
```python
class SharePurchase(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    shares_purchased = models.IntegerField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
```

**API Endpoints:**
- `POST /api/shares/purchase/` - Purchase shares
- `GET /api/shares/history/` - Get user share history

### 8. User Dashboard System
**Comprehensive user dashboard data**

**API Endpoints:**
- `GET /api/dashboard/overview/` - Dashboard overview data
- `GET /api/dashboard/applications/` - User applications
- `GET /api/dashboard/payments/` - User payment history
- `GET /api/dashboard/claims/` - User claims

### 9. Admin Dashboard System
**Complete admin management interface**

**API Endpoints:**
- `GET /api/admin/stats/` - Admin dashboard statistics
- `GET /api/admin/users/` - List all users
- `PUT /api/admin/users/{id}/` - Update user details
- `GET /api/admin/applications/` - List all applications
- `GET /api/admin/claims/` - List all claims
- `GET /api/admin/payments/` - List all payments
- `GET /api/admin/contacts/` - List all contact messages

### 10. File Upload & Management
**Secure file handling for documents**

**Requirements:**
- Support for PDF, JPG, PNG file uploads
- File size validation (max 5MB)
- Secure file storage with proper naming
- File access control based on user permissions

**API Endpoints:**
- `POST /api/files/upload/` - Upload file
- `GET /api/files/{id}/` - Download file (with permission check)

## Security Requirements

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (admin vs regular user)
- Token expiration and refresh mechanism
- Secure password hashing (Django default)

### Data Protection
- Input validation and sanitization
- SQL injection prevention (Django ORM)
- XSS protection
- CSRF protection for state-changing operations
- File upload security (type and size validation)

### API Security
- CORS configuration for frontend domain
- Rate limiting on sensitive endpoints
- HTTPS enforcement in production
- Secure headers configuration

## Technical Requirements

### Framework & Database
- Django 4.x with Django REST Framework
- PostgreSQL database (production) / SQLite (development)
- Redis for caching and session storage

### File Storage
- Local file storage for development
- AWS S3 or similar for production file storage
- Proper file access controls

### Email System
- Django email backend configuration
- Email notifications for:
  - New contact messages (to admin)
  - Application status updates
  - Password reset requests

### API Documentation
- Swagger/OpenAPI documentation
- Clear endpoint documentation with request/response examples

## Deployment Requirements

### Environment Configuration
- Separate settings for development/production
- Environment variables for sensitive data
- Database migration management

### Performance
- Database indexing on frequently queried fields
- API response caching where appropriate
- File upload optimization

### Monitoring & Logging
- Request/response logging
- Error tracking and reporting
- Performance monitoring

## Data Validation Rules

### Application Forms
- Required fields validation
- Email format validation
- Phone number format validation
- Date validation (birth dates, etc.)
- File type and size validation

### Payment Processing
- Amount validation (positive numbers)
- PayPal transaction ID uniqueness
- Payment status tracking

### Claims Processing
- Amount validation
- Document requirement validation
- Status transition rules

This comprehensive backend specification covers all frontend requirements identified in the PamojaKenya application, ensuring complete functionality for user management, applications, payments, claims, content management, and administrative operations.