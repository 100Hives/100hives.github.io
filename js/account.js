/**
 * Account System - Login/Register Modal
 * Handles user authentication interface
 */

class AccountSystem {
    constructor() {
        this.modal = document.getElementById('accountModal');
        this.profileModal = document.getElementById('profileModal');
        this.accountBtn = document.getElementById('accountBtn');
        this.closeBtn = document.getElementById('closeModal');
        this.closeProfileBtn = document.getElementById('closeProfileModal');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.profileEditForm = document.getElementById('profileEditForm');
        this.showRegisterBtn = document.getElementById('showRegister');
        this.showLoginBtn = document.getElementById('showLogin');
        this.cancelProfileBtn = document.getElementById('cancelProfileEdit');
        this.modalTitle = document.getElementById('modalTitle');
        
        this.currentUser = null;
        
        // Test user for demo purposes
        this.testUsers = [
            {
                id: 'test_user_1',
                email: 'test@email.com',
                password: 'test',
                firstName: 'Yaseen',
                lastName: 'User',
                memberSince: 'November 2023',
                phone: '',
                address: '',
                dateOfBirth: '',
                emergencyContact: '',
                medicalConditions: '',
                treatmentPreferences: '',
                emailNotifications: true,
                smsNotifications: false,
                marketingEmails: true
            }
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
    }

    bindEvents() {
        // Store the original click handler so we can remove it later
        this.originalClickHandler = (e) => {
            e.preventDefault();
            this.openModal();
        };

        // Modal controls
        this.accountBtn.addEventListener('click', this.originalClickHandler);

        this.closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // Profile modal controls
        this.closeProfileBtn.addEventListener('click', () => {
            this.closeProfileModal();
        });

        this.cancelProfileBtn.addEventListener('click', () => {
            this.closeProfileModal();
        });

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close profile modal when clicking outside
        this.profileModal.addEventListener('click', (e) => {
            if (e.target === this.profileModal) {
                this.closeProfileModal();
            }
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.modal.classList.contains('show')) {
                    this.closeModal();
                }
                if (this.profileModal.classList.contains('show')) {
                    this.closeProfileModal();
                }
            }
        });

