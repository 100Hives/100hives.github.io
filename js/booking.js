/**
 * Release Therapies - Booking Page JavaScript
 * This file contains JavaScript functionality specific to the booking page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the booking calendar and time slots
    initBookingCalendar();
    
    // Show/hide insurance details based on checkbox
    const insuranceCheckbox = document.getElementById('insurance');
    const insuranceDetails = document.getElementById('insuranceDetails');
    
    if (insuranceCheckbox && insuranceDetails) {
        insuranceCheckbox.addEventListener('change', function() {
            insuranceDetails.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Check URL parameters for form status messages
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    
    if (status && message) {
        const statusDiv = document.getElementById('formStatus');
        if (statusDiv) {
            statusDiv.classList.add(status === 'error' ? 'error' : 'success');
            statusDiv.textContent = decodeURIComponent(message);
            statusDiv.style.display = 'block';
            
            // Scroll to status message
            statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Pre-select service from URL parameter if available
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect) {
            for (let i = 0; i < serviceSelect.options.length; i++) {
                if (serviceSelect.options[i].value === serviceParam) {
                    serviceSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
    // Initialize the booking form validation
    initBookingFormValidation();
});

// Calendar and Time Slot Functionality
function initBookingCalendar() {
    const calendarDaysContainer = document.getElementById('calendarDays');
    const timeSlotsContainer = document.getElementById('timeSlots');
    const currentMonthElement = document.getElementById('currentMonth');
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentTimeInput = document.getElementById('appointment-time');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    
    if (!calendarDaysContainer || !timeSlotsContainer || !currentMonthElement) {
        console.error('Calendar elements not found:', {
            calendarDaysContainer,
            timeSlotsContainer,
            currentMonthElement
        });
        return; // Elements not found, possibly not on booking page
    }
    
    // Log for debugging
    console.log('Calendar initialized with elements:', {
        calendarDaysContainer,
        timeSlotsContainer,
        appointmentDateInput,
        appointmentTimeInput,
        prevMonthBtn,
        nextMonthBtn
    });
    
    // Current date for reference
    const today = new Date();
    
    // Current displayed month and year (start with current month)
    let currentDisplayMonth = today.getMonth();
    let currentDisplayYear = today.getFullYear();
    
    // Set the current month display
    updateCalendarDisplay();
    
    // Add event listeners for month navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous month button clicked');
            navigateMonth(-1);
        });
    } else {
        console.error('Previous month button not found');
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next month button clicked');
            navigateMonth(1);
        });
    } else {
        console.error('Next month button not found');
    }
    
    // Function to navigate months
    function navigateMonth(direction) {
        console.log(`Navigating month: ${direction > 0 ? 'next' : 'previous'}`);
        console.log(`Current display: ${currentDisplayMonth}/${currentDisplayYear}`);
        
        // Calculate new month and year
        let newMonth = currentDisplayMonth + direction;
        let newYear = currentDisplayYear;
        
        // Handle year change
        if (newMonth < 0) {
            newMonth = 11; // December
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0; // January
            newYear++;
        }
        
        console.log(`New display will be: ${newMonth}/${newYear}`);
        
        // Check if we're trying to navigate to a past month
        const newDate = new Date(newYear, newMonth, 1);
        const currentDate = new Date();
        currentDate.setDate(1); // First day of current month
        currentDate.setHours(0, 0, 0, 0);
        
        if (newDate < currentDate) {
            console.log('Attempted to navigate to past month, operation cancelled');
            // Don't allow navigation to past months
            return;
        }
        
        // Add animation class for transition
        calendarDaysContainer.classList.add('fade-transition');
        
        // Update current display month and year
        currentDisplayMonth = newMonth;
        currentDisplayYear = newYear;
        
        console.log(`Updating calendar to: ${currentDisplayMonth}/${currentDisplayYear}`);
        
        // Update the calendar display
        updateCalendarDisplay();
        
        // Remove animation class after transition
        setTimeout(() => {
            calendarDaysContainer.classList.remove('fade-transition');
        }, 300);
    }
    
    // Function to update the calendar display
    function updateCalendarDisplay() {
        // Update month/year text
        const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
        currentMonthElement.textContent = `${monthNames[currentDisplayMonth]} ${currentDisplayYear}`;
        
        // Generate calendar days for the current display month
        generateCalendarDays(currentDisplayMonth, currentDisplayYear);
        
        // Update prev month button state
        if (prevMonthBtn) {
            // Disable prev button if we're on the current month
            const currentDate = new Date();
            prevMonthBtn.disabled = (currentDisplayYear === currentDate.getFullYear() && 
                                   currentDisplayMonth === currentDate.getMonth());
        }
    }
    
    // Generate initial calendar
    updateCalendarDisplay();
    
    // Generate initial time slots (will be updated when a date is selected)
    generateTimeSlots();
    
    function generateCalendarDays(month, year) {
        // Clear existing calendar days
        while (calendarDaysContainer.firstChild) {
            calendarDaysContainer.removeChild(calendarDaysContainer.firstChild);
        }
        
        // Get the first day of the month
        const firstDay = new Date(year, month, 1).getDay();
        
        // Get the number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get the last day of the previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // Create empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            // Show the day number from previous month but greyed out
            const dayNum = prevMonthLastDay - firstDay + i + 1;
            emptyDay.textContent = dayNum;
            emptyDay.style.color = '#ddd';
            calendarDaysContainer.appendChild(emptyDay);
        }
        
        // Create cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Disable past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date < today) {
                dayElement.classList.add('disabled');
            } else {
                // Add today indicator
                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayElement.classList.add('today');
                }
                
                // Make the day selectable
                dayElement.addEventListener('click', function() {
                    // Remove selected class from all days
                    document.querySelectorAll('.calendar-day.selected').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    // Add selected class to this day
                    this.classList.add('selected');
                    
                    // Update the hidden date input
                    const selectedDate = new Date(year, month, day);
                    const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
                    appointmentDateInput.value = formattedDate;
                    
                    console.log(`Selected date: ${formattedDate}`);
                    console.log(`Time slots container:`, timeSlotsContainer);
                    
                    // Add animation to time slots container
                    timeSlotsContainer.classList.add('fade-transition');
                    
                    // Generate time slots for the selected date
                    generateTimeSlots(selectedDate);
                    
                    // Find the time slots container parent for scrolling
                    const timeSlotsContainerParent = document.querySelector('.time-slots-container');
                    
                    // Scroll to time slots with smooth animation
                    setTimeout(() => {
                        if (timeSlotsContainerParent) {
                            console.log('Scrolling to time slots container');
                            timeSlotsContainerParent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        } else {
                            console.error('Time slots container parent not found for scrolling');
                        }
                        timeSlotsContainer.classList.remove('fade-transition');
                    }, 300);
                    
                    // Show a subtle confirmation message
                    showConfirmationToast(`Selected date: ${monthNames[month]} ${day}, ${year}`);
                });
            }
            
            calendarDaysContainer.appendChild(dayElement);
        }
        
        // Calculate how many days to add from next month to complete the grid
        const totalDaysShown = firstDay + daysInMonth;
        const remainingCells = 7 - (totalDaysShown % 7);
        
        // Only add next month days if we need to complete the last row
        if (remainingCells < 7) {
            for (let i = 1; i <= remainingCells; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day empty';
                emptyDay.textContent = i;
                emptyDay.style.color = '#ddd';
                calendarDaysContainer.appendChild(emptyDay);
            }
        }
        
        // If we have a selected date in this month, highlight it
        if (appointmentDateInput.value) {
            const selectedDate = new Date(appointmentDateInput.value);
            if (selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                const dayElements = calendarDaysContainer.querySelectorAll('.calendar-day:not(.empty)');
                const dayToSelect = dayElements[selectedDate.getDate() - 1];
                if (dayToSelect) {
                    dayToSelect.classList.add('selected');
                }
            }
        }
    }
    
    function generateTimeSlots(selectedDate) {
        console.log('Generating time slots for date:', selectedDate);
        console.log('Time slots container:', timeSlotsContainer);
        
        // Clear existing time slots
        while (timeSlotsContainer.firstChild) {
            timeSlotsContainer.removeChild(timeSlotsContainer.firstChild);
        }
        
        if (!selectedDate) {
            console.log('No date selected, showing message');
            // If no date is selected, show a message
            const message = document.createElement('p');
            message.textContent = 'Please select a date to view available time slots.';
            message.style.gridColumn = '1 / -1';
            message.style.textAlign = 'center';
            message.style.padding = '20px';
            timeSlotsContainer.appendChild(message);
            return;
        }
        
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = selectedDate.getDay();
        console.log(`Selected day of week: ${dayOfWeek}`);
        
        // Define available time slots based on business hours
        let availableSlots = [];
        
        // Monday to Friday: 9:00 AM - 7:00 PM
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            availableSlots = [
                { time: '9:00 AM', price: '£60' },
                { time: '10:00 AM', price: '£60' },
                { time: '11:00 AM', price: '£60' },
                { time: '12:00 PM', price: '£60' },
                { time: '1:00 PM', price: '£60' },
                { time: '2:00 PM', price: '£60' },
                { time: '3:00 PM', price: '£60' },
                { time: '4:00 PM', price: '£60' },
                { time: '5:00 PM', price: '£60' },
                { time: '6:00 PM', price: '£60' }
            ];
        }
        // Saturday: 10:00 AM - 5:00 PM
        else if (dayOfWeek === 6) {
            availableSlots = [
                { time: '10:00 AM', price: '£60' },
                { time: '11:00 AM', price: '£60' },
                { time: '12:00 PM', price: '£60' },
                { time: '1:00 PM', price: '£60' },
                { time: '2:00 PM', price: '£60' },
                { time: '3:00 PM', price: '£60' },
                { time: '4:00 PM', price: '£60' }
            ];
        }
        // Sunday: 10:00 AM - 3:00 PM
        else if (dayOfWeek === 0) {
            availableSlots = [
                { time: '10:00 AM', price: '£60' },
                { time: '11:00 AM', price: '£60' },
                { time: '12:00 PM', price: '£60' },
                { time: '1:00 PM', price: '£60' },
                { time: '2:00 PM', price: '£60' }
            ];
        }
        
        console.log(`Generated ${availableSlots.length} time slots for day ${dayOfWeek}`);
        
        // Apply dynamic pricing based on day of week
        availableSlots = availableSlots.map(slot => {
            let price = 40; // Base price in GBP
            let discount = null;
            
            // Monday-Tuesday: 15% discount
            if (dayOfWeek === 1 || dayOfWeek === 2) {
                price = Math.round(price * 0.85);
                discount = '15%';
            }
            // Wednesday-Thursday: standard rate
            else if (dayOfWeek === 3 || dayOfWeek === 4) {
                // Standard rate, no change
            }
            // Friday: 15% premium
            else if (dayOfWeek === 5) {
                price = Math.round(price * 1.15);
                discount = null;
            }
            // Saturday: 30% premium
            else if (dayOfWeek === 6) {
                price = Math.round(price * 1.3);
                discount = null;
            }
            // Sunday: 50% premium
            else if (dayOfWeek === 0) {
                price = Math.round(price * 1.5);
                discount = null;
            }
            
            return {
                ...slot,
                price: `£${price}`,
                discount: discount
            };
        });
        
        // Add a variety of discounts for visual effect (in a real app, this would come from the backend)
        const discountOptions = ['15%', '30%', '50%'];
        const discountIndices = [];
        for (let i = 0; i < Math.min(5, availableSlots.length); i++) {
            const randomIndex = Math.floor(Math.random() * availableSlots.length);
            if (!discountIndices.includes(randomIndex)) {
                discountIndices.push(randomIndex);
                // Select a random discount percentage from the options
                const randomDiscountIndex = Math.floor(Math.random() * discountOptions.length);
                availableSlots[randomIndex].discount = discountOptions[randomDiscountIndex];
            }
        }
        
        // Create time slot elements
        console.log(`Creating ${availableSlots.length} time slot elements`);
        availableSlots.forEach((slot, index) => {
            const timeSlotElement = document.createElement('div');
            timeSlotElement.className = 'time-slot';
            
            const timeElement = document.createElement('div');
            timeElement.className = 'time-slot-time';
            timeElement.textContent = slot.time;
            
            const priceElement = document.createElement('div');
            priceElement.className = 'time-slot-price';
            priceElement.textContent = slot.price;
            
            timeSlotElement.appendChild(timeElement);
            timeSlotElement.appendChild(priceElement);
            
            // Add discount badge if applicable
            if (slot.discount) {
                const discountBadge = document.createElement('div');
                discountBadge.className = 'discount-badge';
                discountBadge.textContent = slot.discount;
                
                // Set data-discount attribute for color differentiation
                discountBadge.setAttribute('data-discount', slot.discount);
                
                timeSlotElement.appendChild(discountBadge);
            }
            
            // Make the time slot selectable
            timeSlotElement.addEventListener('click', function() {
                console.log(`Time slot selected: ${slot.time} - ${slot.price}`);
                
                // Remove selected class from all time slots
                document.querySelectorAll('.time-slot.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Add selected class to this time slot
                this.classList.add('selected');
                
                // Update the hidden time input
                appointmentTimeInput.value = slot.time;
                
                // Show a subtle confirmation message
                showConfirmationToast(`Selected time: ${slot.time} - ${slot.price}`);
            });
            
            console.log(`Adding time slot ${index + 1}: ${slot.time} - ${slot.price}`);
            timeSlotsContainer.appendChild(timeSlotElement);
        });
        
        console.log(`Time slots container now has ${timeSlotsContainer.childNodes.length} children`);
    }
    
    // Add this function at the end of initBookingCalendar
    function showConfirmationToast(message) {
        // Check if a toast container already exists
        let toastContainer = document.querySelector('.toast-container');
        
        // If not, create one
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create the toast element
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        
        // Add the toast to the container
        toastContainer.appendChild(toast);
        
        // Trigger the animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove the toast after it fades out
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize the booking form validation
function initBookingFormValidation() {
    const bookingForm = document.getElementById('booking-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitButton = document.querySelector('#booking-form button[type="submit"]');
    
    if (!bookingForm) return;
    
    // Add input event listeners for real-time validation
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);
    
    // Form submission handler
    bookingForm.addEventListener('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isDateSelected = validateDateSelection();
        const isTimeSelected = validateTimeSelection();
        
        // If all validations pass
        if (isNameValid && isEmailValid && isPhoneValid && isDateSelected && isTimeSelected) {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
            
            // Show loading overlay
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.classList.add('show');
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                // Hide loading overlay
                loadingOverlay.classList.remove('show');
                
                // Show success message
                showFormStatus('success', 'Your booking request has been submitted successfully! We will contact you shortly to confirm your appointment.');
                
                // Reset form
                bookingForm.reset();
                document.querySelectorAll('.calendar-day.selected, .time-slot.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Book Appointment';
                
                // Scroll to success message
                document.querySelector('.form-status').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 2000);
        } else {
            // Show error message
            showFormStatus('error', 'Please fill in all required fields correctly.');
            
            // Focus on the first invalid field
            if (!isNameValid) nameInput.focus();
            else if (!isEmailValid) emailInput.focus();
            else if (!isPhoneValid) phoneInput.focus();
            else if (!isDateSelected) document.querySelector('.calendar-container').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            else if (!isTimeSelected) document.querySelector('.time-slots-container').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
    
    // Validation functions
    function validateName() {
        const name = nameInput.value.trim();
        const isValid = name.length >= 2;
        
        if (isValid) {
            nameInput.classList.remove('error');
            nameInput.classList.add('valid');
        } else {
            nameInput.classList.remove('valid');
            if (name.length > 0) nameInput.classList.add('error');
        }
        
        return isValid;
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        if (isValid) {
            emailInput.classList.remove('error');
            emailInput.classList.add('valid');
        } else {
            emailInput.classList.remove('valid');
            if (email.length > 0) emailInput.classList.add('error');
        }
        
        return isValid;
    }
    
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
        const isValid = phoneRegex.test(phone);
        
        if (isValid) {
            phoneInput.classList.remove('error');
            phoneInput.classList.add('valid');
        } else {
            phoneInput.classList.remove('valid');
            if (phone.length > 0) phoneInput.classList.add('error');
        }
        
        return isValid;
    }
    
    function validateDateSelection() {
        const dateInput = document.getElementById('appointment-date');
        const isValid = dateInput.value.trim() !== '';
        
        if (!isValid) {
            // Highlight calendar section
            document.querySelector('.calendar-container').classList.add('highlight-section');
            setTimeout(() => {
                document.querySelector('.calendar-container').classList.remove('highlight-section');
            }, 1500);
        }
        
        return isValid;
    }
    
    function validateTimeSelection() {
        const timeInput = document.getElementById('appointment-time');
        const isValid = timeInput.value.trim() !== '';
        
        if (!isValid) {
            // Highlight time slots section
            document.querySelector('.time-slots-container').classList.add('highlight-section');
            setTimeout(() => {
                document.querySelector('.time-slots-container').classList.remove('highlight-section');
            }, 1500);
        }
        
        return isValid;
    }
}

// Function to show form status messages
function showFormStatus(type, message) {
    // Find or create form status element
    let formStatus = document.querySelector('.form-status');
    
    if (!formStatus) {
        formStatus = document.createElement('div');
        formStatus.className = 'form-status';
        document.getElementById('booking-form').prepend(formStatus);
    }
    
    // Set message and class
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    
    // Add animation
    formStatus.style.opacity = '0';
    formStatus.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        formStatus.style.opacity = '1';
        formStatus.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            formStatus.style.opacity = '0';
            formStatus.style.transform = 'translateY(-10px)';
        }, 5000);
    }
}
