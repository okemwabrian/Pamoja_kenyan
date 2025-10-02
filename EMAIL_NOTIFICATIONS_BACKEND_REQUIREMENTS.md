# Email Notifications Backend Requirements

## Required Email Notifications

### 1. User Registration ✉️
**Trigger**: After successful user registration
**Recipient**: New user
**Template**: Welcome email with account details

```python
# Send after user registration
def send_welcome_email(user):
    subject = "Welcome to Pamoja Kenya MN"
    template = "emails/welcome.html"
    context = {
        'user_name': user.first_name or user.username,
        'login_url': 'https://pamojakenyamn.com/login'
    }
```

### 2. Membership Application Submission ✉️
**Trigger**: After application submission (single/double)
**Recipient**: Applicant
**Template**: Application confirmation with reference number

```python
# Send after application submission
def send_application_confirmation(application):
    subject = f"Application Submitted - Reference #{application.id}"
    template = "emails/application_confirmation.html"
    context = {
        'applicant_name': application.applicant,
        'application_type': application.application_type,
        'amount': application.amount,
        'reference_number': application.id
    }
```

### 3. Payment Confirmation ✉️
**Trigger**: After successful PayPal payment
**Recipient**: User who made payment
**Template**: Payment receipt with transaction details

```python
# Send after payment confirmation
def send_payment_confirmation(payment):
    subject = f"Payment Confirmed - ${payment.amount}"
    template = "emails/payment_confirmation.html"
    context = {
        'user_name': payment.user.first_name,
        'amount': payment.amount,
        'transaction_id': payment.paypal_transaction_id,
        'application_type': payment.application.application_type if payment.application else None
    }
```

### 4. Application Status Update ✉️
**Trigger**: When admin approves/rejects application
**Recipient**: Applicant
**Template**: Status update notification

```python
# Send when application status changes
def send_application_status_update(application):
    subject = f"Application {application.status.title()} - Reference #{application.id}"
    template = "emails/application_status.html"
    context = {
        'applicant_name': application.applicant,
        'status': application.status,
        'application_type': application.application_type,
        'reference_number': application.id
    }
```

### 5. Claim Status Update ✉️
**Trigger**: When admin approves/rejects claim
**Recipient**: User who submitted claim
**Template**: Claim decision notification

```python
# Send when claim status changes
def send_claim_status_update(claim):
    subject = f"Claim {claim.status.title()} - {claim.claim_type}"
    template = "emails/claim_status.html"
    context = {
        'user_name': claim.user.first_name,
        'claim_type': claim.claim_type,
        'status': claim.status,
        'amount_requested': claim.amount_requested,
        'amount_approved': claim.amount_approved,
        'admin_notes': claim.admin_notes
    }
```

### 6. Contact Form Submission ✉️
**Trigger**: When user submits contact form
**Recipient**: Admin email
**Template**: New contact message notification

```python
# Send to admin when contact form submitted
def send_contact_notification(contact):
    subject = f"New Contact Message: {contact.subject}"
    template = "emails/contact_notification.html"
    context = {
        'contact_name': contact.name,
        'contact_email': contact.email,
        'contact_phone': contact.phone,
        'subject': contact.subject,
        'message': contact.message
    }
    # Send to admin email
```

### 7. Password Reset ✉️
**Trigger**: When user requests password reset
**Recipient**: User
**Template**: Password reset link

```python
# Send password reset email
def send_password_reset_email(user, reset_token):
    subject = "Password Reset Request - Pamoja Kenya MN"
    template = "emails/password_reset.html"
    context = {
        'user_name': user.first_name,
        'reset_url': f'https://pamojakenyamn.com/reset-password?token={reset_token}'
    }
```

## Django Email Configuration

### Settings.py Configuration
```python
# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or your SMTP server
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'Pamoja Kenya MN <noreply@pamojakenyamn.com>'

# Admin email for notifications
ADMIN_EMAIL = 'admin@pamojakenyamn.com'
```

