# 🔗 Backend Connection Test Link

## Test URL
**http://localhost:4200/test-connection**

## How to Use
1. **Start Frontend**: `ng serve` (should be running on port 4200)
2. **Start Backend**: Make sure Django backend is running on port 8000
3. **Open Test Link**: Navigate to http://localhost:4200/test-connection
4. **Click Test Button**: Click "Test Backend Connection" button
5. **View Results**: See which endpoints are working/failing

## What It Tests
- ✅ **Applications** - `/api/applications/my-applications/`
- ✅ **Events** - `/api/notifications/events/`
- ✅ **Announcements** - `/api/notifications/announcements/`
- ✅ **Admin Users** - `/api/admin/users/`
- ✅ **Contact** - `/api/auth/contact/`

## Expected Results
- **✅ Green** = Endpoint working
- **❌ Red** = Endpoint failing (401/404/500 errors)
- **Summary** shows working vs failed endpoints

## Current Status (Based on Console Errors)
- **Backend URL**: http://localhost:8000
- **Issue**: 401 Unauthorized errors
- **Cause**: Authentication tokens not working
- **Solution**: Use test login to get valid tokens

## Quick Access
Add this to your browser bookmarks:
```
http://localhost:4200/test-connection
```