/**
 * Release Therapies - Main JavaScript
 * This file contains the main JavaScript functionality for the Release Therapies website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Performance optimizations
    optimizePerformance();
    
    // Global error handling
    setupGlobalErrorHandler();
    
    // Network connectivity monitoring
    setupConnectivityMonitoring();
    
    // Initialize Dark Mode
    initializeDarkMode();
    
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
    
    // Toast notification system
    createToastContainer();
    
    // Enhanced form submission handling
    enhanceFormSubmission();
    
    // Initialize statistics counter animation
    initializeStatsCounter();
    
    // Initialize newsletter signup
    initializeNewsletterSignup();
    
    initInstagramVideos();
    initVideoLazyLoading();
    
    // Pause videos when user scrolls away from section
    const instagramSection = document.querySelector('.instagram-feed');
    if (instagramSection && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    pauseAllVideos();
                }
            });
        }, {
            threshold: 0.1
        });
        
        sectionObserver.observe(instagramSection);
    }
});

/**
 * Performance optimization functions
 */
function optimizePerformance() {
    // Implement lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Add error handling for scripts
    window.addEventListener('error', function(e) {
        console.warn('Script error caught:', e.error);
        // Could send to analytics service
    });
    
    // Optimize scroll performance
    let ticking = false;
    const optimizedScroll = (callback) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                callback();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    // Replace direct scroll listeners with optimized version
    window.addEventListener('scroll', () => {
        optimizedScroll(() => {
            // Scroll-based operations go here
        });
    });
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
    const criticalImages = [
        'images/logo.png',
        'images/service-1.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

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

/**
 * Toast notification system for user feedback
 */
function createToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'success', duration = 5000) {
    createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : '⚠';
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    const container = document.querySelector('.toast-container');
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto hide
    const autoHide = setTimeout(() => {
        hideToast(toast);
    }, duration);
    
    // Manual close
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHide);
        hideToast(toast);
    });
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Enhanced form submission handling with better error feedback
 */
function enhanceFormSubmission() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add loading state on submit
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !form.classList.contains('no-loading')) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                // Re-enable after timeout (fallback)
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 10000);
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error state when user starts typing
                if (this.classList.contains('error-field')) {
                    removeFieldError(this);
                }
            });
        });
    });
}

/**
 * Validate individual field
 */
function validateField(field) {
    const fieldType = field.type;
    const fieldValue = field.value.trim();
    
    // Clear previous errors
    removeFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !fieldValue) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Type-specific validation
    switch (fieldType) {
        case 'email':
            if (fieldValue && !validateEmail(fieldValue)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'tel':
            if (fieldValue && !validateUKPhone(fieldValue)) {
                showFieldError(field, 'Please enter a valid UK phone number');
                return false;
            }
            break;
            
        case 'password':
            if (fieldValue) {
                const validation = validatePasswordStrength(fieldValue);
                if (!validation.isValid) {
                    showFieldError(field, `Password must include: ${validation.feedback.join(', ')}`);
                    return false;
                }
            }
            break;
    }
    
    // Check password confirmation
    if (field.id === 'confirmPassword') {
        const passwordField = document.getElementById('registerPassword') || document.getElementById('loginPassword');
        if (passwordField && !validatePasswordMatch(passwordField.value, fieldValue)) {
            showFieldError(field, 'Passwords do not match');
            return false;
        }
    }
    
    return true;
}

/**
 * Show field-specific error
 */
function showFieldError(field, message) {
    field.classList.add('error-field');
    
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        let errorDiv = formGroup.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            formGroup.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
    }
}

/**
 * Remove field error
 */
function removeFieldError(field) {
    field.classList.remove('error-field');
    
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        const errorDiv = formGroup.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

/**
 * Get user-friendly field label
 */
function getFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name || 'This field';
}

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a UK phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
function validateUKPhone(phone) {
    // Remove all spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // UK phone number patterns
    const ukMobileRegex = /^(\+44|0)[7-9]\d{9}$/;
    const ukLandlineRegex = /^(\+44|0)[1-9]\d{8,9}$/;
    
    return ukMobileRegex.test(cleanPhone) || ukLandlineRegex.test(cleanPhone);
}

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with score and feedback
 */
