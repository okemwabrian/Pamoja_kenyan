# Backend Connection Test Guide

## 🚀 How to Test Backend Connection

### 1. Start the Backend
```bash
cd E:\full_stack\Pamoja\pamoja_backend
py manage.py runserver
```
**Expected output:** `Starting development server at http://127.0.0.1:8000/`

### 2. Start the Frontend
```bash
cd E:\full_stack\Pamoja\Pamoja_Kenya
ng serve
```
**Expected output:** `Local: http://localhost:4200/`

### 3. Test Connection Methods

#### Method 1: Visual Indicator
- Look at the **top-right corner** of the website
- **Green dot** = Backend connected ✅
- **Red dot** = Backend offline ❌

#### Method 2: Test Page
- Go to: `http://localhost:4200/test-connection`
- Click "Test Backend Connection" button
- Should show success message if connected

#### Method 3: Login Test
- Go to: `http://localhost:4200/login`
- Try to login (will show connection error if backend is down)

#### Method 4: Browser Console
- Press F12 → Console tab
- Look for API calls to `localhost:8000`
- Successful calls = Backend connected

### 4. Backend Endpoints Available
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Registration  
- `GET /api/applications/my-applications/` - User applications
- `GET /api/admin/users/` - Admin users
- `GET /api/admin/stats/` - Admin dashboard
- `GET /api/events/` - Events (admin posts)
- `GET /api/announcements/` - Announcements (admin posts)
- `GET /api/beneficiaries/` - Beneficiaries (admin posts)

### 5. What Admin Can Post
The admin can now post/manage:
- ✅ **Events** - Community events and activities
- ✅ **Announcements** - Important notices
- ✅ **Beneficiaries** - Who received benefits
- ✅ **User Management** - Add/remove users
- ✅ **Applications** - Review member applications
- ✅ **Payments** - Track payments and contributions

### 6. No More Default Data
- ❌ Removed all sample/mock data
- ✅ Only shows data from backend
- ✅ Empty states when no backend data
- ✅ Clear error messages when backend is offline

### 7. Quick Connection Check
```bash
# Test if backend is running
curl http://localhost:8000/api/applications/my-applications/
```
**Success:** Returns JSON data or authentication error
**Failure:** Connection refused error

---

## ✅ Connection Status
- **Backend URL:** `http://localhost:8000/api`
- **Frontend URL:** `http://localhost:4200`
- **Status Indicator:** Top-right corner of website
- **Test Page:** `/test-connection`