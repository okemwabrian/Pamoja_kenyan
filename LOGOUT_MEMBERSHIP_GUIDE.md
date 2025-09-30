# Logout & Membership Dashboard Guide

## Logout Functionality ✅
- **Location**: Header dropdown menu (click user avatar)
- **Function**: Clears all user data and redirects to login
- **Features**:
  - Removes all localStorage tokens
  - Closes all dropdown menus
  - Redirects to login page
  - Refreshes page to clear state

## Dashboard Membership Info ✅
The dashboard now shows:

### Current Shares
- **Single Membership**: $200 shares
- **Double Membership**: $400 shares
- **Calculated from**: Latest application amount

### Membership Type
- Shows: Single/Double/None
- **Source**: Backend application data

### Status
- Shows: Active/Inactive/Pending
- **Source**: Application status from backend

### Total Paid
- Shows: Total amount paid
- **Source**: Latest application amount

## Backend Integration
- **Endpoint**: `/api/applications/my-applications/`
- **Fallback**: Shows "None/Inactive" if no data
- **Real-time**: Updates from backend when available

## Testing
1. **Login** using test login button
2. **View Dashboard** - see membership info
3. **Click User Avatar** in header
4. **Click Logout** - should clear session and redirect

## Backend Status
- ✅ Applications endpoint working
- ✅ Membership data loading
- ✅ Logout clearing all data
- ✅ Dashboard showing real shares/status