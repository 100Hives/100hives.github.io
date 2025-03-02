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
});

/**
 * Sets up the mobile navigation functionality
 */
function setupMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn) return;
    
    // Check if mobile nav already exists, if not create it
    let mobileNav = document.querySelector('.mobile-nav');
    
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
        
        mobileNavHeader.appendChild(logo);
        mobileNavHeader.appendChild(closeBtn);
        
        // Create mobile navigation links
        const mobileNavLinks = document.createElement('div');
        mobileNavLinks.className = 'mobile-nav-links';
        
        // Clone navigation links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            mobileNavLinks.appendChild(newLink);
        });
        
        // Clone book appointment button
        const navBtn = document.querySelector('.nav-btn');
        if (navBtn) {
            const mobileNavBtn = navBtn.cloneNode(true);
            mobileNavBtn.className = 'btn mobile-nav-btn';
            mobileNav.appendChild(mobileNavHeader);
            mobileNav.appendChild(mobileNavLinks);
            mobileNav.appendChild(mobileNavBtn);
        } else {
            mobileNav.appendChild(mobileNavHeader);
            mobileNav.appendChild(mobileNavLinks);
        }
        
        document.body.appendChild(mobileNav);
        
        // Add event listener to close button
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileNav.classList.add('slide-out');
            
            // Enable body scrolling
            document.body.style.overflow = '';
            
            setTimeout(() => {
                mobileNav.classList.remove('slide-out');
            }, 300);
        });
    }
    
    // Add event listener to mobile menu button
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.add('active', 'slide-in');
        
        // Disable body scrolling when menu is open
        document.body.style.overflow = 'hidden';
    });
}

/**
 * Sets up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if it's open
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Scroll to the target element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Sets up sticky header functionality
 */
function setupStickyHeader() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add box shadow when scrolled
        if (scrollTop > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Initializes sliders if they exist on the page
 */
function initializeSliders() {
    // Testimonials slider - simple version without dependencies
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    if (testimonialsSlider) {
        const testimonials = testimonialsSlider.querySelectorAll('.testimonial');
        
        // If there are more than 3 testimonials, set up a simple slider
        if (testimonials.length > 3) {
            let currentIndex = 0;
            const visibleCount = window.innerWidth < 768 ? 1 : 3;
            
            // Hide all testimonials except the first visibleCount
            testimonials.forEach((testimonial, index) => {
                if (index >= visibleCount) {
                    testimonial.style.display = 'none';
                }
            });
            
            // Create navigation buttons
            const sliderNav = document.createElement('div');
            sliderNav.className = 'slider-nav';
            
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slider-prev';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'slider-next';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            sliderNav.appendChild(prevBtn);
            sliderNav.appendChild(nextBtn);
            
            testimonialsSlider.parentNode.appendChild(sliderNav);
            
            // Add event listeners to buttons
            prevBtn.addEventListener('click', function() {
                currentIndex = Math.max(0, currentIndex - 1);
                updateSlider();
            });
            
            nextBtn.addEventListener('click', function() {
                currentIndex = Math.min(testimonials.length - visibleCount, currentIndex + 1);
                updateSlider();
            });
            
            // Update slider function
            function updateSlider() {
                testimonials.forEach((testimonial, index) => {
                    if (index >= currentIndex && index < currentIndex + visibleCount) {
                        testimonial.style.display = 'block';
                    } else {
                        testimonial.style.display = 'none';
                    }
                });
                
                // Update button states
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === testimonials.length - visibleCount;
            }
            
            // Initial update
            updateSlider();
            
            // Update on window resize
            window.addEventListener('resize', function() {
                const newVisibleCount = window.innerWidth < 768 ? 1 : 3;
                
                if (newVisibleCount !== visibleCount) {
                    currentIndex = 0;
                    updateSlider();
                }
            });
        }
    }
}

/**
 * Adds a class to an element after a delay
 * @param {HTMLElement} element - The element to add the class to
 * @param {string} className - The class to add
 * @param {number} delay - The delay in milliseconds
 */
function addClassWithDelay(element, className, delay) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

/**
 * Removes a class from an element after a delay
 * @param {HTMLElement} element - The element to remove the class from
 * @param {string} className - The class to remove
 * @param {number} delay - The delay in milliseconds
 */
function removeClassWithDelay(element, className, delay) {
    setTimeout(() => {
        element.classList.remove(className);
    }, delay);
}
