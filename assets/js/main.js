/*
    Copyright (c) DeltaFramework
    Author: Thiruvarasamurthy G, IT Architect and Core Developer
    https://www.thirufactory.com
*/
// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const currentYearSpan = document.getElementById('currentYear');

// Initialize function
function init() {
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();

    // Initialize theme
    initTheme();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Initialize Swiper sliders
    initSwiper();

    // Initialize animations
    initAnimations();

    // Initialize share functionality
    initShare();

    // Initialize header scroll effect
    initHeaderScroll();
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Add transition class for smooth theme change
        document.body.classList.add('theme-changing');
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
}

// Mobile Menu
function initMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        mobileMenuBtn.querySelector('i').className = isExpanded ? 'fas fa-times' : 'fas fa-bars';

        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20; // Added 20px buffer

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);

                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Swiper Sliders
function initSwiper() {
    // Gallery Swiper - Only show one card at a time
    const gallerySwiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.gallery-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.gallery-next',
            prevEl: '.gallery-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 1,
            }
        }
    });

    // News Swiper
    const newsSwiper = new Swiper('.news-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.news-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.news-next',
            prevEl: '.news-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1.5,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Animate numbers in performance section
                if (entry.target.classList.contains('metric-value') ||
                    entry.target.classList.contains('test-value')) {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.highlight-card, .feature-card, .ai-card, .gallery-item, .news-card').forEach(card => {
        observer.observe(card);
    });

    // Observe performance metrics
    document.querySelectorAll('.metric-value, .test-value').forEach(element => {
        observer.observe(element);
    });
}

// Counter Animation
function animateCounter(element) {
    const text = element.textContent;
    const numbers = text.match(/[\d,.]+/g);

    if (numbers) {
        const finalNumber = parseFloat(numbers[0].replace(/,/g, ''));
        if (!isNaN(finalNumber) && finalNumber > 1000) {
            element.textContent = '0';

            let current = 0;
            const increment = finalNumber / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    element.textContent = formatNumber(finalNumber);
                    clearInterval(timer);
                } else {
                    element.textContent = formatNumber(Math.floor(current));
                }
            }, 30);
        }
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Share Functionality
function initShare() {
    const copyBtn = document.querySelector('.share-btn.copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
    }
}

// Fixed: Added copyToClipboard function with proper reference to copyBtn
function copyToClipboard() {
    const text = "DeltaFramework: A cutting-edge, modern and robust software creation bundle. It offers advanced Architecture Styles, Frameworks, Libraries and Project Templates will accelerate the projects. Author: Thiruvarasamurthy G. Website: https://www.deltaframework.net";

    navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard!', 'success');

        // Visual feedback
        const copyBtn = document.querySelector('.share-btn.copy');
        const originalHTML = copyBtn.innerHTML;

        copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        copyBtn.style.color = 'white';
        copyBtn.style.borderColor = '#10b981';

        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showNotification('Failed to copy link', 'error');
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;

    // Set background color based on type
    const bgColor = type === 'success' ? 'rgba(16, 185, 129, 0.95)' :
        type === 'error' ? 'rgba(239, 68, 68, 0.95)' :
            'rgba(59, 130, 246, 0.95)';
    notification.style.backgroundColor = bgColor;
    notification.style.border = '1px solid rgba(255, 255, 255, 0.1)';

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        margin-left: auto;
    `;

    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%) translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0) translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%) translateY(-20px);
                    opacity: 0;
                }
            }
            
            .theme-changing * {
                transition: none !important;
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);
}

// Header Scroll Effect
function initHeaderScroll() {
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 50) {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.boxShadow = 'var(--shadow-lg)';
            header.style.backdropFilter = 'blur(30px)';

            // Hide header on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }

        lastScroll = currentScroll;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resizing');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resizing');
    }, 250);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .highlight-card,
    .feature-card,
    .ai-card,
    .gallery-item,
    .news-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .highlight-card.animate-in,
    .feature-card.animate-in,
    .ai-card.animate-in,
    .gallery-item.animate-in,
    .news-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .metric-value,
    .test-value {
        transition: color 0.3s ease;
    }
    
    .resizing * {
        transition: none !important;
        animation: none !important;
    }
`;
document.head.appendChild(style);