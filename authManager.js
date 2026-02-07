// authManager.js - User authentication and session management

const AuthManager = {
    // Initialize auth system
    init() {
        this.checkSession();
    },

    // Register new user
    register(userData) {
        const { name, email, phone, password } = userData;
        
        // Validate input
        if (!name || !email || !phone || !password) {
            return { success: false, message: 'All fields are required' };
        }

        if (!this.validateEmail(email)) {
            return { success: false, message: 'Invalid email format' };
        }

        if (!this.validatePhone(phone)) {
            return { success: false, message: 'Invalid phone number format' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('veritas_users') || '[]');
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create user
        const newUser = {
            id: this.generateUserId(),
            name,
            email,
            phone,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            bookings: [],
            quotes: [],
            notifications: []
        };

        users.push(newUser);
        localStorage.setItem('veritas_users', JSON.stringify(users));

        return { success: true, message: 'Registration successful. Please log in.' };
    },

    // Login user
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Email and password required' };
        }

        const users = JSON.parse(localStorage.getItem('veritas_users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user || !this.verifyPassword(password, user.password)) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Create session
        const session = {
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('veritas_session', JSON.stringify(session));
        return { success: true, message: 'Login successful', user: session };
    },

    // Get current user session
    getSession() {
        const session = localStorage.getItem('veritas_session');
        return session ? JSON.parse(session) : null;
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.getSession() !== null;
    },

    // Logout user
    logout() {
        localStorage.removeItem('veritas_session');
        window.location.href = 'login.html';
    },

    // Check session and redirect if needed
    checkSession() {
        if (!this.isLoggedIn()) {
            const currentPage = window.location.pathname.split('/').pop();
            const publicPages = ['index.html', 'services.html', 'about.html', 'tracking.html', 'contact.html', 'login.html', 'register.html', ''];
            
            if (!publicPages.includes(currentPage)) {
                window.location.href = 'login.html';
            }
        }
    },

    // Get user by ID
    getUserById(userId) {
        const users = JSON.parse(localStorage.getItem('veritas_users') || '[]');
        return users.find(u => u.id === userId);
    },

    // Update user data
    updateUser(userId, updates) {
        const users = JSON.parse(localStorage.getItem('veritas_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('veritas_users', JSON.stringify(users));
        return true;
    },

    // Add booking to user
    addBooking(userId, bookingData) {
        const user = this.getUserById(userId);
        if (!user) return null;

        const booking = {
            id: this.generateBookingId(),
            trackingId: this.generateTrackingId(),
            ...bookingData,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        user.bookings.push(booking);
        this.updateUser(userId, user);
        
        return booking;
    },

    // Get user bookings
    getUserBookings(userId) {
        const user = this.getUserById(userId);
        return user ? user.bookings : [];
    },

    // Add quote to user
    addQuote(userId, quoteData) {
        const user = this.getUserById(userId);
        if (!user) return null;

        const quote = {
            id: this.generateQuoteId(),
            ...quoteData,
            createdAt: new Date().toISOString(),
            status: 'pending',
            estimatedPrice: quoteData.estimatedPrice || null
        };

        user.quotes.push(quote);
        this.updateUser(userId, user);

        return quote;
    },

    // Get user quotes
    getUserQuotes(userId) {
        const user = this.getUserById(userId);
        return user ? user.quotes : [];
    },

    // Add notification
    addNotification(userId, notification) {
        const user = this.getUserById(userId);
        if (!user) return null;

        const notif = {
            id: this.generateNotificationId(),
            ...notification,
            createdAt: new Date().toISOString(),
            read: false
        };

        user.notifications.push(notif);
        this.updateUser(userId, user);

        return notif;
    },

    // Get user notifications
    getUserNotifications(userId) {
        const user = this.getUserById(userId);
        return user ? user.notifications : [];
    },

    // Mark notification as read
    readNotification(userId, notificationId) {
        const user = this.getUserById(userId);
        if (!user) return false;

        const notification = user.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateUser(userId, user);
            return true;
        }
        return false;
    },

    // Helper functions
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhone(phone) {
        return /^[\d\s\-\+()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    hashPassword(password) {
        // Simple hash for demo (use bcrypt in production)
        return btoa(password);
    },

    verifyPassword(password, hash) {
        return btoa(password) === hash;
    },

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    generateBookingId() {
        return 'bk_' + Date.now();
    },

    generateTrackingId() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `VLS${timestamp}${random}`;
    },

    generateQuoteId() {
        return 'q_' + Date.now();
    },

    generateNotificationId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});