function validatePasswordStrength(password) {
    let score = 0;
    const feedback = [];
    
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters long');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include uppercase letters');
    
    if (/\d/.test(password)) score++;
    else feedback.push('Include numbers');
    
    if (/[^a-zA-Z\d]/.test(password)) score++;
    else feedback.push('Include special characters');
    
    return {
        score,
        isValid: score >= 3,
        feedback: feedback
    };
}

/**
 * Validates that passwords match
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {boolean} - Whether passwords match
 */
function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword && password.length > 0;
}

/**
 * Global error handler for better user experience
 */
function setupGlobalErrorHandler() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Check if this is a harmless error we can ignore
        const errorMessage = e.error?.message || e.message || '';
        const errorStack = e.error?.stack || '';
        
        // Don't show user error for these types of harmless errors
        const harmlessErrors = [
            'Non-Error promise rejection captured',
            'Loading chunk',
            'Loading CSS chunk',
            'Network request failed',
            'Image loading error',
            'Video loading error',
            'play() failed',
            'The play() request was interrupted',
            'NotAllowedError',
            'NotSupportedError',
            'AbortError',
            'Script error',
            'ResizeObserver loop limit exceeded'
        ];
        
        const isHarmlessError = harmlessErrors.some(harmless => 
            errorMessage.toLowerCase().includes(harmless.toLowerCase()) ||
            errorStack.toLowerCase().includes(harmless.toLowerCase())
        );
        
        // Only show user-facing error for serious errors
        if (!isHarmlessError && errorMessage && !errorMessage.includes('favicon')) {
            showToast('Something went wrong. Please try again or contact support if the issue persists.', 'error', 8000);
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        
        // Check if this is a harmless promise rejection
        const reason = e.reason?.message || e.reason || '';
        
        const harmlessRejections = [
            'play() failed',
            'The play() request was interrupted',
            'NotAllowedError',
            'NotSupportedError',
            'AbortError',
            'Network request failed',
            'Loading chunk failed',
            'Image loading error',
            'Video loading error'
        ];
        
        const isHarmlessRejection = harmlessRejections.some(harmless => 
            reason.toString().toLowerCase().includes(harmless.toLowerCase())
        );
        
        // Only show user-facing error for serious promise rejections
        if (!isHarmlessRejection && reason && !reason.toString().includes('favicon')) {
            showToast('Something went wrong. Please try again or contact support if the issue persists.', 'error', 8000);
        }
        
        // Prevent the browser from logging this to console (optional)
        // e.preventDefault();
    });
}

/**
 * Network connectivity monitoring
 */
function setupConnectivityMonitoring() {
    let isOnline = navigator.onLine;
    
    window.addEventListener('online', function() {
        if (!isOnline) {
            showToast('Connection restored! You\'re back online.', 'success', 3000);
            isOnline = true;
        }
    });
    
    window.addEventListener('offline', function() {
        showToast('You\'re currently offline. Some features may not work properly.', 'error', 5000);
        isOnline = false;
    });
}

// Instagram Video Functionality
function initInstagramVideos() {
    const videoItems = document.querySelectorAll('.instagram-item.video-item');
    
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        const overlay = item.querySelector('.instagram-overlay');
        
        if (!video) return;
        
        // Set initial state
        video.muted = true;
        video.loop = true;
        
        // Click to play/pause and toggle mute
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (video.paused) {
                // Pause all other videos first
                pauseAllVideos();
                
                // Play this video
                video.play().then(() => {
                    item.classList.add('playing');
                }).catch(err => {
                    console.log('Video play failed:', err);
                });
            } else {
                video.pause();
                item.classList.remove('playing');
            }
        });
        
        // Hover effects
        item.addEventListener('mouseenter', () => {
            if (video.paused) {
                video.currentTime = 0;
                video.play().catch(err => {
                    // Fail silently - some browsers require user interaction
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('playing')) {
                video.pause();
                video.currentTime = 0;
            }
        });
        
        // Handle video end
        video.addEventListener('ended', () => {
            item.classList.remove('playing');
            video.currentTime = 0;
        });
        
        // Handle video errors
        video.addEventListener('error', (e) => {
            console.warn('Video loading error:', e);
            // Could add fallback image here
        });
    });
}

