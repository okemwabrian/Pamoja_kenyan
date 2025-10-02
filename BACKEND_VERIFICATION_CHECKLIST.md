# Backend Verification Checklist for PamojaKenya

## Quick Verification Questions

### 1. Authentication System ✅
- [ ] Does your backend have JWT authentication?
- [ ] Can users register, login, logout, and reset passwords?
- [ ] Do you have admin vs regular user roles?
- [ ] Test endpoints: `POST /api/auth/login/`, `POST /api/auth/register/`

### 2. Membership Applications ✅
- [ ] Can users submit single ($200) and double ($400) applications?
- [ ] Do applications capture family member data (spouse, children, parents, siblings)?
- [ ] Can admins view, approve, and reject applications?
- [ ] Test endpoints: `POST /api/applications/single/`, `GET /api/applications/`

### 3. Payment Processing ✅
- [ ] Can you record PayPal payments with transaction IDs?
- [ ] Do payments link to membership applications?
- [ ] Can users view payment history?
- [ ] Test endpoints: `POST /api/payments/create/`, `GET /api/payments/history/`

### 4. Claims Management ✅
- [ ] Can users submit claims (death, medical, education, emergency)?
- [ ] Can users upload supporting documents?
- [ ] Can admins approve/reject claims with notes?
- [ ] Test endpoints: `POST /api/claims/`, `PUT /api/claims/{id}/`

### 5. Content Management ✅
- [ ] Can admins create announcements with priority levels?
- [ ] Can admins create events with dates and locations?
- [ ] Can admins create meetings?
- [ ] Can content be edited and deleted?
- [ ] Test endpoints: `POST /api/notifications/announcements/`, `GET /api/notifications/events/?limit=2`

### 6. Contact System ✅
- [ ] Can users submit contact messages?
- [ ] Can admins view and manage contact messages?
- [ ] Test endpoints: `POST /api/contact/`, `GET /api/contact/`

### 7. File Uploads ✅
- [ ] Can users upload ID documents for applications?
- [ ] Can users upload claim supporting documents?
- [ ] Are file types and sizes validated?
- [ ] Test endpoints: `POST /api/files/upload/`

### 8. Admin Dashboard ✅
- [ ] Can admins view dashboard statistics?
- [ ] Can admins manage users, applications, claims, payments?
- [ ] Test endpoints: `GET /api/admin/stats/`, `GET /api/admin/users/`

### 9. User Dashboard ✅
- [ ] Can users view their applications, payments, claims?
- [ ] Test endpoints: `GET /api/dashboard/overview/`

### 10. Shares System ✅
- [ ] Can users purchase shares?
- [ ] Can users view share history?
- [ ] Test endpoints: `POST /api/shares/purchase/`

## Critical API Endpoints to Test

### Authentication
```bash
POST /api/auth/login/
POST /api/auth/register/
GET /api/auth/profile/
```

### Applications
```bash
POST /api/applications/single/
POST /api/applications/double/
GET /api/applications/
PUT /api/applications/{id}/status/
```

### Content (Home Page Needs)
```bash
GET /api/notifications/announcements/?limit=2
GET /api/notifications/events/?limit=2
```

### Admin Functions
```bash
GET /api/admin/stats/
GET /api/admin/users/
GET /api/admin/applications/
GET /api/admin/claims/
```

## Data Models Required

### User Model Extensions
- `phone`, `is_admin`, `membership_type`, `membership_status`

### Application Model
- Applicant info, family members, emergency contacts, documents

### Payment Model
- PayPal integration, transaction tracking

### Claim Model
- Multiple claim types, document uploads, admin notes

### Content Models
- Announcements (with priority, pinning)
- Events (with location, featured status)
- Meetings (with duration)

## Security Checklist
- [ ] JWT token authentication working?
- [ ] Admin-only endpoints protected?
- [ ] File upload security (type/size validation)?
- [ ] CORS configured for frontend domain?

## Quick Test Commands

### Test Authentication
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

### Test Latest Content (Home Page)
```bash
curl -X GET "http://localhost:8000/api/notifications/announcements/?limit=2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Admin Stats
```bash
curl -X GET http://localhost:8000/api/admin/stats/ \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Missing Features Check
Ask your backend developer:

1. **"Do you have all 50+ API endpoints from the requirements?"**
2. **"Can I get latest 2 announcements and 2 events for the home page?"**
3. **"Can admins create/edit/delete announcements, events, and meetings?"**
4. **"Can users submit both single and double membership applications with family data?"**
5. **"Can you handle PayPal payment recording and link to applications?"**
6. **"Can users submit claims with document uploads and admins approve/reject them?"**
7. **"Do you have proper JWT authentication with admin/user roles?"**
8. **"Can you handle file uploads for ID documents and claim documents?"**
9. **"Do you have admin dashboard endpoints for managing everything?"**
10. **"Can users view their dashboard with applications, payments, and claims?"**

## Priority Order for Implementation
If backend is incomplete, implement in this order:
1. **Authentication system** (login/register/JWT)
2. **Content management** (announcements/events for home page)
3. **Membership applications** (single/double with family data)
4. **Admin dashboard** (manage applications, users)
5. **Claims system** (submit/approve claims)
6. **Payment processing** (PayPal integration)
7. **Contact system** (contact form)
8. **File uploads** (documents)
9. **Shares system** (purchase shares)
10. **User dashboard** (user overview)