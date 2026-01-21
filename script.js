// ===================================
// CYBER-FITNESS GYM WEBSITE SCRIPTS
// AUTOMATIC SCROLL-BASED ANIMATIONS
// =================================== */

// DOM Content Loaded - Initialize everything
document.addEventListener('DOMContentLoaded', function() {

    // Initialize all features
    initMobileMenu();
    initScrollEffects();
    initScrollReveal();
    initCardScrollAnimations(); // NEW: Automatic card animations
    initCounterAnimation();
    initProgressBars();
    initSmoothScroll();

});

// ===================================
// MOBILE NAVIGATION
// ===================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add background on scroll
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 240, 255, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// SCROLL REVEAL ANIMATION
// For section titles and subtitles
// ===================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: Just add active class to all elements
        revealElements.forEach(element => {
            element.classList.add('active');
        });
        return;
    }

    // IntersectionObserver for better performance
    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        // Add active class as fallback
        setTimeout(() => {
            element.classList.add('active');
        }, 100);

        revealObserver.observe(element);
    });
}

// ===================================
// CARD SCROLL ANIMATIONS - NEW
// Automatically animates cards on scroll
// Triggers at 60-70% viewport visibility
// ===================================
function initCardScrollAnimations() {
    // Select all card types that should animate on scroll
    const cardSelectors = [
        '.feature-card',
        '.program-card',
        '.stat-card',
        '.transformation-card',
        '.pricing-card',
        '.info-card'
    ];

    // Combine all selectors
    const allCards = document.querySelectorAll(cardSelectors.join(', '));

    if (allCards.length === 0) return;

    // Add scroll-reveal class to all cards
    allCards.forEach(card => {
        card.classList.add('scroll-reveal');
    });

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: Immediately show all cards
        allCards.forEach(card => {
            card.classList.add('animated');
        });
        console.log('IntersectionObserver not supported - showing all cards immediately');
        return;
    }

    // Create IntersectionObserver for cards
    // Trigger when 60% of card is visible (0.6 threshold)
    const cardObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animated class when card enters viewport
                entry.target.classList.add('animated');

                // Optional: Stop observing after animation (animate once)
                // Comment out the line below if you want re-animation on scroll
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.6, // 60% visibility trigger
        rootMargin: '0px 0px -10% 0px' // Start animation slightly before reaching center
    });

    // Observe all cards
    allCards.forEach(card => {
        cardObserver.observe(card);
    });

    console.log(`✓ Card scroll animations initialized for ${allCards.length} cards`);
}

// ===================================
// ANIMATED COUNTER
// Counts up numbers when section is visible
// ===================================
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length === 0) return;

    let countersAnimated = false;

    // Show numbers immediately as fallback
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (!isNaN(target)) {
            stat.textContent = target;
        }
    });

    // Then animate if observer is supported
    if (!('IntersectionObserver' in window)) return;

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
            }
        });
    }, {
        threshold: 0.5
    });

    if (statNumbers.length > 0) {
        const section = statNumbers[0].closest('section');
        if (section) {
            counterObserver.observe(section);
        }
    }
}

// Counter animation helper
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) return;

    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = function() {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ===================================
// PROGRESS BAR ANIMATION
// Bars are visible, animation is enhancement
// ===================================
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    if (progressBars.length === 0) return;

    // Show progress immediately
    progressBars.forEach(bar => {
        const progressValue = bar.getAttribute('data-progress');
        if (progressValue) {
            // Set width immediately as fallback
            bar.style.setProperty('--progress-width', progressValue + '%');
            bar.style.width = progressValue + '%';

            const card = bar.closest('.transformation-card');
            if (card) {
                card.classList.add('active');
            }
        }
    });

    // Then animate if observer is supported
    if (!('IntersectionObserver' in window)) return;

    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target;
                const progressValue = progressFill.getAttribute('data-progress');

                if (progressValue) {
                    // Reset and animate
                    progressFill.style.width = '0';
                    setTimeout(() => {
                        progressFill.style.width = progressValue + '%';
                    }, 100);
                }
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// ===================================
// SMOOTH SCROLL
// Smooth scrolling for anchor links
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just #
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Get navbar height for offset
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight;

                // Use smooth scroll if supported
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    window.scrollTo(0, targetPosition);
                }
            }
        });
    });
}

// ===================================
// PARALLAX EFFECT (Optional Enhancement)
// Subtle parallax on hero background
// ===================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');

    if (heroBg && scrolled < window.innerHeight) {
        // Use requestAnimationFrame for smooth performance
        requestAnimationFrame(() => {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
});

// ===================================
// 3D TILT EFFECT ON CARDS (Optional)
// Adds subtle 3D tilt on mouse move
// HOVER-BASED, not scroll-based
// ===================================
function init3DTilt() {
    const cards = document.querySelectorAll('.feature-card, .program-card, .pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
        });

        card.addEventListener('mouseleave', function() {
            requestAnimationFrame(() => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    });
}

// Uncomment to enable 3D tilt effect (may impact performance on low-end devices)
// init3DTilt();

// ===================================
// VISIBILITY CHECK ON LOAD
// Ensures all sections are visible immediately
// ===================================
window.addEventListener('load', function() {
    // Force visibility check
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        // Ensure no hidden sections
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });

    // Mark body as loaded
    document.body.classList.add('loaded');

    console.log('%c✓ All sections verified visible', 'color: #39ff14; font-weight: bold;');
});

// ===================================
// ERROR HANDLING
// Catch any JavaScript errors to prevent blank sections
// ===================================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    // Ensure content remains visible even if JS fails
    document.querySelectorAll('.reveal, .scroll-reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.add('animated', 'active');
    });
});

// ===================================
// PERFORMANCE MONITORING
// Console log for debugging (remove in production)
// ===================================
console.log('%c🏋️ NEXUS GYM Website Loaded', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%c✓ Scroll-based card animations enabled', 'color: #39ff14; font-size: 14px;');
console.log('%c✓ CTA buttons remain hover-only', 'color: #ff006e; font-size: 14px;');
console.log('%c✓ Animations trigger at 60% viewport visibility', 'color: #00f0ff; font-size: 14px;');