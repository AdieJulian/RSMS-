document.addEventListener('DOMContentLoaded', function() {
    // Main Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const currentSection = document.getElementById('current-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('onclick')) return; // Skip if it has onclick handler (logout)
            
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            // Update breadcrumb
            currentSection.textContent = link.textContent.trim();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            link.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Schedule Tab Switching
    const scheduleTabs = document.querySelectorAll('.schedule-tabs .tab');
    scheduleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and views
            scheduleTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.schedule-view').forEach(view => view.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding view
            tab.classList.add('active');
            const viewType = tab.getAttribute('data-view');
            document.querySelector(`.${viewType}-view`).classList.add('active');
            
            // Load content for the selected view
            loadScheduleView(viewType);
        });
    });

    // Quick Actions
    function toggleQuickActions() {
        const dropdown = document.getElementById('quickActionsDropdown');
        dropdown.classList.toggle('show');
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.quick-actions')) {
            document.getElementById('quickActionsDropdown').classList.remove('show');
        }
    });

    // Make functions globally available
    window.toggleQuickActions = toggleQuickActions;

    // Load schedule content based on view type
    function loadScheduleView(viewType) {
        const viewElement = document.querySelector(`.${viewType}-view`);
        
        switch(viewType) {
            case 'week':
                loadWeekView(viewElement);
                break;
            case 'month':
                loadMonthView(viewElement);
                break;
            // Day view is static for now
        }
    }

    function loadWeekView(element) {
        // Sample week view data
        const weekData = [
            { day: 'Monday', classes: [
                { time: '8:00 AM - 9:30 AM', subject: 'Information Management', room: 'Room 309' },
                { time: '10:00 AM - 11:30 AM', subject: 'Web Development', room: 'Room 310' }
            ]},
            { day: 'Wednesday', classes: [
                { time: '1:00 PM - 2:30 PM', subject: 'DSA', room: 'Room 404' }
            ]},
            // Add more days as needed
        ];

        let html = '<div class="week-schedule">';
        weekData.forEach(day => {
            html += `
                <div class="day-block">
                    <h4>${day.day}</h4>
                    ${day.classes.map(cls => `
                        <div class="schedule-item">
                            <div class="time-block">
                                <div class="time-indicator">
                                    <span class="time">${cls.time}</span>
                                </div>
                                <div class="class-details">
                                    <span class="subject">${cls.subject}</span>
                                    <span class="room"><i class="fas fa-door-open"></i> ${cls.room}</span>
                                </div>
                            </div>
                </div>
                        `).join('')}
                </div>
            `;
        });
        html += '</div>';
        element.innerHTML = html;
    }

    function loadMonthView(element) {
        // Sample month view implementation
        const currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let html = `
            <div class="month-header">
                <h4>${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}</h4>
            </div>
            <div class="month-calendar">
                <!-- Calendar grid will be generated here -->
            </div>
        `;
        element.innerHTML = html;
    }

    // Logout Handler
    window.handleLogout = function() {
        if (confirm('Are you sure you want to logout?')) {
            // Add logout logic here
            window.location.href = 'login.html';
        }
    }

    // Rooms Management
    const roomSearch = document.getElementById('roomSearch');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const roomTableBody = document.getElementById('roomTableBody');

    // Sample room data
    const roomsData = [
        {
            name: 'Room 310 (AVR)',
            status: 'available',
            timeSlot: 'N/A',
            date: 'N/A',
            lastUpdated: '2 mins ago'
        },
        {
            name: 'Room 309',
            status: 'occupied',
            timeSlot: '10:00 AM - 11:30 AM',
            date: '2024-03-21',
            lastUpdated: '5 mins ago'
        },
        {
            name: 'Room 303',
            status: 'available',
            timeSlot: 'N/A',
            date: 'N/A',
            lastUpdated: '1 min ago'
        },
        {
            name: 'Room 404',
            status: 'available',
            timeSlot: 'N/A',
            date: 'N/A',
            lastUpdated: '3 mins ago'
        },
        {
            name: 'Room 405',
            status: 'occupied',
            timeSlot: '1:00 PM - 2:30 PM',
            date: '2024-03-21',
            lastUpdated: '7 mins ago'
        }
    ];

    // Initialize room table
    function initializeRoomTable() {
        updateRoomTable(roomsData);
    }

    // Update room table based on search and filter
    function updateRoomTable(data) {
        const searchTerm = roomSearch.value.toLowerCase();
        const filterValue = availabilityFilter.value;

        const filteredData = data.filter(room => {
            const matchesSearch = room.name.toLowerCase().includes(searchTerm);
            const matchesFilter = filterValue === 'all' || room.status === filterValue;
            return matchesSearch && matchesFilter;
        });

        roomTableBody.innerHTML = filteredData.map(room => `
            <tr>
                <td>${room.name}</td>
                <td>
                    <span class="status ${room.status}">
                        ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </span>
                </td>
                <td>${room.timeSlot}</td>
                <td>${room.date}</td>
                <td>${room.lastUpdated}</td>
            </tr>
        `).join('');

        // Update room cards
        updateRoomCards(filteredData);
    }

    // Update room cards based on filtered data
    function updateRoomCards(data) {
        const roomCards = document.querySelectorAll('.room-card');
        roomCards.forEach(card => {
            const roomNumber = card.dataset.room;
            const roomData = data.find(r => r.name.includes(roomNumber));
            if (roomData) {
                const statusIndicator = card.querySelector('.status-indicator');
                statusIndicator.className = `status-indicator ${roomData.status}`;
            }
        });
    }

    // Event listeners for search and filter
    roomSearch.addEventListener('input', () => {
        updateRoomTable(roomsData);
    });

    availabilityFilter.addEventListener('change', () => {
        updateRoomTable(roomsData);
    });

    // Initialize rooms
    initializeRoomTable();

    // Simulated real-time updates
    setInterval(() => {
        // Simulate status changes
        roomsData.forEach(room => {
            if (Math.random() > 0.8) { // 20% chance to change status
                room.status = room.status === 'available' ? 'occupied' : 'available';
                room.timeSlot = room.status === 'occupied' ? 
                    `${new Date().getHours()}:00 - ${new Date().getHours() + 1}:00` : 'N/A';
                room.date = room.status === 'occupied' ? 
                    new Date().toISOString().split('T')[0] : 'N/A';
                room.lastUpdated = 'Just now';
            }
        });
        updateRoomTable(roomsData);
    }, 30000); // Update every 30 seconds

    // Room Booking Functions
    function openRoomRequestModal() {
        const modal = document.getElementById('roomRequestModal');
        modal.classList.add('show');
    }

    function openAvailabilityModal() {
        const modal = document.getElementById('availabilityModal');
        modal.classList.add('show');
        checkRoomAvailability(); // Load initial availability
    }

    function openRoomFeaturesModal() {
        const modal = document.getElementById('roomFeaturesModal');
        modal.classList.add('show');
        showRoomFeatures('310'); // Show initial room features
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }

    // Room request handling
    function handleRoomRequest(event) {
        event.preventDefault();
        
        const room = document.getElementById('requestRoom').value;
        const date = document.getElementById('requestDate').value;
        const startTime = document.getElementById('requestTimeStart').value;
        const endTime = document.getElementById('requestTimeEnd').value;
        const purpose = document.getElementById('requestPurpose').value;

        // Validate time range
        if (startTime >= endTime) {
            alert('End time must be after start time');
            return;
        }

        // Here you would typically send this data to a server
        // For now, we'll just show a success message
        alert(`Room request submitted successfully!\n\nRoom: ${room}\nDate: ${date}\nTime: ${startTime} - ${endTime}\nPurpose: ${purpose}`);
        
        closeModal('roomRequestModal');
        document.getElementById('roomRequestForm').reset();
    }

    // Room availability checking
    function checkRoomAvailability() {
        const date = document.getElementById('availabilityDate').value || new Date().toISOString().split('T')[0];
        const timeline = document.querySelector('.room-timeline');
        
        // Sample availability data (would typically come from a server)
        const availabilityData = [
            { room: '310', time: '8:00 AM - 9:30 AM', status: 'available' },
            { room: '310', time: '10:00 AM - 11:30 AM', status: 'occupied' },
            { room: '309', time: '8:00 AM - 9:30 AM', status: 'occupied' },
            { room: '309', time: '10:00 AM - 11:30 AM', status: 'available' },
            { room: '303', time: '8:00 AM - 9:30 AM', status: 'available' },
            { room: '404', time: '1:00 PM - 2:30 PM', status: 'occupied' },
            { room: '405', time: '1:00 PM - 2:30 PM', status: 'available' }
        ];

        let html = '';
        availabilityData.forEach(slot => {
            html += `
                <div class="timeline-slot ${slot.status}">
                    <div class="slot-info">
                        <strong>Room ${slot.room}</strong>
                        <span>${slot.time}</span>
                        <span class="status-badge">${slot.status}</span>
                    </div>
                </div>
            `;
        });

        timeline.innerHTML = html;
    }

    // Room features display
    const roomFeatures = {
        '310': {
            name: 'Room 310 (AVR)',
            capacity: 40,
            features: [
                'Audio-Visual Equipment',
                'Smart Board',
                'Air Conditioning',
                'Computer Station',
                'Internet Connection'
            ]
        },
        '309': {
            name: 'Room 309',
            capacity: 30,
            features: [
                'Whiteboard',
                'Air Conditioning',
                'Internet Connection'
            ]
        },
        '303': {
            name: 'Room 303',
            capacity: 35,
            features: [
                'Whiteboard',
                'Air Conditioning',
                'Internet Connection'
            ]
        },
        '404': {
            name: 'Room 404',
            capacity: 45,
            features: [
                'Smart Board',
                'Air Conditioning',
                'Computer Lab Setup',
                'Internet Connection'
            ]
        },
        '405': {
            name: 'Room 405',
            capacity: 40,
            features: [
                'Whiteboard',
                'Air Conditioning',
                'Internet Connection'
            ]
        }
    };

    function showRoomFeatures(roomNumber) {
        const content = document.querySelector('.room-feature-content');
        const room = roomFeatures[roomNumber];
        const tabs = document.querySelectorAll('.feature-tab');
        
        // Update active tab
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.room === roomNumber) {
                tab.classList.add('active');
            }
        });

        // Display room features
        content.innerHTML = `
            <h3>${room.name}</h3>
            <p><strong>Capacity:</strong> ${room.capacity} students</p>
            <div class="features-list">
                <h4>Features:</h4>
                <ul>
                    ${room.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Add event listeners for room feature tabs
    document.querySelectorAll('.feature-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            showRoomFeatures(tab.dataset.room);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Schedule Upload Functionality
    const organizationMethod = document.getElementsByName('organizationMethod');
    const manualFolderGroup = document.getElementById('manualFolderGroup');
    const scheduleUploadForm = document.getElementById('scheduleUploadForm');
    const fileInput = document.getElementById('scheduleFile');
    const uploadedSchedulesList = document.getElementById('uploadedSchedulesList');

    // Toggle manual folder input based on organization method
    if (organizationMethod) {
        organizationMethod.forEach(radio => {
            radio.addEventListener('change', function() {
                manualFolderGroup.style.display = this.value === 'manual' ? 'block' : 'none';
                if (this.value === 'manual') {
                    document.getElementById('manualFolder').setAttribute('required', '');
                } else {
                    document.getElementById('manualFolder').removeAttribute('required');
                }
            });
        });
    }

    // Handle drag and drop functionality
    const dropZone = document.querySelector('.file-upload-container');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('highlight');
        }

        function unhighlight(e) {
            dropZone.classList.remove('highlight');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            updateFileInfo(files[0]);
        }
    }

    // Update file information when file is selected
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                updateFileInfo(this.files[0]);
            }
        });
    }

    function updateFileInfo(file) {
        const fileInfo = dropZone.querySelector('.file-upload-info');
        fileInfo.innerHTML = `
            <i class="fas fa-file-alt"></i>
            <p>${file.name}</p>
            <span>${formatFileSize(file.size)}</span>
        `;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Handle form submission
    if (scheduleUploadForm) {
        scheduleUploadForm.addEventListener('submit', handleScheduleUpload);
    }

    function handleScheduleUpload(e) {
        e.preventDefault();

        const formData = new FormData(scheduleUploadForm);
        const title = document.getElementById('scheduleTitle').value;
        const term = document.getElementById('scheduleTerm').value;
        const year = document.getElementById('scheduleYear').value;
        const file = document.getElementById('scheduleFile').files[0];
        const organizationMethod = document.querySelector('input[name="organizationMethod"]:checked').value;
        const notes = document.getElementById('scheduleNotes').value;

        // Create folder path based on organization method
        let folderPath;
        if (organizationMethod === 'auto') {
            const facultyName = 'John Doe'; // Replace with actual faculty name from session
            folderPath = `${facultyName}/${term} ${year}`;
        } else {
            folderPath = document.getElementById('manualFolder').value;
        }

        // Simulate upload process
        showUploadProgress();

        // Simulate server upload delay
        setTimeout(() => {
            // Add to uploaded schedules list
            addToUploadedSchedules({
                title: title,
                term: term,
                year: year,
                folder: folderPath,
                date: new Date().toLocaleDateString(),
                file: file.name
            });

            // Reset form and show success message
            scheduleUploadForm.reset();
            dropZone.querySelector('.file-upload-info').innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop your file here or click to browse</p>
                <span>Supported formats: JPEG, PNG, PDF</span>
            `;
            
            showNotification('Schedule uploaded successfully!', 'success');
        }, 2000);
    }

    function showUploadProgress() {
        const uploadBtn = document.querySelector('.upload-btn');
        uploadBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Uploading...
        `;
        uploadBtn.disabled = true;

        setTimeout(() => {
            uploadBtn.innerHTML = `
                <i class="fas fa-upload"></i>
                Upload Schedule
            `;
            uploadBtn.disabled = false;
        }, 2000);
    }

    function addToUploadedSchedules(schedule) {
        const scheduleElement = document.createElement('div');
        scheduleElement.className = 'uploaded-schedule-item';
        scheduleElement.innerHTML = `
            <div class="schedule-info">
                <h4>${schedule.title}</h4>
                <p>
                    <i class="fas fa-folder"></i> ${schedule.folder}<br>
                    <i class="fas fa-calendar"></i> ${schedule.term} ${schedule.year}<br>
                    <i class="fas fa-clock"></i> Uploaded on ${schedule.date}
                </p>
            </div>
            <div class="schedule-actions">
                <button class="view-btn" onclick="viewSchedule('${schedule.file}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="delete-btn" onclick="deleteSchedule(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        uploadedSchedulesList.insertBefore(scheduleElement, uploadedSchedulesList.firstChild);
    }

    // Settings Form Handling
    const profileSettingsForm = document.getElementById('profileSettingsForm');
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');

    if (profileSettingsForm) {
        profileSettingsForm.addEventListener('submit', handleProfileUpdate);
    }

    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', handleNotificationUpdate);
    }

    function handleProfileUpdate(e) {
        e.preventDefault();
        
        const displayName = document.getElementById('displayName').value;
        const email = document.getElementById('email').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate form
        if (!displayName || !email) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Check if password change is requested
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('Please fill in all password fields to change password', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }

            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }
        }

        // Simulate API call
        showSavingIndicator(profileSettingsForm);
        
        setTimeout(() => {
            // Update the profile information
            document.querySelector('.user-info h3').textContent = displayName;
            document.querySelector('.user-info p').textContent = email;

            // Clear password fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';

            hideSavingIndicator(profileSettingsForm);
            showNotification('Profile settings updated successfully', 'success');
        }, 1500);
    }

    function handleNotificationUpdate(e) {
        e.preventDefault();

        const roomRequestNotifications = document.querySelector('input[name="roomRequestNotifications"]').checked;
        const scheduleUpdateNotifications = document.querySelector('input[name="scheduleUpdateNotifications"]').checked;

        // Simulate API call
        showSavingIndicator(notificationSettingsForm);

        setTimeout(() => {
            hideSavingIndicator(notificationSettingsForm);
            showNotification('Notification preferences updated successfully', 'success');
        }, 1500);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showSavingIndicator(form) {
        const submitBtn = form.querySelector('.save-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
    }

    function hideSavingIndicator(form) {
        const submitBtn = form.querySelector('.save-btn');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        submitBtn.disabled = false;
    }
});

// View schedule function
function viewSchedule(fileName) {
    // Implement schedule viewing functionality
    showNotification(`Viewing schedule: ${fileName}`, 'info');
}

// Delete schedule function
function deleteSchedule(button) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        button.closest('.uploaded-schedule-item').remove();
        showNotification('Schedule deleted successfully!', 'success');
    }
}

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(styleSheet);
