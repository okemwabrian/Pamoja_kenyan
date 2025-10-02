# Backend Verification Prompt for PamojaKenya

## Quick Backend Compliance Check

**Ask your backend developer to confirm these requirements:**

### 1. Authentication & Session Management ⚡
- [ ] **JWT tokens with different expiration times**: Regular users (10 minutes), Admins (no expiration/long expiration)
- [ ] **User model includes**: `is_admin` boolean field to differentiate admin vs regular users
- [ ] **Login response includes**: User role information (`is_admin: true/false`)

### 2. Critical API Endpoints ⚡
**Test these endpoints immediately:**

```bash
# Authentication
POST /api/auth/login/
POST /api/auth/register/

# Home page content (MUST WORK)
GET /api/notifications/announcements/?limit=2
GET /api/notifications/events/?limit=2

# Admin dashboard
GET /api/admin/stats/
GET /api/admin/users/
GET /api/admin/applications/
```

### 3. Membership Applications ⚡
- [ ] **Single application**: `POST /api/applications/single/` (captures family data)
- [ ] **Double application**: `POST /api/applications/double/` (captures extended family data)
- [ ] **Admin management**: `GET /api/applications/`, `PUT /api/applications/{id}/status/`

### 4. Content Management ⚡
- [ ] **Create announcements**: `POST /api/notifications/announcements/` (admin only)
- [ ] **Create events**: `POST /api/notifications/events/` (admin only)
- [ ] **Create meetings**: `POST /api/notifications/meetings/` (admin only)
- [ ] **CRUD operations**: Edit/delete for all content types

### 5. Claims System ⚡
- [ ] **Submit claims**: `POST /api/claims/` (with file upload support)
- [ ] **Admin approval**: `PUT /api/claims/{id}/` (approve/reject with notes)
- [ ] **Document viewing**: `GET /api/claims/{id}/documents/`

### 6. Payment Integration ⚡
- [ ] **PayPal recording**: `POST /api/payments/create/`, `POST /api/payments/confirm/`
- [ ] **Link to applications**: Payments must reference membership applications

### 7. File Upload System ⚡
- [ ] **Document uploads**: Support for PDF, JPG, PNG (max 5MB)
- [ ] **Secure access**: File downloads with permission checks
- [ ] **Storage**: ID documents, claim documents

### 8. Contact System ⚡
- [ ] **Contact form**: `POST /api/contact/`
- [ ] **Admin management**: `GET /api/contact/`, `PUT /api/contact/{id}/status/`

## Data Models Required

### User Model Extensions
```python
class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)  # CRITICAL for session timeout
    phone = models.CharField(max_length=20)
    membership_type = models.CharField(max_length=20)
    membership_status = models.CharField(max_length=20)
```

### Application Model (Family Data)
```python
class MembershipApplication(models.Model):
    # Applicant info
    applicant = models.CharField(max_length=100)
    email = models.EmailField()
    # Family members (spouse, children, parents, siblings)
    # Emergency contacts (2 contacts)
    # Documents (ID uploads)
```

## Quick Test Script

**Run this to verify backend:**

```bash
# 1. Test login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Test home page content (CRITICAL)
curl -X GET "http://localhost:8000/api/notifications/announcements/?limit=2"
curl -X GET "http://localhost:8000/api/notifications/events/?limit=2"

# 3. Test admin endpoints
curl -X GET http://localhost:8000/api/admin/stats/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Session Timeout Requirements

**IMPORTANT**: Backend must support different JWT expiration times:
- **Regular users**: 10-minute token expiration
- **Admins**: No expiration or very long expiration (24 hours+)

**Login response must include:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "is_admin": true,  // CRITICAL FIELD
    "email": "admin@example.com"
  }
}
```

## Priority Implementation Order

**If backend is incomplete, implement in this exact order:**

1. **Authentication with admin roles** (JWT + `is_admin` field)
2. **Content endpoints** (announcements/events for home page)
3. **Admin dashboard endpoints** (stats, users, applications)
4. **Membership applications** (single/double with family data)
5. **Claims system** (submit/approve with file uploads)
6. **Payment processing** (PayPal integration)
7. **Contact system**
8. **File upload system**
9. **Shares system**
10. **User dashboard**

## Final Verification Questions

**Ask your backend developer:**

1. **"Can regular users login and get auto-logged out after 10 minutes?"**
2. **"Can admin users login and stay logged in indefinitely?"**
3. **"Does the login response include `is_admin: true/false`?"**
4. **"Can I fetch latest 2 announcements and 2 events for the home page?"**
5. **"Can admins create, edit, and delete announcements, events, and meetings?"**
6. **"Can users submit membership applications with complete family data?"**
7. **"Can admins approve/reject applications and claims?"**
8. **"Can you handle PayPal payments and link them to applications?"**
9. **"Do you have file upload support for ID documents and claim documents?"**
10. **"Are all admin endpoints protected and regular user endpoints accessible?"**

## Success Criteria

✅ **Backend is ready when:**
- All 10 questions above are answered "YES"
- Quick test script runs successfully
- Home page can load latest announcements and events
- Admin can login and access dashboard
- Regular users get 10-minute timeout, admins don't timeout