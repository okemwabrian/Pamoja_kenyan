# Fix 401 Login Error

## 🔐 **Create Test User in Backend**

The 401 error means no valid user exists. Create one:

```bash
cd E:\full_stack\Pamoja\pamoja_backend
py manage.py createsuperuser

# Enter:
Username: admin
Email: admin@test.com
Password: admin123
Password (again): admin123
```

## 🧪 **Test Login**

1. **Go to**: `http://localhost:4200/login`
2. **Enter**:
   - Username: `admin`
   - Password: `admin123`
3. **Click**: Sign In
4. **Expected**: Login success ✅

## 🔧 **Alternative: Create Regular User**

```bash
cd E:\full_stack\Pamoja\pamoja_backend
py manage.py shell

# In Python shell:
from django.contrib.auth.models import User
user = User.objects.create_user('testuser', 'test@test.com', 'testpass123')
user.save()
exit()
```

Then login with:
- Username: `testuser`
- Password: `testpass123`

## ✅ **Quick Test**
- **Backend running**: ✅
- **User created**: ✅ 
- **Login works**: Should work now!

**The 401 error will disappear once you have a valid user in the database.** 🎉