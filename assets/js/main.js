/*
    (c) thirufactory.com. All rights reserved.
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

    // Initialize header scroll effect
    initBackToTop();

    // Initialize multiple hot announcements (UPDATED)
    initMultipleHotAnnouncements();

    // Initialize header spacing
    initHeaderSpacing();

    // Add reset button (optional)
    //addResetAnnouncementButton();

    window.addEventListener('load', updateHeaderSpacing);
    window.addEventListener('resize', updateHeaderSpacing);

    //Force immediate recalculation when tab becomes visible using requestAnimationFrame (which resumes quickly)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            requestAnimationFrame(() => {
                updateHeaderSpacing();
                window.dispatchEvent(new Event('scroll'));
            });
        }
    });
}

// Theme Management - UPDATED with DOM ready check
function initTheme() {
    // Get current theme from HTML attribute (already set in <head>)
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcon(currentTheme);

    // Wait for DOM to be ready before attaching event listener
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupThemeToggle();
        });
    } else {
        setupThemeToggle();
    }
}

// Separate function to set up the toggle button
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle'); // Make sure button has this ID

    if (!themeToggle) {
        console.error('Theme toggle button not found!');
        return;
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
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
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Mobile Menu - UPDATED
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
    // Gallery Swiper
    const gallerySwiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // Add this for better UX
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
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 1 }
        },
        on: {
            init: function () {
                // Store swiper instance globally
                this.el.swiper = this;
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
            pauseOnMouseEnter: true, // Add this for better UX
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
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        },
        on: {
            init: function () {
                // Store swiper instance globally
                this.el.swiper = this;
            }
        }
    });

    // Store instances globally for play/pause controls
    window.gallerySwiper = gallerySwiper;
    window.newsSwiper = newsSwiper;

    // Initialize play/pause controls after swipers are created
    initSliderControls();
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
            }, 40);
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

// Header Scroll Effect - FIXED for mobile with hide/show
function initHeaderScroll() {
    let lastScroll = 0;
    const header = document.querySelector('header');
    const warning = document.getElementById('siteWarning'); // Get the warning div

    function getWarningHeight() {
        return warning ? warning.offsetHeight : 0;
    }

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        const isMobile = window.innerWidth <= 768;
        const warningHeight = getWarningHeight();

        // Always use fixed positioning
        header.style.position = 'fixed';
        header.style.top = warningHeight + 'px'; // Set top to warning height

        if (currentScroll <= 50) {
            // At the top - show header
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.opacity = '1';
        } else {
            header.style.boxShadow = 'var(--shadow-lg)';

            // Hide on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
                header.style.opacity = '0';
            } else if (currentScroll < lastScroll) {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
                header.style.opacity = '1';
            }
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', function () {
        // Recalculate warning height on resize
        header.style.top = getWarningHeight() + 'px';
        lastScroll = window.pageYOffset;
        handleScroll();
    });

    handleScroll(); // initial call
}

// Back to Top
function initBackToTop() {
    const backToTop = document.getElementById("backToTop");
    const header = document.querySelector('header');

    // Show button after scrolling 200px
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    // Smooth scroll to top when clicked
    backToTop.addEventListener("click", () => {
        const isMobile = window.innerWidth <= 768;

        // On desktop, reset header to visible state
        if (!isMobile) {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.transition = 'transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease';
        }

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        // Remove the forced transition after scroll completes
        setTimeout(() => {
            if (!isMobile) {
                header.style.transition = '';
            }
        }, 500);
    });
}
function initHeaderSpacing() {
    const header = document.querySelector('header');
    const announcement = document.querySelector('.hot-announcement-wrapper');
    const body = document.body;

    function adjustSpacing() {
        if (window.innerWidth > 768) {
            // Desktop: Use body padding to push content below fixed header
            const headerHeight = header ? header.offsetHeight : 80;
            body.style.paddingTop = headerHeight + 'px';

            if (announcement && announcement.style.display !== 'none') {
                body.classList.add('has-announcement');
            } else {
                body.classList.remove('has-announcement');
            }
        } else {
            // Mobile: Remove body padding, header is relative
            body.style.paddingTop = '0';
            body.classList.remove('has-announcement');
        }
    }

    // Adjust on load
    adjustSpacing();

    // Adjust on resize
    window.addEventListener('resize', adjustSpacing);

    // Adjust when announcement is closed
    if (announcement) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'style') {
                    adjustSpacing();
                }
            });
        });

        observer.observe(announcement, { attributes: true });
    }
}

// Initialize Play/Pause controls for sliders
function initSliderControls() {
    // Gallery slider controls
    const galleryPlayPause = document.getElementById('galleryPlayPause');
    const newsPlayPause = document.getElementById('newsPlayPause');

    // Get swiper instances (store them when initializing)
    let gallerySwiper = null;
    let newsSwiper = null;

    // Find swiper instances from your existing code
    document.querySelectorAll('.gallery-swiper').forEach(el => {
        if (el.swiper) gallerySwiper = el.swiper;
    });

    document.querySelectorAll('.news-swiper').forEach(el => {
        if (el.swiper) newsSwiper = el.swiper;
    });

    // Gallery play/pause
    if (galleryPlayPause && gallerySwiper) {
        let isGalleryPlaying = true;

        galleryPlayPause.addEventListener('click', function () {
            if (isGalleryPlaying) {
                // Pause autoplay
                gallerySwiper.autoplay.stop();
                this.classList.add('paused');
                this.innerHTML = '<i class="fas fa-play"></i>';
                this.setAttribute('data-tooltip', 'Play autoplay');
                this.setAttribute('aria-label', 'Play autoplay');
                isGalleryPlaying = false;
            } else {
                // Resume autoplay
                gallerySwiper.autoplay.start();
                this.classList.remove('paused');
                this.innerHTML = '<i class="fas fa-pause"></i>';
                this.setAttribute('data-tooltip', 'Pause autoplay');
                this.setAttribute('aria-label', 'Pause autoplay');
                isGalleryPlaying = true;
            }
        });

        // Store state in swiper instance for access elsewhere
        gallerySwiper.playPauseState = { isPlaying: true, button: galleryPlayPause };
    }

    // News play/pause
    if (newsPlayPause && newsSwiper) {
        let isNewsPlaying = true;

        newsPlayPause.addEventListener('click', function () {
            if (isNewsPlaying) {
                // Pause autoplay
                newsSwiper.autoplay.stop();
                this.classList.add('paused');
                this.innerHTML = '<i class="fas fa-play"></i>';
                this.setAttribute('data-tooltip', 'Play autoplay');
                this.setAttribute('aria-label', 'Play autoplay');
                isNewsPlaying = false;
            } else {
                // Resume autoplay
                newsSwiper.autoplay.start();
                this.classList.remove('paused');
                this.innerHTML = '<i class="fas fa-pause"></i>';
                this.setAttribute('data-tooltip', 'Pause autoplay');
                this.setAttribute('aria-label', 'Pause autoplay');
                isNewsPlaying = true;
            }
        });

        // Store state in swiper instance
        newsSwiper.playPauseState = { isPlaying: true, button: newsPlayPause };
    }
}


// Initialize Multiple Hot Announcements
function initMultipleHotAnnouncements() {
    const announcementWrappers = document.querySelectorAll('.hot-announcement-wrapper');

    announcementWrappers.forEach(wrapper => {
        const closeBtn = wrapper.querySelector('.announcement-close');
        const announcementId = wrapper.dataset.announcementId;

        // Check if this specific announcement was closed
        const isClosed = localStorage.getItem(`hotAnnouncement_${announcementId}_closed`);

        if (isClosed) {
            wrapper.classList.add('hidden');
        }

        // Close button functionality for each announcement
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                const announcementId = wrapper.dataset.announcementId;
                const version = wrapper.dataset.version;
                //wrapper.style.animation = 'slideUp 0.3s ease forwards';

                // Store in localStorage that this specific announcement was closed
                localStorage.setItem(`hotAnnouncement_${announcementId}_closed`, version);

                setTimeout(() => {
                    wrapper.classList.add('hidden');
                    wrapper.style.animation = '';
                    updateHeaderSpacing();
                }, 280);
            });
        }
    });

    // Check if there are any visible announcements
    updateHeaderSpacing();
}

// Update header spacing based on visible announcements
function updateHeaderSpacing() {
    const body = document.body;
    const warning = document.getElementById('siteWarning');   // if exists
    const header = document.querySelector('header');
    const hotWrappers = document.querySelectorAll('.hot-announcement-wrapper');
    const hotContainer = document.getElementById('hotAnnouncementsContainer');

    // Hide the whole container if no hot announcements are visible
    const visibleHotCount = Array.from(hotWrappers).filter(w => !w.classList.contains('hidden')).length;
    if (hotContainer) {
        hotContainer.style.display = visibleHotCount > 0 ? 'block' : 'none';
    }

    // Calculate total height of all fixed elements above the page content
    let totalFixedHeight = 0;
    if (warning && warning.style.display !== 'none') {
        totalFixedHeight += warning.offsetHeight;
    }
    if (header) {
        totalFixedHeight += header.offsetHeight;
    }

    // Apply padding – this works for all screen sizes
    body.style.paddingTop = totalFixedHeight + 'px';

    // Optional: keep body classes for any extra styling
    body.classList.toggle('has-site-announcement', warning && warning.style.display !== 'none');
    body.classList.toggle('has-hot-announcements', visibleHotCount > 0);
}

// Reset all announcements (admin function - can be called from console)
function resetAllAnnouncements() {
    // Clear all announcement-related localStorage items
    Object.keys(localStorage).forEach(key => {
        if (key.includes('Announcement') || key.includes('hotAnnouncement_')) {
            localStorage.removeItem(key);
        }
    });

    // Show all announcements
    const siteAnnouncement = document.getElementById('siteAnnouncementBar');
    if (siteAnnouncement) {
        siteAnnouncement.style.display = '';
        siteAnnouncement.style.animation = '';
    }

    document.querySelectorAll('.hot-announcement-wrapper').forEach(wrapper => {
        wrapper.classList.remove('hidden');
        wrapper.style.animation = '';
    });

    updateHeaderSpacing();
    location.reload(); // Reload to reset all states
}

// Add reset button to footer (optional)
function addResetAnnouncementButton() {
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        const resetBtn = document.createElement('span');
        resetBtn.id = 'reset-announcements';
        resetBtn.className = 'copyright-link';
        resetBtn.style.marginLeft = '15px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.innerHTML = '🔔 Reset Announcements';
        resetBtn.onclick = resetAllAnnouncements;
        copyright.appendChild(resetBtn);
    }
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