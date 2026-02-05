// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// DOM Elements Cache
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// =====================
// MOBILE MENU FUNCTIONALITY
// =====================
function initializeMobileMenu() {
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            analytics.log('mobile_menu_toggled');
        });
    }

    // Close menu when clicking links
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
}

window.closeMobileMenu = closeMobileMenu;

// =====================
// BACK TO TOP FUNCTIONALITY
// =====================
function initializeBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.pointerEvents = 'auto';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.pointerEvents = 'none';
        }
    });

    backToTop.addEventListener('click', () => {
        analytics.log('back_to_top_clicked');
        gsap.to(window, {
            scrollTo: { y: 0 },
            duration: 1,
            ease: 'power3.inOut'
        });
    });
}

// =====================
// SMOOTH SCROLL NAVIGATION
// =====================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                analytics.log('smooth_scroll', { target: targetId });
                gsap.to(window, {
                    scrollTo: { y: targetSection, offsetY: 80 },
                    duration: 1,
                    ease: 'power3.inOut'
                });
                closeMobileMenu();
            }
        });
    });
}

// =====================
// STATS COUNTER ANIMATION
// =====================
function animateCounter(id, target) {
    let current = 0;
    const increment = target / 50;

    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            document.getElementById(id).textContent = target;
            clearInterval(interval);
        } else {
            document.getElementById(id).textContent = Math.floor(current);
        }
    }, 30);
}

function initializeStatsAnimation() {
    ScrollTrigger.create({
        trigger: '.stats-grid',
        onEnter: () => {
            animateCounter('stat1', 250);
            animateCounter('stat2', 45);
            animateCounter('stat3', 12);
            animateCounter('stat4', 340);
            analytics.log('stats_animated');
        }
    });
}

// =====================
// FORM VALIDATION
// =====================
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        group.classList.remove('error');

        if (!field.value.trim()) {
            group.classList.add('error');
            isValid = false;
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                group.classList.add('error');
                isValid = false;
            }
        }
    });

    return isValid;
}

// =====================
// CONTACT FORM HANDLER
// =====================
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            analytics.log('contact_form_submitted');

            if (!validateForm(this)) {
                showToast('Please fix the errors in the form', 'error');
                analytics.log('contact_form_validation_failed');
                return;
            }

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value || 'Not provided',
                budget: document.getElementById('budget').value,
                message: document.getElementById('message').value
            };

            analytics.log('contact_form_valid_submission', formData);
            showToast(`Thank you, ${formData.name}! We'll be in touch shortly.`);

            // Log in console
            console.log('Contact Form Data:', formData);

            this.reset();

            // Reset error states
            this.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
        });
    }
}

// =====================
// NEWSLETTER FORM HANDLER
// =====================
function initializeNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsEmail').value;

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email', 'error');
                analytics.log('newsletter_invalid_email', { email });
                return;
            }

            analytics.log('newsletter_signup', { email });
            showToast('✓ Subscribed! Check your inbox.');
            this.reset();
        });
    }
}

// =====================
// FADE IN UP ANIMATION
// =====================
function initializeFadeInUpAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach((el, index) => {
        gsap.fromTo(el,
            {
                opacity: 0,
                y: 60
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

// =====================
// SCROLL TRACKING
// =====================
function initializeScrollTracking() {
    window.addEventListener('scroll', () => {
        analytics.trackScroll();
    });
}

// =====================
// PAGE VISIBILITY
// =====================
function initializePageVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            analytics.log('page_hidden');
        } else {
            analytics.log('page_visible');
        }
    });
}

// =====================
// FORM INTERACTION TRACKING
// =====================
function initializeFormTracking() {
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', () => {
            analytics.formInteractions++;
            analytics.log('form_field_focused', { fieldName: field.name || field.id });
        });
    });
}

// =====================
// INITIALIZATION FUNCTION
// =====================
function initializeAll() {
    console.log('[INIT] Starting Rise by Rice initialization...');

    initializeMobileMenu();
    initializeBackToTop();
    initializeSmoothScroll();
    initializeStatsAnimation();
    initializeContactForm();
    initializeNewsletterForm();
    initializeFadeInUpAnimation();
    initializeScrollTracking();
    initializePageVisibility();
    initializeFormTracking();

    // Log page load
    analytics.log('page_loaded', {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
    });

    console.log('[INIT] Rise by Rice - Premium Agency Website Ready');
    console.log('[INIT] GSAP ScrollTrigger & Analytics Active');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

// Print analytics on page unload
window.addEventListener('beforeunload', () => {
    analytics.printSummary();
});
