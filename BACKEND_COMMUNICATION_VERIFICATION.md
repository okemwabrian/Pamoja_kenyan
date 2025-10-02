# Backend Communication Verification Checklist

## Critical Backend Requirements Test

### 1. Authentication Endpoints ⚡ PRIORITY
**Test these endpoints immediately:**

```bash
# Registration
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "testpass123",
    "confirm_password": "testpass123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'

# Forgot Password
curl -X POST http://localhost:8000/api/auth/password-reset/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Expected Login Response:**
```json
{
  "token": "jwt_token_here",
  "refresh": "refresh_token_here",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "",
    "last_name": "",
    "is_admin": false,
    "is_staff": false,
    "is_superuser": false
  }
}
```

### 2. Public Content Endpoints ⚡ PRIORITY
**Must work WITHOUT authentication:**

```bash
# Latest announcements for home page
curl -X GET "http://localhost:8000/api/notifications/announcements/?limit=2"

# Latest events for home page  
curl -X GET "http://localhost:8000/api/notifications/events/?limit=2"

# All announcements
curl -X GET "http://localhost:8000/api/notifications/announcements/"

# All events
curl -X GET "http://localhost:8000/api/notifications/events/"
```

### 3. Protected Endpoints ⚡ PRIORITY
**Must require authentication token:**

```bash
# Get user claims (requires token)
curl -X GET http://localhost:8000/api/claims/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Submit claim (requires token)
curl -X POST http://localhost:8000/api/claims/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "claim_type": "medical",
    "amount_requested": 500.00,
    "description": "Medical expenses for treatment"
  }'

# Admin dashboard stats (requires admin token)
curl -X GET http://localhost:8000/api/admin/stats/ \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 4. Application Endpoints ⚡ PRIORITY
```bash
# Single membership application
curl -X POST http://localhost:8000/api/applications/single/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "applicant": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "date_of_birth": "1990-01-01",
    "place_of_birth": "Nairobi",
    "id_number": "12345678"
  }'

# Double membership application  
curl -X POST http://localhost:8000/api/applications/double/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "applicant": "Jane Doe",
    "email": "jane@example.com",
    "spouse_name": "John Doe",
    "spouse_dob": "1988-01-01"
  }'
```

### 5. Email Notifications ⚡ PRIORITY
**Ask backend developer:**

- [ ] **"Do users get welcome emails after registration?"**
- [ ] **"Do users get confirmation emails after application submission?"**
- [ ] **"Do users get payment confirmation emails?"**
- [ ] **"Do users get status update emails when applications are approved/rejected?"**
- [ ] **"Do admins get email notifications for new contact messages?"**

### 6. File Upload Support ⚡ PRIORITY
```bash
# Test file upload for claims
curl -X POST http://localhost:8000/api/claims/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "claim_type=medical" \
  -F "amount_requested=500.00" \
  -F "description=Medical expenses" \
  -F "supporting_documents=@test_document.pdf"
```

### 7. Admin Functionality ⚡ PRIORITY
```bash
# Admin endpoints (require admin token)
curl -X GET http://localhost:8000/api/admin/users/ \
  -H "Authorization: Bearer ADMIN_TOKEN"

curl -X GET http://localhost:8000/api/admin/applications/ \
  -H "Authorization: Bearer ADMIN_TOKEN"

curl -X PUT http://localhost:8000/api/applications/1/status/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

## Quick Verification Questions

**Ask your backend developer these 10 questions:**

### Authentication & Session Management
1. **"Can users register, login, and request password reset?"**
2. **"Do JWT tokens have different expiration times for users (10 min) vs admins (no timeout)?"**
3. **"Does login response include user role information (is_admin, is_staff)?"**

### Content Management  
4. **"Can I fetch latest 2 announcements and 2 events WITHOUT authentication for home page?"**
5. **"Can admins create, edit, and delete announcements, events, and meetings?"**

### Applications & Claims
6. **"Can users submit single and double membership applications with family data?"**
7. **"Can users submit claims with file uploads and admins approve/reject them?"**

### Payments & Communication
8. **"Can you record PayPal payments and link them to applications?"**
9. **"Are email notifications working for registration, applications, payments, and status updates?"**

### Admin Dashboard
10. **"Can admins access dashboard with stats, manage users, applications, claims, and contacts?"**

## CORS Configuration Check

**Ensure backend has proper CORS settings:**

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",  # Angular dev server
    "http://127.0.0.1:4200",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

## Database Models Verification

**Confirm these models exist:**

```python
# User model with admin flag
class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    phone = models.CharField(max_length=20)
    membership_type = models.CharField(max_length=20)

# Application model with family data
class MembershipApplication(models.Model):
    applicant = models.CharField(max_length=100)
    application_type = models.CharField(max_length=10)
    # ... family member fields

# Claims model with file upload
class Claim(models.Model):
    claim_type = models.CharField(max_length=50)
    supporting_documents = models.FileField(upload_to='claims/')
    # ... other fields

# Content models
class Announcement(models.Model):
    title = models.CharField(max_length=200)
    priority = models.CharField(max_length=20)
    is_pinned = models.BooleanField(default=False)

class Event(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
```

## Success Criteria

✅ **Backend is ready when ALL of these work:**

1. **Authentication**: Registration, login, password reset endpoints working
2. **Public content**: Home page can load announcements/events without login
3. **Protected content**: User dashboard, applications, claims require authentication
4. **Admin functions**: Admin dashboard, content management, user management working
5. **File uploads**: Claims and application documents can be uploaded
6. **Email notifications**: All 7 email types are sent automatically
7. **CORS**: Frontend can communicate with backend without CORS errors
8. **Database**: All required models and fields exist

## Failure Indicators

❌ **Backend needs work if:**

- CORS errors in browser console
- 404 errors on API endpoints
- Authentication not working
- Public content requires login
- File uploads failing
- No email notifications sent
- Admin functions not protected
- Missing database fields

## Quick Test Script

**Run this to test everything:**

```bash
#!/bin/bash
echo "Testing Backend Communication..."

# Test public endpoints
echo "1. Testing public announcements..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/notifications/announcements/?limit=2

echo "2. Testing public events..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/notifications/events/?limit=2

# Test authentication
echo "3. Testing login..."
curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

echo "Backend communication test complete!"
```