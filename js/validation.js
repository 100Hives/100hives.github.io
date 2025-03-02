/**
 * Release Therapies - Form Validation JavaScript
 * This file contains form validation functionality for the Release Therapies website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set up contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupContactFormValidation(contactForm);
    }
    
    // Add custom form styles
    addFormStyles();
});

/**
 * Sets up validation for the contact form
 * @param {HTMLFormElement} form - The contact form element
 */
function setupContactFormValidation(form) {
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Validate name
        const nameField = document.getElementById('name');
        if (nameField && !validateRequired(nameField.value)) {
            isValid = false;
            showError(nameField, 'Please enter your name');
        } else {
            removeError(nameField);
        }
        
        // Validate email
        const emailField = document.getElementById('email');
        if (emailField) {
            if (!validateRequired(emailField.value)) {
                isValid = false;
                showError(emailField, 'Please enter your email address');
            } else if (!validateEmail(emailField.value)) {
                isValid = false;
                showError(emailField, 'Please enter a valid email address');
            } else {
                removeError(emailField);
            }
        }
        
        // Validate subject
        const subjectField = document.getElementById('subject');
        if (subjectField && !validateRequired(subjectField.value)) {
            isValid = false;
            showError(subjectField, 'Please enter a subject');
        } else {
            removeError(subjectField);
        }
        
        // Validate message
        const messageField = document.getElementById('message');
        if (messageField && !validateRequired(messageField.value)) {
            isValid = false;
            showError(messageField, 'Please enter your message');
        } else {
            removeError(messageField);
        }
        
        // Prevent form submission if validation fails
        if (!isValid) {
            e.preventDefault();
            
            // Scroll to the first error
            const firstError = document.querySelector('.form-group.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Add input event listeners to remove errors when user types
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            removeError(field);
        });
    });
}

/**
 * Validates that a value is not empty
 * @param {string} value - The value to validate
 * @returns {boolean} - Whether the value is not empty
 */
function validateRequired(value) {
    return value.trim() !== '';
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
 * Shows an error message for a form field
 * @param {HTMLElement} field - The field to show the error for
 * @param {string} message - The error message to display
 */
function showError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('has-error');
    
    // Check if error message already exists
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Add error styling to the field
    field.classList.add('error-field');
}

/**
 * Removes error message and styling from a form field
 * @param {HTMLElement} field - The field to remove the error from
 */
function removeError(field) {
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('has-error');
    
    // Remove error message if it exists
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Remove error styling from the field
    field.classList.remove('error-field');
}

/**
 * Adds custom styles for form validation
 */
function addFormStyles() {
    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
        .form-group.has-error .form-control,
        .error-field {
            border-color: var(--error-color);
        }
        
        .error-message {
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        .form-control:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.2);
        }
        
        .form-control.error-field:focus {
            border-color: var(--error-color);
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
        }
    `;
    
    // Append the style element to the head
    document.head.appendChild(style);
}