function pauseAllVideos() {
    const videoItems = document.querySelectorAll('.instagram-item.video-item');
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        if (video && !video.paused) {
            video.pause();
            item.classList.remove('playing');
        }
    });
}

// Intersection Observer for lazy loading videos
function initVideoLazyLoading() {
    const videoItems = document.querySelectorAll('.instagram-item.video-item');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target.querySelector('video');
                    if (video && !video.src) {
                        const source = video.querySelector('source');
                        if (source && source.getAttribute('data-src')) {
                            source.src = source.getAttribute('data-src');
                            video.load();
                        }
                    }
                    videoObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        videoItems.forEach(item => {
            videoObserver.observe(item);
        });
    }
}

/**
 * Dark Mode Functionality
 */
function initializeDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Theme toggle event listener - now cycles between two themes
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        let newTheme;
        
        // Cycle through: light → contrast → light
        switch (currentTheme) {
            case 'light':
                newTheme = 'contrast';
                break;
            case 'contrast':
                newTheme = 'light';
                break;
            default:
                newTheme = 'light';
        }
        
        setTheme(newTheme);
        
        // Add a nice click animation
        this.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    });

    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            // Only auto-switch if user hasn't manually set a preference
            // Since we no longer support dark mode, always use light theme
            if (!localStorage.getItem('theme')) {
                setTheme('light');
            }
        });
    }
}

function setTheme(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Set the theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update the toggle button icon and label based on theme
    if (themeIcon) {
        switch (theme) {
            case 'contrast':
                themeIcon.className = 'fas fa-sun';
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
                break;
            default: // light mode
                themeIcon.className = 'fas fa-adjust';
                themeToggle.setAttribute('aria-label', 'Switch to high contrast mode');
        }
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Trigger custom event for other scripts that might need to know about theme changes
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Initialize Statistics Counter Animation
 */
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const statsSection = document.querySelector('.stats-section');
    
    if (!statNumbers.length || !statsSection) return;
    
    let hasAnimated = false;
    
    const animateStats = () => {
        if (hasAnimated) return;
        hasAnimated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            stat.classList.add('counting');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    stat.classList.remove('counting');
                    clearInterval(timer);
                }
                
                // Format number with commas for large numbers
                const displayValue = Math.floor(current);
                if (target >= 1000) {
                    stat.textContent = displayValue.toLocaleString();
                } else {
                    stat.textContent = displayValue;
                }
                
                // Add percentage sign if needed
                if (stat.textContent.includes('%') || stat.getAttribute('data-count') === '98') {
                    stat.textContent = Math.floor(current) + '%';
                }
            }, 16);
        });
    };
    
    // Intersection Observer for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateStats();
            }
        });
    }, {
        threshold: 0.5
    });
    
    observer.observe(statsSection);
}

/**
 * Initialize Newsletter Signup
 */
function initializeNewsletterSignup() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual newsletter service)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showToast('Successfully subscribed to our newsletter!', 'success');
            
            // Reset form
            this.reset();
            
            // Track newsletter signup (if analytics is set up)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'engagement',
                    event_label: 'newsletter'
                });
            }
            
        } catch (error) {
            console.error('Newsletter signup error:', error);
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Enhanced Analytics Tracking
 */
function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, parameters);
}

/**
 * Enhanced Form Validation
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

/**
 * Local Storage Utilities
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn('Could not read from localStorage:', error);
        return null;
    }
}

/**
 * Performance Optimization
 */