### Email Templates Required

Create these HTML email templates in `templates/emails/`:

1. **welcome.html** - Welcome new users
2. **application_confirmation.html** - Application submission confirmation
3. **payment_confirmation.html** - Payment receipt
4. **application_status.html** - Application approval/rejection
5. **claim_status.html** - Claim approval/rejection
6. **contact_notification.html** - Contact form notification to admin
7. **password_reset.html** - Password reset link

### Sample Email Template Structure
```html
<!-- templates/emails/welcome.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Pamoja Kenya MN</title>
</head>
<body>
    <h2>Welcome {{ user_name }}!</h2>
    <p>Thank you for joining Pamoja Kenya MN. Your account has been created successfully.</p>
    <p><a href="{{ login_url }}">Login to your account</a></p>
    <p>Best regards,<br>Pamoja Kenya MN Team</p>
</body>
</html>
```

## Implementation in Views

### Registration View
```python
from django.core.mail import send_mail
from django.template.loader import render_to_string

def register_user(request):
    # ... user creation logic ...
    if user_created:
        # Send welcome email
        send_welcome_email(user)
        
def send_welcome_email(user):
    subject = "Welcome to Pamoja Kenya MN"
    html_message = render_to_string('emails/welcome.html', {
        'user_name': user.first_name or user.username,
        'login_url': 'https://pamojakenyamn.com/login'
    })
    send_mail(
        subject=subject,
        message='',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message
    )
```

## Email Verification Checklist

**Ask your backend developer to confirm:**

### 1. Email Configuration ✅
- [ ] SMTP settings configured in Django settings
- [ ] Email backend working (test with Django shell)
- [ ] FROM_EMAIL and ADMIN_EMAIL configured

### 2. Email Templates ✅
- [ ] HTML email templates created for all 7 scenarios
- [ ] Templates include proper styling and branding
- [ ] Templates are mobile-responsive

### 3. Email Triggers ✅
- [ ] Welcome email sent after user registration
- [ ] Application confirmation sent after submission
- [ ] Payment confirmation sent after PayPal success
- [ ] Status update emails sent when admin changes application/claim status
- [ ] Contact form notification sent to admin
- [ ] Password reset email working

### 4. Email Content ✅
- [ ] All emails include relevant user/application data
- [ ] Emails have proper subject lines
- [ ] Emails include company branding and contact info
- [ ] Links in emails work correctly

## Test Email Functionality

### Test Commands
```python
# Django shell test
python manage.py shell

# Test email sending
from django.core.mail import send_mail
send_mail(
    'Test Email',
    'This is a test email.',
    'noreply@pamojakenyamn.com',
    ['test@example.com'],
    fail_silently=False,
)
```

### Manual Testing Checklist
- [ ] Register new user → receives welcome email
- [ ] Submit application → receives confirmation email
- [ ] Make payment → receives payment confirmation
- [ ] Admin approves application → user receives status email
- [ ] Admin approves claim → user receives claim decision email
- [ ] Submit contact form → admin receives notification
- [ ] Request password reset → receives reset link email

## Email Security & Best Practices

### Security
- Use app passwords for Gmail SMTP
- Store email credentials in environment variables
- Validate email addresses before sending
- Rate limit email sending to prevent spam

### Content Guidelines
- Include unsubscribe links where appropriate
- Use professional email templates
- Include company contact information
- Test emails across different email clients

## Priority Implementation Order

1. **Email configuration** (SMTP settings)
2. **Welcome email** (user registration)
3. **Application confirmation** (membership applications)
4. **Payment confirmation** (PayPal integration)
5. **Status update emails** (admin actions)
6. **Contact notifications** (admin alerts)
7. **Password reset** (authentication)

## Success Criteria

✅ **Email system is ready when:**
- All 7 email types are implemented and working
- Email templates are professional and branded
- SMTP configuration is working
- Manual testing confirms all emails are sent
- Admin receives contact form notifications
- Users receive confirmations for all major actions