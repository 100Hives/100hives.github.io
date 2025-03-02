/**
 * Release Therapies - Booking Page JavaScript
 * This file contains JavaScript functionality specific to the booking page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers with min date of today
    initializeDatePickers();
    
    // Set up service type change handler
    setupServiceTypeHandler();
    
    // Set up insurance checkbox handler
    setupInsuranceCheckbox();
    
    // Pre-fill service type from URL parameter if present
    prefillFromUrlParams();
    
    // Set up form validation
    setupFormValidation();
});

/**
 * Initializes date pickers with minimum date of today
 */
function initializeDatePickers() {
    const today = new Date().toISOString().split('T')[0];
    
    const datePickers = document.querySelectorAll('input[type="date"]');
    datePickers.forEach(picker => {
        picker.min = today;
    });
}

/**
 * Sets up handler for service type changes to update duration options
 */
function setupServiceTypeHandler() {
    const serviceTypeSelect = document.getElementById('serviceType');
    const durationSelect = document.getElementById('duration');
    
    if (!serviceTypeSelect || !durationSelect) return;
    
    serviceTypeSelect.addEventListener('change', function() {
        const selectedService = this.value;
        
        // Reset duration options
        durationSelect.innerHTML = '<option value="">Select duration</option>';
        
        // Add appropriate duration options based on service type
        if (selectedService === 'Deep Tissue Massage' || selectedService === 'Swedish Massage' || selectedService === 'Sports Massage') {
            addDurationOption(durationSelect, '30 minutes', '30 minutes');
            addDurationOption(durationSelect, '60 minutes', '60 minutes');
            addDurationOption(durationSelect, '90 minutes', '90 minutes');
        } else if (selectedService === 'Physical Therapy' || selectedService === 'Myofascial Release') {
            addDurationOption(durationSelect, '45 minutes', '45 minutes');
            addDurationOption(durationSelect, '60 minutes', '60 minutes');
        } else if (selectedService === 'Cupping Therapy') {
            addDurationOption(durationSelect, '30 minutes', '30 minutes');
        } else {
            // Default options for other services
            addDurationOption(durationSelect, '30 minutes', '30 minutes');
            addDurationOption(durationSelect, '60 minutes', '60 minutes');
            addDurationOption(durationSelect, '90 minutes', '90 minutes');
        }
    });
}

/**
 * Helper function to add an option to a select element
 * @param {HTMLSelectElement} selectElement - The select element to add the option to
 * @param {string} value - The value of the option
 * @param {string} text - The text of the option
 */
function addDurationOption(selectElement, value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    selectElement.appendChild(option);
}

/**
 * Sets up handler for insurance checkbox to show/hide insurance details
 */
function setupInsuranceCheckbox() {
    const insuranceCheckbox = document.getElementById('insurance');
    const insuranceDetails = document.getElementById('insuranceDetails');
    
    if (!insuranceCheckbox || !insuranceDetails) return;
    
    insuranceCheckbox.addEventListener('change', function() {
        insuranceDetails.style.display = this.checked ? 'block' : 'none';
        
        // Make insurance fields required if checkbox is checked
        const insuranceFields = insuranceDetails.querySelectorAll('input');
        insuranceFields.forEach(field => {
            field.required = this.checked;
        });
    });
}

/**
 * Pre-fills form fields from URL parameters
 */
function prefillFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for service parameter
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect) {
            // Find the option that matches the service parameter
            for (let i = 0; i < serviceSelect.options.length; i++) {
                if (serviceSelect.options[i].value === serviceParam) {
                    serviceSelect.selectedIndex = i;
                    
                    // Trigger change event to update duration options
                    const event = new Event('change');
                    serviceSelect.dispatchEvent(event);
                    break;
                }
            }
        }
    }
    
    // Check for package parameter
    const packageParam = urlParams.get('package');
    if (packageParam) {
        // Show a message about the selected package
        const bookingIntro = document.querySelector('.booking-intro');
        if (bookingIntro) {
            const packageMessage = document.createElement('div');
            packageMessage.className = 'package-message';
            packageMessage.innerHTML = `<p>You've selected the <strong>${packageParam} Package</strong>. Please fill out the form below to schedule your first appointment.</p>`;
            bookingIntro.appendChild(packageMessage);
        }
    }
}

/**
 * Sets up form validation for the booking form
 */
function setupFormValidation() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Get required fields
        const requiredFields = bookingForm.querySelectorAll('[required]');
        
        // Check each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                highlightInvalidField(field);
            } else {
                removeInvalidHighlight(field);
            }
        });
        
        // Check email format if email field exists
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            if (!isValidEmail(emailField.value.trim())) {
                isValid = false;
                highlightInvalidField(emailField, 'Please enter a valid email address');
            }
        }
        
        // Check phone format if phone field exists
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            if (!isValidPhone(phoneField.value.trim())) {
                isValid = false;
                highlightInvalidField(phoneField, 'Please enter a valid phone number');
            }
        }
        
        // Prevent form submission if validation fails
        if (!isValid) {
            e.preventDefault();
            
            // Scroll to the first invalid field
            const firstInvalidField = bookingForm.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
        }
    });
    
    // Add input event listeners to remove invalid highlight when user types
    const formFields = bookingForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            removeInvalidHighlight(field);
        });
    });
}

/**
 * Highlights an invalid form field
 * @param {HTMLElement} field - The field to highlight
 * @param {string} message - Optional error message to display
 */
function highlightInvalidField(field, message) {
    field.classList.add('invalid');
    
    // Check if error message element already exists
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        // Create error message element
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    // Set error message
    errorElement.textContent = message || 'This field is required';
}

/**
 * Removes invalid highlight from a form field
 * @param {HTMLElement} field - The field to remove highlight from
 */
function removeInvalidHighlight(field) {
    field.classList.remove('invalid');
    
    // Remove error message if it exists
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
function isValidPhone(phone) {
    // Allow various formats: (123) 456-7890, 123-456-7890, 123.456.7890, etc.
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
}
