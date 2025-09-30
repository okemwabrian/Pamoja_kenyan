# Admin Login Guide

## 🔐 How to Login as Admin

### 1. **Go to Admin Login Page**
- URL: `http://localhost:4200/admin-login`
- Or click "Admin Login" link if available

### 2. **Admin Credentials**
You need to create an admin user in the Django backend first:

```bash
# In your Django backend terminal:
cd E:\full_stack\Pamoja\pamoja_backend
py manage.py createsuperuser

# Follow prompts to create admin user:
# Username: admin
# Email: admin@pamojakenyamn.com  
# Password: [your secure password]
```

### 3. **Login Process**
- Enter your admin username and password
- Click "Sign In"
- System checks if user has admin privileges (`is_staff = True`)
- Redirects to admin dashboard if successful

### 4. **Admin Dashboard Features**
Now admin can post:
- ✅ **Announcements** - Users will see these
- ✅ **Events** - Users will see these  
- ✅ **Meetings** - Schedule virtual meetings
- ✅ **User Management** - Add/edit/remove users
- ✅ **Application Reviews** - Approve/reject applications

## ✅ **Removed Default Data**
- ❌ No more mock users, applications, or meetings
- ❌ No pre-filled login credentials
- ❌ No sample announcements or events
- ✅ Only backend data shown
- ✅ Empty states when no data

## 🧪 **Test Admin Features**
1. Login as admin
2. Go to "Content" tab
3. Create announcement → Users will see it
4. Create event → Users will see it
5. Go to "Users" tab → Manage real users from backend

---
**Admin URL**: `/admin-login`
**Dashboard**: `/admin-dashboard`