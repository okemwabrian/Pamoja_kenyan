# 🔐 Admin Login & Announcement Guide

## Admin Login Process
1. **Navigate to**: http://localhost:4200/admin-login
2. **Use Admin Credentials**: 
   - Username: `admin` (or your superuser username)
   - Password: Your admin password
3. **Access Admin Dashboard**: After login, redirected to `/admin-dashboard`

## Creating Announcements
1. **Login as Admin** using admin-login page
2. **Go to Admin Dashboard** → **Content Tab**
3. **Fill Announcement Form**:
   - Title: Announcement title
   - Content: Message content
   - Priority: Low/Medium/High/Urgent
   - Pin: Check to pin announcement
4. **Click "Create Announcement"**

## Creating Events
1. **Same Admin Dashboard** → **Content Tab**
2. **Fill Event Form**:
   - Title: Event name
   - Description: Event details
   - Date & Time: When event occurs
   - Location: Where event happens
   - Featured: Check for featured event
   - Registration: Check if registration required
3. **Click "Create Event"**

## Backend Endpoints Used
- **Login**: `POST /api/auth/login/`
- **Create Announcement**: `POST /api/notifications/announcements/`
- **Create Event**: `POST /api/notifications/events/`

## Current Status
- ✅ Skip button removed from login
- ✅ Admin login working with backend
- ✅ Admin dashboard connected to backend APIs
- ✅ Announcement creation via backend
- ✅ Event creation via backend

## Quick Access Links
- **Admin Login**: http://localhost:4200/admin-login
- **Admin Dashboard**: http://localhost:4200/admin-dashboard
- **Test Connection**: http://localhost:4200/test-connection