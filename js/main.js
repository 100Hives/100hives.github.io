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
    const videos = document.querySelectorAll('.service-video');
    const modalTriggers = document.querySelectorAll('.video-modal-trigger');
    
    videos.forEach(video => {
        const overlay = video.parentElement.querySelector('.video-overlay');
        
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
    
    // Premium Animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .section-header, .cta-content');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/**
 * Sets up the mobile navigation functionality
 */
function setupMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn) return;
    
    // Check if mobile nav already exists, if not create it
    let mobileNav = document.querySelector('.mobile-nav');
    
    // Function to close the mobile menu
    const closeMobileMenu = () => {
        mobileNav.classList.remove('active');
        mobileNav.classList.remove('slide-in');
        mobileNav.classList.add('slide-out');
        
        // Enable body scrolling
        document.body.classList.remove('menu-active');
        
        // Remove the slide-out class after animation completes
        setTimeout(() => {
            mobileNav.classList.remove('slide-out');
        }, 300);
    };
    
    if (!mobileNav) {
        // Create mobile navigation
        mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        
        // Create mobile navigation header
        const mobileNavHeader = document.createElement('div');
        mobileNavHeader.className = 'mobile-nav-header';
        
        // Clone logo
        const logo = document.querySelector('.logo').cloneNode(true);
        
        // Create close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-menu';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close menu');
        closeBtn.setAttribute('role', 'button');
        closeBtn.setAttribute('tabindex', '0');
        
        mobileNavHeader.appendChild(logo);
        mobileNavHeader.appendChild(closeBtn);
        
        // Create mobile navigation links
        const mobileNavLinks = document.createElement('div');
        mobileNavLinks.className = 'mobile-nav-links';
        
        // Clone navigation links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            // Add event listener to close menu when link is clicked
            newLink.addEventListener('click', closeMobileMenu);
            mobileNavLinks.appendChild(newLink);
        });
        
        // Clone book appointment button
        const navBtn = document.querySelector('.nav-btn');
        if (navBtn) {
            const mobileNavBtn = navBtn.cloneNode(true);
            mobileNavBtn.className = 'btn mobile-nav-btn';
            // Add event listener to close menu when button is clicked
            mobileNavBtn.addEventListener('click', closeMobileMenu);
            mobileNavLinks.appendChild(mobileNavBtn);
        }
        
        // Append elements to mobile nav
        mobileNav.appendChild(mobileNavHeader);
        mobileNav.appendChild(mobileNavLinks);
        
        // Append mobile nav to body
        document.body.appendChild(mobileNav);
        
        // Add event listener to close button
        closeBtn.addEventListener('click', closeMobileMenu);
        
        // Add keyboard support for close button
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking outside
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Add event listener to mobile menu button
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        mobileNav.classList.add('slide-in');
        
        // Disable body scrolling
        document.body.classList.add('menu-active');
        
        // Focus on the close button for accessibility
        setTimeout(() => {
            mobileNav.querySelector('.close-menu').focus();
        }, 300);
    });
    
    // Add keyboard support for mobile menu button
    mobileMenuBtn.setAttribute('role', 'button');
    mobileMenuBtn.setAttribute('tabindex', '0');
    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
    
    mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            mobileMenuBtn.click();
        }
    });
    
    // Handle touch events for better mobile experience
    if ('ontouchstart' in window) {
        const touchElements = document.querySelectorAll('.btn, .nav-links a, .service-card, .testimonial-card');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                element.classList.remove('touch-active');
            }, { passive: true });
        });
    }
}

/**
 * Sets up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('menu-active');
                }
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Sets up sticky header functionality
 */
function setupStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolled down
        if (currentScrollTop > scrollThreshold) {
            header.classList.add('nav-scrolled');
        } else {
            header.classList.remove('nav-scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
            // Scrolling down
            header.classList.add('nav-hidden');
        } else {
            // Scrolling up
            header.classList.remove('nav-hidden');
        }
        
        lastScrollTop = currentScrollTop;
    });
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
