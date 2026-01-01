/*
    Copyright (c) DeltaFramework
    Author: Thiruvarasamurthy G, IT Architect and Core Developer
    https://www.thirufactory.com
*/

// Configuration - Can be overridden by setting window.consentConfig
const CONFIG = {
    // Cookie settings
    COOKIE_NAME: 'analytics_consent',
    EXPIRY_DAYS: 365,

    // Banner settings
    PRIVACY_POLICY_URL: 'https://www.thirufactory.com/p/disclaimer-terms-conditions-copyright.html',
    BANNER_DELAY_MS: 1000,

    // Google Analytics settings (if using multiple tracking IDs)
    ANALYTICS_IDS: [], // Add additional GA IDs if needed

    // Consent categories (extendable for more granular control)
    CONSENT_CATEGORIES: {
        ANALYTICS: 'analytics_storage',
        ADS: 'ad_storage',
        PERSONALIZATION: 'personalization_storage'
    }
};

// Merge with global config if provided
if (window.consentConfig) {
    Object.assign(CONFIG, window.consentConfig);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Create and inject the consent banner
    createConsentBanner();

    // Initialize consent management
    initializeConsent();

    // Add reset link to page if not already present
    addResetLink();
});

// ========== CORE FUNCTIONS ==========

function createConsentBanner() {
    // Check if banner already exists
    if (document.getElementById('consent-banner')) {
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.innerHTML = `
        <div class="consent-content">
            <div class="consent-text">
                This website uses Google Analytics to understand how visitors interact with our site. 
                By accepting, you allow us to collect anonymous analytics data to improve our experience.
                <a href="${CONFIG.PRIVACY_POLICY_URL}" class="consent-link" target="_blank">Learn more in our Privacy Policy</a>
            </div>
            <div class="consent-buttons">
                <button id="consent-accept" class="consent-btn accept">Accept Analytics</button>
                <button id="consent-reject" class="consent-btn reject">Reject</button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);
}

function initializeConsent() {
    // Check for existing consent
    const savedConsent = getCookie(CONFIG.COOKIE_NAME);

    if (savedConsent === null) {
        // No consent yet, show banner after delay
        setTimeout(() => {
            const banner = document.getElementById('consent-banner');
            if (banner) {
                banner.style.display = 'block';
                banner.classList.add('show');
            }
        }, CONFIG.BANNER_DELAY_MS);
    } else if (savedConsent === 'granted') {
        // User previously accepted - update consent immediately
        updateConsentMode('granted');
    }
    // If savedConsent is 'denied', do nothing (already denied by default)

    // Event Listeners for consent buttons
    const acceptBtn = document.getElementById('consent-accept');
    const rejectBtn = document.getElementById('consent-reject');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            grantConsent();
            hideBanner();
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', function () {
            denyConsent();
            hideBanner();
        });
    }
}

function addResetLink() {
    // Check if reset link already exists (either manually added or auto-added)
    let resetLink = document.getElementById('reset-consent-link');
    
    if (!resetLink) {
        // Look for common footer locations
        const footerSelectors = ['footer', '.footer', '#footer', 'footer .footer-content'];
        let footer = null;

        for (const selector of footerSelectors) {
            footer = document.querySelector(selector);
            if (footer) break;
        }

        if (footer) {
            resetLink = document.createElement('span');
            resetLink.id = 'reset-consent-link';
            resetLink.className = 'reset-consent';
            resetLink.textContent = 'Change Cookie Preferences';
            resetLink.style.cursor = 'pointer';

            // Try to find a good place to insert it
            const copyright = footer.querySelector('.footer-copyright') ||
                footer.querySelector('p') ||
                footer;

            if (copyright) {
                copyright.appendChild(resetLink);
            }
        }
    }
    
    // Add click handler to existing or newly created link
    if (resetLink) {
        // Remove any existing click event to avoid duplicates
        const newResetLink = resetLink.cloneNode(true);
        resetLink.parentNode.replaceChild(newResetLink, resetLink);
        
        newResetLink.addEventListener('click', function (e) {
            e.preventDefault();
            resetConsent();
        });
    }
}

// ========== CONSENT MANAGEMENT ==========

function grantConsent() {
    updateConsentMode('granted');
    setCookie(CONFIG.COOKIE_NAME, 'granted', CONFIG.EXPIRY_DAYS);

    // Send event to analytics
    try {
        gtag('event', 'consent_granted', {
            'event_category': 'consent',
            'event_label': 'analytics',
            'non_interaction': false
        });
    } catch (e) {
        console.log('Analytics event sent (consent granted)');
    }

    // Show feedback to user
    showConsentFeedback('✅ Analytics cookies enabled');
}

function denyConsent() {
    updateConsentMode('denied');
    setCookie(CONFIG.COOKIE_NAME, 'denied', CONFIG.EXPIRY_DAYS);

    // Log locally since analytics are disabled
    console.log('Analytics consent denied');

    // Show feedback to user
    showConsentFeedback('❌ Analytics cookies disabled');
}

function updateConsentMode(status) {
    const granted = status === 'granted';

    // Update Google Consent Mode
    try {
        gtag('consent', 'update', {
            'analytics_storage': granted ? 'granted' : 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });

        // Update additional GA IDs if configured
        if (CONFIG.ANALYTICS_IDS.length > 0) {
            CONFIG.ANALYTICS_IDS.forEach(id => {
                gtag('config', id, {
                    'analytics_storage': granted ? 'granted' : 'denied'
                });
            });
        }
    } catch (error) {
        console.warn('Could not update Google Consent Mode:', error);
    }
}

function resetConsent() {
    // Delete the cookie
    setCookie(CONFIG.COOKIE_NAME, '', -1);

    // Reset consent mode to default (denied)
    try {
        gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });
    } catch (error) {
        console.warn('Could not reset Google Consent Mode:', error);
    }

    // Show banner again
    const banner = document.getElementById('consent-banner');
    if (banner) {
        banner.style.display = 'block';
        banner.classList.add('show');
    }

    // Notify user
    alert('Cookie preferences have been reset. Please make a new choice.');

    // Scroll to banner if it's not visible
    if (banner) {
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function hideBanner() {
    const banner = document.getElementById('consent-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }
}

// ========== HELPER FUNCTIONS ==========

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    const sameSite = ';SameSite=Lax';
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/" + secure + sameSite;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

function showConsentFeedback(message) {
    // Try to use existing toast if available
    const existingToast = document.getElementById('toast');
    if (existingToast && typeof showToast === 'function') {
        showToast(message, 'success');
        return;
    }

    // Create simple feedback message
    const feedback = document.createElement('div');
    feedback.className = 'consent-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        z-index: 10001;
        animation: fadeOut 2s forwards;
        animation-delay: 1s;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(feedback);
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

// ========== EXPORT FUNCTIONS FOR EXTERNAL USE ==========

// Make functions available globally for manual control
window.ConsentManager = {
    grantConsent: grantConsent,
    denyConsent: denyConsent,
    resetConsent: resetConsent,
    getConsentStatus: function () {
        return getCookie(CONFIG.COOKIE_NAME) || 'not_set';
    },
    showBanner: function () {
        const banner = document.getElementById('consent-banner');
        if (banner) {
            banner.style.display = 'block';
            banner.classList.add('show');
        }
    },
    hideBanner: hideBanner,
    isConsentGiven: function () {
        return getCookie(CONFIG.COOKIE_NAME) === 'granted';
    }
};

// Log initialization
console.log('Consent Manager initialized with config:', CONFIG);