# Frontend-Backend Connection Test

## Issue: Frontend not posting to backend

### Possible Causes:
1. **CORS not configured** on Django backend
2. **Backend endpoints don't exist**
3. **Network/firewall blocking requests**
4. **Wrong URL configuration**

## Test Steps:

### 1. Check if Backend is Reachable
Open browser and go to:
- `http://127.0.0.1:8000/` (should show Django page)
- `http://127.0.0.1:8000/admin/` (should show Django admin)

### 2. Test API Endpoints Directly
```bash
# Test if API endpoints exist
curl -v http://127.0.0.1:8000/api/
curl -v http://127.0.0.1:8000/api/auth/login/
curl -v http://127.0.0.1:8000/api/notifications/announcements/
```

### 3. Test CORS with Browser
Open browser console (F12) and run:
```javascript
fetch('http://127.0.0.1:8000/api/notifications/announcements/')
  .then(response => response.json())
  .then(data => console.log('✅ Success:', data))
  .catch(error => console.error('❌ Error:', error));
```

### 4. Check Django Backend CORS Settings
Backend needs this in `settings.py`:
```python
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

CORS_ALLOW_CREDENTIALS = True
```

### 5. Check Django URLs
Backend needs these URLs in `urls.py`:
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('your_app.urls')),
]
```

## Quick Fix Commands

### Install CORS in Django:
```bash
pip install django-cors-headers
```

### Test Backend Endpoints:
```bash
# Test login endpoint
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test announcements endpoint  
curl http://127.0.0.1:8000/api/notifications/announcements/
```

## Expected Results:
- ✅ **No CORS errors** in browser console
- ✅ **200 OK responses** from API endpoints
- ✅ **JSON data returned** from endpoints
- ✅ **POST requests work** without errors

## If Still Not Working:
1. **Check Django logs** for errors
2. **Verify Django is running** on port 8000
3. **Check firewall/antivirus** blocking requests
4. **Try different browser** to rule out browser issues

## Frontend Debug Info:
The frontend now has detailed logging. Check browser console for:
- 🔄 Request URLs being called
- 📤 Data being sent
- ❌ Detailed error information
- 🚫 CORS error messages