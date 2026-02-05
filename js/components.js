// =====================
// TOAST NOTIFICATION SYSTEM
// =====================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#D4C5A9' : '#ff6b6b';
    const textColor = type === 'success' ? '#0F0F0F' : '#fff';

    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${bgColor};
        color: ${textColor};
        border-radius: 4px;
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    analytics.log('toast_displayed', { type, message });

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Make showToast global
window.showToast = showToast;

// =====================
// TESTIMONIALS CAROUSEL
// =====================

let currentSlide = 0;
let carouselInterval = null;

function initializeCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    if (slides.length === 0) return;

    function showSlide(n) {
        // Wrap around
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }

        analytics.log('carousel_slide_shown', { slide: currentSlide });
    }

    // Make goToSlide global
    window.goToSlide = function(n) {
        currentSlide = n;
        clearInterval(carouselInterval);
        showSlide(currentSlide);
        startAutoCarousel();
    };

    function startAutoCarousel() {
        carouselInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 8000);
    }

    // Initialize
    showSlide(0);
    startAutoCarousel();
}

// =====================
// FAQ ACCORDION SYSTEM
// =====================

function initializeAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight;

            // Close all other accordion items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-question').style.borderBottomColor = 'rgba(212, 197, 169, 0.1)';
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                }
            });

            // Toggle current item
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.style.borderBottomColor = 'var(--champagne)';
                if (toggle) toggle.textContent = '−';
                analytics.log('faq_opened', { question: question.textContent.trim() });
            } else {
                answer.style.maxHeight = null;
                question.style.borderBottomColor = 'rgba(212, 197, 169, 0.1)';
                if (toggle) toggle.textContent = '+';
                analytics.log('faq_closed', { question: question.textContent.trim() });
            }
        });
    });
}

// =====================
// ANIMATION INITIALIZATION
// =====================

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// =====================
// COMPONENT INITIALIZATION
// =====================

function initializeComponents() {
    addAnimationStyles();
    initializeCarousel();
    initializeAccordion();
    console.log('[COMPONENTS] All components initialized successfully');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
    initializeComponents();
}

// Make functions global
window.initializeComponents = initializeComponents;
