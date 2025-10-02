# Frontend-Backend Communication Specification

## Backend Requirements for Frontend Integration

### 1. CORS Configuration ⚡ CRITICAL
```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # For development only

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

### 2. Authentication Endpoints

#### Registration: `POST /api/auth/register/`
**Frontend sends:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpass123",
  "confirm_password": "testpass123"
}
```

**Backend must return:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Login: `POST /api/auth/login/`
**Frontend sends:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Backend MUST return exactly:**
```json
{
  "user": {
    "id": 13,
    "username": "admin",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "is_admin": true,
    "is_staff": true,
    "is_superuser": true
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Password Reset: `POST /api/auth/password-reset/`
**Frontend sends:**
```json
{
  "email": "user@example.com"
}
```

### 3. Public Endpoints (No Authentication)

#### Announcements: `GET /api/notifications/announcements/`
**Backend must return:**
```json
[
  {
    "id": 8,
    "title": "Welcome to Pamoja Kenya MN",
    "content": "Welcome to our community platform...",
    "priority": "high",
    "is_pinned": true,
    "created_at": "2025-10-02T13:43:07.008221+00:00",
    "created_by": {
      "username": "admin"
    }
  }
]
```

#### Events: `GET /api/notifications/events/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "title": "Monthly Meeting",
    "description": "Monthly community meeting",
    "date": "2025-10-15T18:00:00Z",
    "location": "Community Center",
    "is_featured": true,
    "registration_required": false,
    "created_at": "2025-10-02T13:43:07Z"
  }
]
```

#### Beneficiaries: `GET /api/beneficiaries/list/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "relationship": "Spouse",
    "phone": "123-456-7890"
  }
]
```

### 4. Protected Endpoints (Require JWT Token)

#### Headers Required:
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
```

#### User Applications: `GET /api/applications/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "applicant": "John Doe",
    "email": "john@example.com",
    "application_type": "single",
    "amount": "200.00",
    "status": "pending",
    "created_at": "2025-10-02T13:43:07Z"
  }
]
```

#### Submit Application: `POST /api/applications/`
**Frontend sends:**
```json
{
  "applicant": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "date_of_birth": "1990-01-01",
  "place_of_birth": "Nairobi",
  "id_number": "12345678",
  "application_type": "single",
  "amount": 200.00
}
```

#### User Claims: `GET /api/claims/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "claim_type": "medical",
    "amount_requested": "500.00",
    "amount_approved": "450.00",
    "description": "Medical expenses",
    "status": "approved",
    "admin_notes": "Approved with documentation",
    "created_at": "2025-10-02T13:43:07Z",
    "supporting_documents": "/media/claims/doc.pdf"
  }
]
```

#### Submit Claim: `POST /api/claims/`
**Frontend sends (multipart/form-data):**
```
claim_type: "medical"
amount_requested: "500.00"
description: "Medical expenses for treatment"
supporting_documents: <FILE>
```

#### User Payments: `GET /api/payments/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "amount": "200.00",
    "payment_method": "paypal",
    "paypal_transaction_id": "TXN123456",
    "status": "completed",
    "created_at": "2025-10-02T13:43:07Z"
  }
]
```

### 5. Admin Endpoints (Require Admin JWT Token)

#### Admin Stats: `GET /api/admin/stats/`
**Backend must return:**
```json
{
  "total_users": 150,
  "total_applications": 45,
  "pending_applications": 12,
  "total_claims": 23,
  "pending_claims": 5,
  "total_payments": 67,
  "total_revenue": "13400.00"
}
```

#### All Users: `GET /api/admin/users/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "date_joined": "2025-10-01T10:00:00Z"
  }
]
```

#### All Applications: `GET /api/admin/applications/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "applicant": "John Doe",
    "email": "john@example.com",
    "application_type": "single",
    "amount": "200.00",
    "status": "pending",
    "created_at": "2025-10-02T13:43:07Z",
    "user": {
      "username": "johndoe"
    }
  }
]
```

#### All Claims: `GET /api/admin/claims/`
**Backend must return:**
```json
[
  {
    "id": 1,
    "claim_type": "medical",
    "amount_requested": "500.00",
    "status": "pending",
    "created_at": "2025-10-02T13:43:07Z",
    "user": {
      "username": "johndoe"
    }
  }
]
```

#### Create Announcement: `POST /api/admin/announcements/create/`
**Frontend sends:**
```json
{
  "title": "New Announcement",
  "content": "Announcement content here",
  "priority": "medium",
  "is_pinned": false
}
```

#### Create Event: `POST /api/admin/events/create/`
**Frontend sends:**
```json
{
  "title": "New Event",
  "description": "Event description",
  "date": "2025-10-15T18:00:00Z",
  "location": "Community Center"
}
```

### 6. Error Response Format

**All endpoints must return errors in this format:**
```json
{
  "error": "Error message",
  "details": {
    "field_name": ["Field specific error"]
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### 7. File Upload Support

**For claims and applications with documents:**
- Accept: `multipart/form-data`
- File types: PDF, JPG, PNG
- Max size: 5MB
- Store securely with access control

### 8. JWT Token Requirements

**Access Token:**
- Expiration: 10 minutes for regular users
- Expiration: 24 hours for admin users
- Include user info in payload

**Refresh Token:**
- Expiration: 7 days
- Used to get new access tokens

### 9. Database Models Required

**User Model Extensions:**
```python
class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)
    membership_type = models.CharField(max_length=20, null=True)
    membership_status = models.CharField(max_length=20, default='pending')
```

**All other models from BACKEND_REQUIREMENTS.md**

### 10. Quick Test Commands

**Test all endpoints:**
```bash
# Public endpoints (no auth)
curl http://127.0.0.1:8000/api/notifications/announcements/
curl http://127.0.0.1:8000/api/notifications/events/

# Authentication
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Protected endpoints (with token)
curl http://127.0.0.1:8000/api/applications/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Admin endpoints (with admin token)
curl http://127.0.0.1:8000/api/admin/stats/ \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Critical Success Criteria

✅ **Backend is ready when:**
1. **CORS configured** for Angular frontend
2. **All endpoints return exact JSON format** shown above
3. **JWT authentication working** with proper token format
4. **Admin vs user permissions** working correctly
5. **File uploads supported** for claims/applications
6. **Public endpoints accessible** without authentication
7. **Error responses** in consistent format
8. **Database models** match frontend expectations

❌ **Common Issues:**
- CORS not configured (frontend can't connect)
- Wrong JSON response format (frontend can't parse)
- Missing JWT token support (authentication fails)
- Wrong field names in responses (frontend shows empty data)
- Missing admin permissions (admin features don't work)

**This specification ensures 100% compatibility between your Django backend and Angular frontend.**