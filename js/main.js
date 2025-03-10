/**
 * Release Therapies - Main JavaScript
 * This file contains the main JavaScript functionality for the Release Therapies website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    setupMobileNavigation();
    
    // Smooth Scrolling for Anchor Links
    setupSmoothScrolling();
    
    // Sticky Header on Scroll
    setupStickyHeader();
    
    // Initialize any sliders if they exist
    initializeSliders();
    
    // Video Interaction Handling
    setupVideoInteractions();
    
    // Premium Animations
    setupPremiumAnimations();
    
    // Back to Top Button
    setupBackToTopButton();
    
    // Initialize hover effects
    setupHoverEffects();
});

/**
 * Sets up premium animations for elements
 */
function setupPremiumAnimations() {
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .section-title, .cta-content, .testimonial-card, .about-image');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight * 0.85 && elementBottom > 0) {
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check on scroll with throttling for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                animateOnScroll();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // Add staggered animation to mobile nav links
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach((link, index) => {
        link.style.setProperty('--item-index', index);
    });
}

/**
 * Sets up hover effects for interactive elements
 */
function setupHoverEffects() {
    // Add subtle hover effects to cards
    const cards = document.querySelectorAll('.service-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--premium-shadow)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn:not(.nav-btn)');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Sets up the mobile navigation functionality
 */
function setupMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    
    if (!mobileMenuBtn || !mobileNav || !overlay) {
        console.error('Mobile navigation elements not found');
        return;
    }

    // Ensure mobile nav and overlay are in the correct initial state
    mobileNav.style.display = 'flex';
    mobileNav.style.right = '-100%';
    mobileNav.style.visibility = 'hidden';
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    
    // Function to close the mobile menu
    const closeMobileMenu = (e) => {
        if (e && e.target.classList.contains('mobile-nav-overlay')) {
            e.preventDefault();
        }
        mobileNav.style.right = '-100%';
        mobileNav.style.visibility = 'hidden';
        document.body.classList.remove('menu-active');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        
        // Small delay to ensure transitions complete before hiding elements
        setTimeout(() => {
            if (!mobileNav.classList.contains('active')) {
                mobileNav.style.display = 'none';
                overlay.style.display = 'none';
            }
        }, 400); // Match this with your CSS transition duration
    };
    
    // Function to open the mobile menu
    const openMobileMenu = (e) => {
        if (e) e.preventDefault();
        mobileNav.style.display = 'flex';
        overlay.style.display = 'block';
        
        // Force a reflow to ensure the display change takes effect
        mobileNav.offsetHeight;
        
        mobileNav.classList.add('active');
        mobileNav.style.right = '0';
        mobileNav.style.visibility = 'visible';
        document.body.classList.add('menu-active');
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
    };
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking navigation links
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Don't prevent default navigation
            mobileNav.style.right = '-100%';
            mobileNav.style.visibility = 'hidden';
            document.body.classList.remove('menu-active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close button in mobile menu
    const closeBtn = mobileNav.querySelector('.close-menu');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
        });
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 250);
    });
}

/**
 * Sets up a back to top button
 */
function setupBackToTopButton() {
    // Create back to top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '&uarr;';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Sets up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                
                // Add a small delay for mobile menu to close first
                setTimeout(() => {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
}

/**
 * Sets up sticky header on scroll
 */
function setupStickyHeader() {
    const header = document.querySelector('header');
    const isHomePage = document.body.classList.contains('home');
    
    if (!header) return;
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            
            // Only for home page - ensure transparent header at top
            if (isHomePage && window.scrollY <= 50) {
                header.style.backgroundColor = 'transparent';
                header.style.boxShadow = 'none';
            }
        }
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
}

/**
 * Initializes sliders on the page
 */
function initializeSliders() {
    // Testimonials slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        // Simple auto-scrolling for testimonials on mobile
        if (window.innerWidth < 768) {
            const testimonials = testimonialSlider.querySelectorAll('.testimonial-card');
            let currentIndex = 0;
            
            // Function to show next testimonial
            const showNextTestimonial = () => {
                testimonials.forEach(testimonial => {
                    testimonial.style.display = 'none';
                });
                
                testimonials[currentIndex].style.display = 'block';
                currentIndex = (currentIndex + 1) % testimonials.length;
            };
            
            // Initialize
            showNextTestimonial();
            
            // Auto-scroll every 5 seconds
            setInterval(showNextTestimonial, 5000);
            
            // Add swipe functionality for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            testimonialSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            testimonialSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            const handleSwipe = () => {
                const swipeThreshold = 50;
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - next
                    showNextTestimonial();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - previous
                    currentIndex = (currentIndex - 2 + testimonials.length) % testimonials.length;
                    showNextTestimonial();
                }
            };
        }
    }
}

// Detect touch devices
document.addEventListener('DOMContentLoaded', function() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
});

function setupVideoInteractions() {
    const videos = document.querySelectorAll('.service-video');
    const modalTriggers = document.querySelectorAll('.video-modal-trigger');
    
    videos.forEach(video => {
        const overlay = video.parentElement.querySelector('.video-overlay');
        if (!overlay) return;
        
        // Handle click to play/pause
        overlay.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                video.muted = false;
                overlay.style.opacity = '0';
            } else {
                video.pause();
                video.muted = true;
                overlay.style.opacity = '1';
            }
        });
        
        // Show overlay when video is paused
        video.addEventListener('pause', () => {
            overlay.style.opacity = '1';
        });
        
        // Hide overlay when video is playing
        video.addEventListener('play', () => {
            overlay.style.opacity = '0';
        });
    });
}