        // Form switching
        this.showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });

        this.showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        // Form submissions
        this.loginForm.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        this.registerForm.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });

        // Profile form submission
        this.profileEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e.target);
        });

        // Real-time validation
        this.setupValidation();
    }

    openModal() {
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    showLogin() {
        this.loginForm.classList.add('active');
        this.registerForm.classList.remove('active');
        this.modalTitle.textContent = 'Welcome Back';
        this.clearErrors();
    }

    showRegister() {
        this.registerForm.classList.add('active');
        this.loginForm.classList.remove('active');
        this.modalTitle.textContent = 'Create Account';
        this.clearErrors();
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Basic validation
        if (!this.validateEmail(email)) {
            this.showFieldError('loginEmail', 'Please enter a valid email address');
            return;
        }

        if (password.length < 1) {
            this.showFieldError('loginPassword', 'Password is required');
            return;
        }

        // Show loading state
        form.classList.add('loading');
        
        try {
            // Simulate API call delay
            await this.simulateApiCall();
            
            // Check test users first
            const testUser = this.testUsers.find(user => 
                user.email === email && user.password === password
            );
            
            if (testUser) {
                // Use test user data
                this.currentUser = {
                    id: testUser.id,
                    email: testUser.email,
                    firstName: testUser.firstName,
                    lastName: testUser.lastName,
                    memberSince: testUser.memberSince
                };
            } else {
                // For demo purposes, allow any email/password combination
                // In a real app, this would verify against a database
                this.currentUser = {
                    id: 'user_' + Date.now(),
                    email: email,
                    firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                    lastName: 'User',
                    memberSince: 'January 2024'
                };
            }

            // Store session
            if (rememberMe) {
                localStorage.setItem('userSession', JSON.stringify(this.currentUser));
            } else {
                sessionStorage.setItem('userSession', JSON.stringify(this.currentUser));
            }

            this.onLoginSuccess();
            
        } catch (error) {
            this.showToast('Login failed. Please check your credentials.', 'error');
        } finally {
            form.classList.remove('loading');
        }
    }

    async handleRegister(form) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!firstName.trim()) {
            this.showFieldError('firstName', 'First name is required');
            return;
        }

        if (!lastName.trim()) {
            this.showFieldError('lastName', 'Last name is required');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showFieldError('registerEmail', 'Please enter a valid email address');
            return;
        }

        // Check if test user email is being used
        if (email === 'test@email.com') {
            this.showFieldError('registerEmail', 'This email is already registered. Please use a different email or try logging in.');
            return;
        }

        if (password.length < 6) {
            this.showFieldError('registerPassword', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            this.showToast('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }

        // Show loading state
        form.classList.add('loading');

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Create user session
            this.currentUser = {
                id: 'user_' + Date.now(),
                email: email,
                firstName: firstName,
                lastName: lastName,
                memberSince: 'January 2024'
            };

            // Store session
            sessionStorage.setItem('userSession', JSON.stringify(this.currentUser));
            
            this.onLoginSuccess();
            
        } catch (error) {
            this.showToast('Registration failed. Please try again.', 'error');
        } finally {
            form.classList.remove('loading');
        }
    }

    onLoginSuccess() {
        this.closeModal();
        this.updateUI();
        this.showToast(`Welcome back, ${this.currentUser.firstName}!`, 'success');
        
        // Clear forms
        this.clearForms();
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    updateUI() {
        // Remove the original click handler
        this.accountBtn.removeEventListener('click', this.originalClickHandler);
        
        // Update account button to show user name with dropdown arrow
        this.accountBtn.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span>${this.currentUser.firstName}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.8rem; margin-left: 0.25rem;"></i>
        `;
        
        // Create dropdown menu
        this.createUserDropdown();
        
        // Add new click handler for dropdown
        this.dropdownClickHandler = (e) => {
            e.preventDefault();
            this.toggleUserDropdown();
        };
        
        this.accountBtn.addEventListener('click', this.dropdownClickHandler);
    }

    createUserDropdown() {
        // Remove existing dropdown if it exists
        const existingDropdown = document.getElementById('userDropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.id = 'userDropdown';
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="user-dropdown-header">
                <i class="fas fa-user-circle"></i>
                <div class="user-info">
                    <div class="dropdown-user-name">${this.currentUser.firstName} ${this.currentUser.lastName}</div>
                    <div class="dropdown-user-email">${this.currentUser.email}</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-menu">
                <a href="dashboard.html" class="dropdown-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#" class="dropdown-item" id="profileDropdownBtn">
                    <i class="fas fa-user-edit"></i>
                    <span>Edit Profile</span>
                </a>
                <a href="booking.html" class="dropdown-item">
                    <i class="fas fa-calendar-plus"></i>
                    <span>Book Appointment</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout-item" id="logoutDropdownBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            </div>
        `;

        // Insert dropdown after account button
        this.accountBtn.parentNode.insertBefore(dropdown, this.accountBtn.nextSibling);

        // Bind dropdown events
        document.getElementById('profileDropdownBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideUserDropdown();
            this.openProfileModal();
        });

        document.getElementById('logoutDropdownBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideUserDropdown();
            this.logout();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !this.accountBtn.contains(e.target)) {
                this.hideUserDropdown();
            }
        });
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    hideUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    logout() {
        // Clear session storage
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        
        // Remove dropdown if it exists
        const existingDropdown = document.getElementById('userDropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Remove dropdown click handler
        if (this.dropdownClickHandler) {
            this.accountBtn.removeEventListener('click', this.dropdownClickHandler);
        }
        
        // Reset UI
        this.currentUser = null;
        this.accountBtn.innerHTML = `
            <i class="fas fa-user"></i> My Account
        `;
        
        // Restore original click handler
        this.accountBtn.addEventListener('click', this.originalClickHandler);
        
        this.showToast('You have been logged out', 'success');
    }

    checkExistingSession() {
        // Check for existing session
        let userData = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUI();
            } catch (error) {
                // Invalid session data, clear it
                localStorage.removeItem('userSession');
                sessionStorage.removeItem('userSession');
            }
        }
    }

    // Utility Methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        
        // Remove existing error
        this.clearFieldError(fieldId);
        
        // Add error class
        field.classList.add('error');
        
        // Add error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error', 'success');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    clearErrors() {
        const errorFields = document.querySelectorAll('.form-control.error, .form-control.success');
        errorFields.forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        const errorMessages = document.querySelectorAll('.field-error');
        errorMessages.forEach(msg => msg.remove());
    }

    clearForms() {
        this.loginForm.querySelector('form').reset();
        this.registerForm.querySelector('form').reset();
        this.clearErrors();
    }

    setupValidation() {
        // Real-time email validation
        ['loginEmail', 'registerEmail'].forEach(id => {
            const field = document.getElementById(id);
            field.addEventListener('blur', () => {
                if (field.value && this.validateEmail(field.value)) {
                    this.clearFieldError(id);
                    field.classList.add('success');
                } else if (field.value) {
                    this.showFieldError(id, 'Please enter a valid email address');
                }
            });
        });

        // Password confirmation validation
        const confirmField = document.getElementById('confirmPassword');
        const passwordField = document.getElementById('registerPassword');
        
        confirmField.addEventListener('blur', () => {
            if (confirmField.value && passwordField.value) {
                if (confirmField.value === passwordField.value) {
                    this.clearFieldError('confirmPassword');
                    confirmField.classList.add('success');
                } else {
                    this.showFieldError('confirmPassword', 'Passwords do not match');
                }
            }
        });
    }

    async simulateApiCall() {
        // Simulate network delay
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    showToast(message, type = 'info') {
        // Use existing toast system if available
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message); // Fallback
        }
    }

    // Profile Modal Methods
    openProfileModal() {
        this.loadProfileData();
        this.profileModal.style.display = 'flex';
        setTimeout(() => {
            this.profileModal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    closeProfileModal() {
        this.profileModal.classList.remove('show');
        setTimeout(() => {
            this.profileModal.style.display = 'none';
            document.body.style.overflow = '';
            this.clearProfileErrors();
        }, 300);
    }

    loadProfileData() {
        if (!this.currentUser) return;

        // Load current user data into form fields
        document.getElementById('editFirstName').value = this.currentUser.firstName || '';
        document.getElementById('editLastName').value = this.currentUser.lastName || '';
        document.getElementById('editEmail').value = this.currentUser.email || '';
        document.getElementById('editPhone').value = this.currentUser.phone || '';
        document.getElementById('editAddress').value = this.currentUser.address || '';
        document.getElementById('editDateOfBirth').value = this.currentUser.dateOfBirth || '';
        document.getElementById('editEmergencyContact').value = this.currentUser.emergencyContact || '';
        document.getElementById('editMedicalConditions').value = this.currentUser.medicalConditions || '';
        document.getElementById('editTreatmentPreferences').value = this.currentUser.treatmentPreferences || '';
        
        // Load checkbox preferences
        document.getElementById('emailNotifications').checked = this.currentUser.emailNotifications !== false;
        document.getElementById('smsNotifications').checked = this.currentUser.smsNotifications === true;
        document.getElementById('marketingEmails').checked = this.currentUser.marketingEmails !== false;
    }

    async handleProfileUpdate(form) {
        // Get form data
        const firstName = document.getElementById('editFirstName').value.trim();
        const lastName = document.getElementById('editLastName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const phone = document.getElementById('editPhone').value.trim();
        const address = document.getElementById('editAddress').value.trim();
        const dateOfBirth = document.getElementById('editDateOfBirth').value;
        const emergencyContact = document.getElementById('editEmergencyContact').value.trim();
        const medicalConditions = document.getElementById('editMedicalConditions').value.trim();
        const treatmentPreferences = document.getElementById('editTreatmentPreferences').value.trim();
        const emailNotifications = document.getElementById('emailNotifications').checked;
        const smsNotifications = document.getElementById('smsNotifications').checked;
        const marketingEmails = document.getElementById('marketingEmails').checked;

        // Validation
        if (!firstName) {
            this.showProfileFieldError('editFirstName', 'First name is required');
            return;
        }

        if (!lastName) {
            this.showProfileFieldError('editLastName', 'Last name is required');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showProfileFieldError('editEmail', 'Please enter a valid email address');
            return;
        }

        // Show loading state
        form.classList.add('loading');

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Update current user data
            this.currentUser = {
                ...this.currentUser,
                firstName,
                lastName,
                email,
                phone,
                address,
                dateOfBirth,
                emergencyContact,
                medicalConditions,
                treatmentPreferences,
                emailNotifications,
                smsNotifications,
                marketingEmails
            };

            // Update stored session
            const storage = localStorage.getItem('userSession') ? localStorage : sessionStorage;
            storage.setItem('userSession', JSON.stringify(this.currentUser));

            // Update UI
            this.updateDropdownUserInfo();

            this.closeProfileModal();
            this.showToast('Profile updated successfully!', 'success');

        } catch (error) {
            this.showToast('Failed to update profile. Please try again.', 'error');
        } finally {
            form.classList.remove('loading');
        }
    }

    updateDropdownUserInfo() {
        // Update dropdown header with new user info
        const userName = document.querySelector('.dropdown-user-name');
        const userEmail = document.querySelector('.dropdown-user-email');
        
        if (userName) {
            userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
        if (userEmail) {
            userEmail.textContent = this.currentUser.email;
        }

        // Update account button text
        this.accountBtn.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span>${this.currentUser.firstName}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.8rem; margin-left: 0.25rem;"></i>
        `;
    }

    showProfileFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        
        // Remove existing error
        this.clearProfileFieldError(fieldId);
        
        // Add error class
        field.classList.add('error');
        
        // Add error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearProfileFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error', 'success');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    clearProfileErrors() {
        const errorFields = this.profileModal.querySelectorAll('.form-control.error, .form-control.success');
        errorFields.forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        const errorMessages = this.profileModal.querySelectorAll('.field-error');
        errorMessages.forEach(msg => msg.remove());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.accountSystem = new AccountSystem();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccountSystem;
} 