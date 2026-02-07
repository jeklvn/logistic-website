// auth.js - Handle authentication forms

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    setupScrollAnimations();
});

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('formMessage');

    // Clear previous errors
    clearErrors();

    // Validate
    let isValid = true;

    if (!name) {
        showError('nameError', 'Full name is required');
        isValid = false;
    }

    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!AuthManager.validateEmail(email)) {
        showError('emailError', 'Invalid email format');
        isValid = false;
    }

    if (!phone) {
        showError('phoneError', 'Phone number is required');
        isValid = false;
    } else if (!AuthManager.validatePhone(phone)) {
        showError('phoneError', 'Invalid phone number');
        isValid = false;
    }

    if (!password) {
        showError('passwordError', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmError', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) return;

    // Attempt registration
    const result = AuthManager.register({ name, email, phone, password });

    if (result.success) {
        messageDiv.textContent = result.message;
        messageDiv.className = 'form-message success';
        document.getElementById('registerForm').reset();
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        messageDiv.textContent = result.message;
        messageDiv.className = 'form-message error';
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('formMessage');

    // Clear previous errors
    clearErrors();

    // Validate
    if (!email) {
        showError('emailError', 'Email is required');
        return;
    }

    if (!password) {
        showError('passwordError', 'Password is required');
        return;
    }

    // Attempt login
    const result = AuthManager.login(email, password);

    if (result.success) {
        messageDiv.textContent = result.message;
        messageDiv.className = 'form-message success';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        messageDiv.textContent = result.message;
        messageDiv.className = 'form-message error';
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}

function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(err => err.textContent = '');
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// Check if already logged in
if (AuthManager.isLoggedIn()) {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'login.html' || currentPage === 'register.html') {
        window.location.href = 'dashboard.html';
    }
}
