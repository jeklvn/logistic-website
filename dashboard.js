// dashboard.js - Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    const session = AuthManager.getSession();
    
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // Set user name
    document.getElementById('userName').textContent = session.name;
    document.getElementById('welcomeName').textContent = session.name.split(' ')[0];

    // Initialize scroll animations
    setupScrollAnimations();

    // Load dashboard data
    loadDashboard(session.userId);

    // Setup logout
    setupLogout();
});

function loadDashboard(userId) {
    const user = AuthManager.getUserById(userId);
    if (!user) return;

    // Load bookings
    loadBookings(user.bookings);

    // Load quotes
    loadQuotes(user.quotes);

    // Load notifications
    loadNotifications(user.notifications);

    // Update stats
    updateStats(user);
}

function loadBookings(bookings) {
    const container = document.getElementById('bookingsContainer');

    if (!bookings || bookings.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                <i class="fas fa-inbox"></i>
                No bookings yet. Create your first booking to get started.
            </p>
        `;
        return;
    }

    let tableHTML = `
        <table class="bookings-table">
            <thead>
                <tr>
                    <th>Tracking ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
    `;

    bookings.forEach(booking => {
        const date = new Date(booking.createdAt).toLocaleDateString();
        const statusClass = `status-${booking.status}`;
        const statusText = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

        tableHTML += `
            <tr>
                <td><span class="tracking-id">${booking.trackingId}</span></td>
                <td>${booking.pickupLocation || '-'}</td>
                <td>${booking.deliveryLocation || '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${date}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

function loadQuotes(quotes) {
    const container = document.getElementById('quotesContainer');

    if (!quotes || quotes.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                <i class="fas fa-lightbulb"></i>
                No quotes yet. Request one to see pricing.
            </p>
        `;
        return;
    }

    let cardsHTML = '';

    quotes.forEach(quote => {
        const date = new Date(quote.createdAt).toLocaleDateString();
        const statusClass = `status-${quote.status}`;
        const statusText = quote.status.charAt(0).toUpperCase() + quote.status.slice(1);
        const priceHTML = quote.estimatedPrice 
            ? `<div class="quote-price">₦${quote.estimatedPrice.toLocaleString()}</div>`
            : '';

        cardsHTML += `
            <div class="quote-card animate-on-scroll">
                <div class="quote-header">
                    <div>
                        <div class="quote-id">${quote.id}</div>
                        <span class="status-badge ${statusClass}" style="margin-top:8px;">${statusText}</span>
                    </div>
                    <div class="quote-date">${date}</div>
                </div>
                <div class="quote-details">
                    <div class="quote-detail">
                        <span class="quote-detail-label">From:</span>
                        <span class="quote-detail-value">${quote.pickupLocation || '-'}</span>
                    </div>
                    <div class="quote-detail">
                        <span class="quote-detail-label">To:</span>
                        <span class="quote-detail-value">${quote.deliveryLocation || '-'}</span>
                    </div>
                    <div class="quote-detail">
                        <span class="quote-detail-label">Items:</span>
                        <span class="quote-detail-value">${quote.itemType || 'N/A'}</span>
                    </div>
                </div>
                ${priceHTML}
            </div>
        `;
    });

    container.innerHTML = cardsHTML;
}

function loadNotifications(notifications) {
    const container = document.getElementById('notificationsContainer');
    const clearBtn = document.getElementById('clearNotifs');

    if (!notifications || notifications.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                <i class="fas fa-check"></i>
                All caught up! No new notifications.
            </p>
        `;
        clearBtn.style.display = 'none';
        return;
    }

    clearBtn.style.display = 'inline-block';

    let notifHTML = '';

    notifications.forEach(notif => {
        const time = formatTimeAgo(new Date(notif.createdAt));
        const unreadClass = notif.read ? '' : 'unread';

        let icon = 'fas fa-info-circle';
        if (notif.type === 'delivered') icon = 'fas fa-check-circle';
        if (notif.type === 'in-transit') icon = 'fas fa-truck';
        if (notif.type === 'quote') icon = 'fas fa-quote-left';

        notifHTML += `
            <div class="notification-item ${unreadClass}" onclick="markAsRead('${notif.id}')">
                <div class="notification-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-title">${notif.title}</p>
                    <p class="notification-message">${notif.message}</p>
                    <p class="notification-time">${time}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = notifHTML;
}

function updateStats(user) {
    const bookings = user.bookings || [];
    const quotes = user.quotes || [];
    const notifications = user.notifications || [];

    const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'in-transit').length;
    const deliveredBookings = bookings.filter(b => b.status === 'delivered').length;
    const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
    const unreadNotifs = notifications.filter(n => !n.read).length;

    document.getElementById('activeCount').textContent = activeBookings;
    document.getElementById('deliveredCount').textContent = deliveredBookings;
    document.getElementById('quotesCount').textContent = pendingQuotes;
    document.getElementById('notifCount').textContent = unreadNotifs;
}

function markAsRead(notificationId) {
    const session = AuthManager.getSession();
    AuthManager.readNotification(session.userId, notificationId);
    loadDashboard(session.userId);
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutMobileBtn = document.getElementById('logoutMobileBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthManager.logout();
        });
    }

    if (logoutMobileBtn) {
        logoutMobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthManager.logout();
        });
    }
}

function setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
