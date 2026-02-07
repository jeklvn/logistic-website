// nav.js - Modern mobile menu for all pages

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    let scrollPosition = 0;
    
    hamburger.addEventListener('click', function () {
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            body.style.position = '';
            body.style.width = '';
            body.style.overflow = '';
            window.scrollTo(0, scrollPosition);
        } else {
            scrollPosition = window.scrollY;
            mobileMenu.classList.add('open');
            body.style.position = 'fixed';
            body.style.width = '100%';
            body.style.top = -scrollPosition + 'px';
            body.style.overflow = 'hidden';
        }
    });
    
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('open');
            body.style.position = '';
            body.style.width = '';
            body.style.top = '';
            body.style.overflow = '';
            window.scrollTo(0, scrollPosition);
        }
    });
    
    // Close menu on navigation
    document.querySelectorAll('.mobile-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('open');
            body.style.position = '';
            body.style.width = '';
            body.style.top = '';
            body.style.overflow = '';
            window.scrollTo(0, scrollPosition);
        });
    });
});
