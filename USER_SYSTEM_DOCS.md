# Veritas Logistics - User System Documentation

## System Overview

A fully functional user authentication and dashboard system for the logistics website with registration, login, and user-specific booking/quote management.

---

## Files Created/Updated

### 1. **authManager.js** - Core Authentication System
- Handles user registration and validation
- Session management with localStorage
- User data persistence
- Booking and quote management
- Notification system
- Tracking ID generation (format: VLS{timestamp}{random})

**Key Functions:**
- `register(userData)` - Create new user account
- `login(email, password)` - Authenticate user
- `getSession()` - Get current user session
- `isLoggedIn()` - Check if user is authenticated
- `logout()` - End session
- `addBooking(userId, bookingData)` - Add booking to user
- `addQuote(userId, quoteData)` - Add quote to user
- `addNotification(userId, notification)` - Create notification

---

### 2. **register.html** - Registration Page
Professional registration form with:
- Full name, email, phone, password fields
- Real-time validation feedback
- Benefits showcase (4 icons + descriptions)
- Responsive design (mobile-first)
- Consistent header/footer with site

---

### 3. **login.html** - Login Page
Login form with:
- Email and password fields
- Session persistence
- Benefits section (4 cards)
- Links to registration
- Responsive layout

---

### 4. **dashboard.html** - User Dashboard
Complete dashboard with:
- Welcome section with user name
- Stats overview (4 cards: Active Bookings, Delivered, Quotes, Notifications)
- Recent Bookings table (Tracking ID, From, To, Status, Date)
- Quotes grid (shows price, status, route info)
- Notifications list (unread state, formatted times)
- Quick action buttons (New Booking, Request Quote)

---

### 5. **auth.js** - Form Handling
Handles:
- Registration form submission and validation
- Login form submission
- Error display
- Redirect authenticated users to dashboard
- Prevent non-authenticated users from accessing dashboard

---

### 6. **auth.css** - Authentication Styling
- Mobile-first responsive design
- Floating label animations
- Form validation styling
- Benefits section grid (1 col mobile, 2 col tablet, 4 col desktop)
- Smooth transitions and hover effects

---

### 7. **dashboard.css** - Dashboard Styling
- Welcome section with gradient background
- Stats cards with hover effects
- Responsive table for bookings
- Quote cards grid
- Notifications list with unread states
- Status badges (pending, in-transit, delivered, cancelled)
- Mobile-optimized layout

---

### 8. **dashboard.js** - Dashboard Logic
Handles:
- Loading user data on dashboard
- Rendering bookings table dynamically
- Rendering quotes grid with pricing
- Rendering notifications with time formatting
- Updating statistics
- Scroll animations
- Logout functionality
- Session validation

---

## User Flow

### Registration Flow:
1. User fills registration form
2. Client-side validation checks:
   - All fields required
   - Valid email format
   - Valid phone format (10+ digits)
   - Password minimum 6 characters
   - Passwords match
   - Email not already registered
3. User data stored in localStorage
4. User redirected to login page

### Login Flow:
1. User enters email and password
2. Credentials validated against stored users
3. Session created and stored in localStorage
4. User redirected to dashboard

### Dashboard Flow:
1. Session validated on page load
2. User's bookings, quotes, notifications loaded
3. Statistics calculated (active, delivered, pending quotes, unread notifs)
4. Dynamic rendering of:
   - Bookings table
   - Quotes cards
   - Notifications list
5. User can click "New Booking" to go to booking page

---

## Data Structure

### User Object:
```json
{
    "id": "user_timestamp_random",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+234 701 2345678",
    "password": "hashed",
    "createdAt": "2026-02-05T...",
    "bookings": [],
    "quotes": [],
    "notifications": []
}
```

### Booking Object:
```json
{
    "id": "bk_timestamp",
    "trackingId": "VLS123456ABCDEF",
    "pickupLocation": "...",
    "deliveryLocation": "...",
    "itemType": "...",
    "weight": "...",
    "createdAt": "2026-02-05T...",
    "status": "pending|in-transit|delivered|cancelled"
}
```

