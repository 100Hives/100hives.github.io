/**
 * Dashboard System
 * Handles user dashboard functionality and data loading
 */

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        this.checkUserSession();
        
        if (this.currentUser) {
            this.loadDashboardData();
            this.bindEvents();
        } else {
            this.redirectToLogin();
        }
    }

    checkUserSession() {
        // Get user session data
        let userData = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
            } catch (error) {
                console.error('Invalid session data');
            }
        }
    }

    redirectToLogin() {
        // Redirect to homepage and show login modal
        window.location.href = 'index.html';
    }

    loadDashboardData() {
        // Update user information
        this.updateUserInfo();
        
        // Load appointments
        this.loadAppointments();
        
        // Load recent activity
        this.loadRecentActivity();
        
        // Load treatment progress
        this.loadTreatmentProgress();
        
        // Load notifications
        this.loadNotifications();
    }

    updateUserInfo() {
        const userName = document.getElementById('userName');
        const fullName = document.getElementById('fullName');
        const userEmail = document.getElementById('userEmail');
        const memberSince = document.getElementById('memberSince');

        if (userName) userName.textContent = this.currentUser.firstName;
        if (fullName) fullName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        if (userEmail) userEmail.textContent = this.currentUser.email;
        if (memberSince) memberSince.textContent = this.formatMemberSince();
    }

    formatMemberSince() {
        // Use memberSince from user data if available
        if (this.currentUser && this.currentUser.memberSince) {
            return this.currentUser.memberSince;
        }
        
        // Fallback: use current month
        const date = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    loadAppointments() {
        // Mock appointment data - later this would come from an API
        const mockAppointments = [
            {
                id: 1,
                service: 'Deep Tissue Massage',
                date: this.getNextDate(7), // 7 days from now
                time: '2:00 PM - 3:00 PM',
                location: 'Feltham ASDA Clinic',
                type: 'clinic'
            },
            {
                id: 2,
                service: 'Sports Rehabilitation',
                date: this.getNextDate(21), // 21 days from now
                time: '10:00 AM - 11:00 AM',
                location: 'Mobile Service',
                type: 'mobile'
            }
        ];

        this.renderAppointments(mockAppointments);
    }

    getNextDate(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date;
    }

    renderAppointments(appointments) {
        const container = document.getElementById('upcomingAppointments');
        const noAppointments = document.querySelector('.no-appointments');
        
        if (appointments.length === 0) {
            container.style.display = 'none';
            noAppointments.style.display = 'block';
            return;
        }

        container.innerHTML = '';
        appointments.forEach(appointment => {
            const appointmentElement = this.createAppointmentElement(appointment);
            container.appendChild(appointmentElement);
        });
    }

    createAppointmentElement(appointment) {
        const div = document.createElement('div');
        div.className = 'appointment-item upcoming';
        
        const locationIcon = appointment.type === 'mobile' ? 'fas fa-home' : 'fas fa-map-marker-alt';
        
        div.innerHTML = `
            <div class="appointment-date">
                <span class="day">${appointment.date.getDate()}</span>
                <span class="month">${this.getMonthName(appointment.date)}</span>
            </div>
            <div class="appointment-details">
                <h4>${appointment.service}</h4>
                <p><i class="fas fa-clock"></i> ${appointment.time}</p>
                <p><i class="${locationIcon}"></i> ${appointment.location}</p>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-sm btn-outline" onclick="dashboard.rescheduleAppointment(${appointment.id})">
                    Reschedule
                </button>
            </div>
        `;
        
        return div;
    }

    getMonthName(date) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[date.getMonth()];
    }

    loadRecentActivity() {
        // Mock activity data
        const activities = [
            {
                type: 'completed',
                title: 'Deep Tissue Massage completed',
                description: `${this.getRelativeDate(-3)} - Great session focusing on shoulder tension`,
                icon: 'fas fa-check'
            },
            {
                type: 'booked',
                title: 'New appointment booked',
                description: `${this.getRelativeDate(-8)} - Sports Rehabilitation session scheduled`,
                icon: 'fas fa-calendar-plus'
            },
            {
                type: 'profile',
                title: 'Profile updated',
                description: `${this.getRelativeDate(-15)} - Contact information updated`,
                icon: 'fas fa-user-edit'
            }
        ];

        this.renderActivity(activities);
    }

    getRelativeDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() + daysAgo);
        return date.toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    renderActivity(activities) {
        const container = document.querySelector('.activity-list');
        container.innerHTML = '';
        
        activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            
            activityElement.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-details">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
            `;
            
            container.appendChild(activityElement);
        });
    }

    loadTreatmentProgress() {
        // Mock progress data
        const progressData = {
            totalSessions: 12,
            thisMonth: 3,
            progressScore: 85,
            latestNote: "Significant improvement in shoulder mobility. Continue with current treatment plan and exercises."
        };

        this.renderProgress(progressData);
    }

    renderProgress(data) {
        const statNumbers = document.querySelectorAll('.stat-number');
        const progressNote = document.querySelector('.progress-note p');
        
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = data.totalSessions;
            statNumbers[1].textContent = data.thisMonth;
            statNumbers[2].textContent = data.progressScore + '%';
        }
        
        if (progressNote) {
            progressNote.innerHTML = `<strong>Latest Note:</strong> ${data.latestNote}`;
        }
    }

    loadNotifications() {
        // Mock notifications
        const notifications = [
            {
                type: 'reminder',
                title: 'Appointment Reminder',
                message: 'You have an appointment tomorrow at 2:00 PM',
                time: '2 hours ago',
                unread: true,
                icon: 'fas fa-calendar-check'
            },
            {
                type: 'feedback',
                title: 'Session Feedback',
                message: 'Please rate your last session to help us improve',
                time: '1 day ago',
                unread: true,
                icon: 'fas fa-star'
            }
        ];

        this.renderNotifications(notifications);
    }

    renderNotifications(notifications) {
        const container = document.querySelector('.notification-list');
        const badge = document.querySelector('.notification-badge');
        
        const unreadCount = notifications.filter(n => n.unread).length;
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'inline' : 'none';
        }
        
        container.innerHTML = '';
        notifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification-item ${notification.unread ? 'unread' : ''}`;
            
            notificationElement.innerHTML = `
                <div class="notification-icon">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            `;
            
            container.appendChild(notificationElement);
        });
    }

    bindEvents() {
        // Quick action buttons
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showEditProfile();
            });
        }

        // Quick links
        this.bindQuickLinks();
        
        // Card actions
        this.bindCardActions();
    }

    bindQuickLinks() {
        const quickLinks = {
            'viewHistoryLink': () => this.showAppointmentHistory(),
            'downloadReportsLink': () => this.downloadReports(),
            'paymentMethodsLink': () => this.showPaymentMethods()
        };

        Object.keys(quickLinks).forEach(linkId => {
            const link = document.getElementById(linkId);
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    quickLinks[linkId]();
                });
            }
        });
    }

    bindCardActions() {
        // Activity "View All" link
        const viewAllActivity = document.querySelector('.recent-activity .card-action');
        if (viewAllActivity) {
            viewAllActivity.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAllActivity();
            });
        }
    }

    // Action handlers
    rescheduleAppointment(appointmentId) {
        this.showToast('Rescheduling feature coming soon!', 'info');
    }

    showEditProfile() {
        this.showToast('Profile editing feature coming soon!', 'info');
    }

    showAppointmentHistory() {
        this.showToast('Appointment history feature coming soon!', 'info');
    }

    downloadReports() {
        this.showToast('Report download feature coming soon!', 'info');
    }

    showPaymentMethods() {
        this.showToast('Payment methods feature coming soon!', 'info');
    }

    showAllActivity() {
        this.showToast('Full activity history coming soon!', 'info');
    }

    showToast(message, type = 'info') {
        // Use existing toast system if available
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message); // Fallback
        }
    }

    // Utility methods
    refreshDashboard() {
        this.loadDashboardData();
    }

    logout() {
        // Clear session and redirect
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        window.location.href = 'index.html';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new Dashboard();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
} 