# Backend Update: Public Content Access

## Requirement Change
**Current**: Users must login to see announcements and events on home page
**New**: Users can see content without login, but must login for actions (applications, claims, etc.)

## Backend API Changes Required

### 1. Make Content Endpoints Public
```python
# Remove authentication requirement for these endpoints:
GET /api/notifications/announcements/     # Public access
GET /api/notifications/announcements/?limit=2  # For home page
GET /api/notifications/events/            # Public access  
GET /api/notifications/events/?limit=2    # For home page
```

### 2. Update Django Views
```python
# Remove @authentication_required or permission_classes
class AnnouncementListView(ListAPIView):
    queryset = Announcement.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer
    # Remove: permission_classes = [IsAuthenticated]
    
class EventListView(ListAPIView):
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
    # Remove: permission_classes = [IsAuthenticated]
```

### 3. Keep Protected Endpoints
```python
# These still require authentication:
POST /api/notifications/announcements/    # Admin only
PUT /api/notifications/announcements/{id}/ # Admin only
DELETE /api/notifications/announcements/{id}/ # Admin only
POST /api/notifications/events/           # Admin only
PUT /api/notifications/events/{id}/       # Admin only
DELETE /api/notifications/events/{id}/    # Admin only

# All user actions still require login:
POST /api/applications/single/
POST /api/applications/double/
POST /api/claims/
POST /api/contact/
POST /api/payments/
GET /api/dashboard/
```

## Frontend Impact
- **Home page**: Will show latest announcements/events without login
- **Announcements page**: Will show all content without login
- **Login/Register buttons**: Still visible for user actions
- **Protected pages**: Still require authentication

## Implementation Steps

### Step 1: Update Django Settings
```python
# In views.py - Remove authentication from read-only content
from rest_framework.permissions import AllowAny

class AnnouncementListView(ListAPIView):
    permission_classes = [AllowAny]  # Public access
    
class EventListView(ListAPIView):
    permission_classes = [AllowAny]  # Public access
```

### Step 2: Update CORS Settings
```python
# Ensure CORS allows public access
CORS_ALLOW_ALL_ORIGINS = True  # For development
# Or specify frontend domain for production
```

### Step 3: Test Public Access
```bash
# These should work WITHOUT authentication token:
curl -X GET http://localhost:8000/api/notifications/announcements/
curl -X GET http://localhost:8000/api/notifications/events/
curl -X GET "http://localhost:8000/api/notifications/announcements/?limit=2"
curl -X GET "http://localhost:8000/api/notifications/events/?limit=2"
```

### Step 4: Verify Protected Endpoints Still Work
```bash
# These should still require authentication:
curl -X POST http://localhost:8000/api/claims/ \
  -H "Authorization: Bearer {token}"
  
curl -X GET http://localhost:8000/api/dashboard/overview/ \
  -H "Authorization: Bearer {token}"
```

## Security Considerations
- **Public content**: Only announcements and events are public
- **User data**: All personal data, applications, claims remain protected
- **Admin functions**: All admin operations still require authentication
- **File uploads**: Still require authentication and validation

## Database Permissions
```python
# Announcements and Events models can be read publicly
# But creation/modification still requires admin permissions

class Announcement(models.Model):
    # Public read access
    # Admin write access only
    
class Event(models.Model):
    # Public read access  
    # Admin write access only
```

## Expected Behavior After Update

### Public Access (No Login Required)
- ✅ View announcements list
- ✅ View events list  
- ✅ View latest 2 announcements on home page
- ✅ View latest 2 events on home page
- ✅ Browse announcements page

### Protected Access (Login Required)
- 🔒 Submit membership applications
- 🔒 Submit claims
- 🔒 View user dashboard
- 🔒 Make payments
- 🔒 Contact form submission
- 🔒 Admin dashboard access
- 🔒 Create/edit/delete content (admin only)

## Verification Checklist
- [ ] Home page loads announcements/events without login
- [ ] Announcements page accessible without login
- [ ] Login still required for applications, claims, dashboard
- [ ] Admin functions still protected
- [ ] File uploads still secure
- [ ] CORS configured properly

## Quick Test Commands
```bash
# Test public access (should work without token)
curl -X GET http://localhost:8000/api/notifications/announcements/?limit=2
curl -X GET http://localhost:8000/api/notifications/events/?limit=2

# Test protected access (should require token)
curl -X POST http://localhost:8000/api/claims/ \
  -H "Content-Type: application/json" \
  -d '{"claim_type":"medical","amount_requested":100,"description":"test"}'
# Should return 401 Unauthorized without token
```