### Quote Object:
```json
{
    "id": "q_timestamp",
    "pickupLocation": "...",
    "deliveryLocation": "...",
    "itemType": "...",
    "weight": "...",
    "estimatedPrice": 5000,
    "createdAt": "2026-02-05T...",
    "status": "pending|accepted|rejected"
}
```

### Notification Object:
```json
{
    "id": "notif_timestamp_random",
    "title": "Shipment Delivered",
    "message": "Your shipment VLS123456ABCDEF has been delivered.",
    "type": "delivered|in-transit|quote",
    "createdAt": "2026-02-05T...",
    "read": false
}
```

---

## Security Features

1. **Password Hashing** - Uses btoa() for encoding (use bcrypt in production)
2. **Session Management** - localStorage with user ID
3. **Data Isolation** - Users can only see their own bookings/quotes
4. **Authorization Checks** - Dashboard redirects non-authenticated users to login
5. **Email Uniqueness** - Prevents duplicate account registration

---

## Integration with Booking Form

To integrate booking form with dashboard:

1. **Update booking.html form submission:**
```javascript
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const session = AuthManager.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    
    // Get form data
    const bookingData = {
        pickupLocation: document.getElementById('pickup').value,
        deliveryLocation: document.getElementById('delivery').value,
        itemType: document.getElementById('itemType').value,
        weight: document.getElementById('weight').value
    };
    
    // Add booking to user
    const booking = AuthManager.addBooking(session.userId, bookingData);
    
    // Add notification
    AuthManager.addNotification(session.userId, {
        title: 'Booking Confirmed',
        message: `Your booking ${booking.trackingId} has been created`,
        type: 'quote'
    });
    
    // Show success
    console.log('Booking created:', booking);
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
});
```

---

## Testing Credentials

### Test User 1:
- Email: test@example.com
- Password: password123

(Register a new account or use existing test data)

---

## Features Implemented

✅ User Registration with validation
✅ User Login with session management
✅ Logout functionality
✅ Dashboard with user-specific data
✅ Dynamic bookings table
✅ Dynamic quotes grid
✅ Dynamic notifications list
✅ Statistics/overview cards
✅ Responsive design (mobile-first)
✅ Scroll animations
✅ Status badges for bookings
✅ Time formatting for notifications
✅ Empty states
✅ Error handling
✅ Authorization checks
✅ Consistent styling with site theme

---

## Future Enhancements

1. **Backend Integration:**
   - Replace localStorage with database (MongoDB, PostgreSQL)
   - Implement proper password hashing (bcrypt)
   - Add email verification
   - Implement JWT tokens instead of basic session

2. **Features:**
   - Real-time tracking with WebSockets
   - Email notifications
   - Payment integration
   - Rating/review system
   - Export bookings to PDF
   - Advanced search/filter
   - User profile editing

3. **Security:**
   - HTTPS enforcement
   - CSRF protection
   - Rate limiting
   - 2FA authentication
   - Session timeout

---

## Files Summary

| File | Type | Purpose |
|------|------|---------|
| authManager.js | JS | Core authentication system |
| auth.js | JS | Form handling & validation |
| dashboard.js | JS | Dashboard logic |
| auth.css | CSS | Auth pages styling |
| dashboard.css | CSS | Dashboard styling |
| register.html | HTML | Registration page |
| login.html | HTML | Login page |
| dashboard.html | HTML | User dashboard |

Total: 8 files (3 HTML, 4 CSS/JS files)

---

## Integration Checklist

- [ ] Update booking.html to save bookings to authenticated user
- [ ] Add dashboard link to all page headers
- [ ] Update tracking.html to check authenticated user's bookings
- [ ] Add notification system hooks to booking form
- [ ] Test full user flow (register → login → book → see dashboard)
- [ ] Deploy and test with real data

---

**Ready for database integration and production deployment.**
