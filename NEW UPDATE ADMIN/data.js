/**
 * Initializes room data in localStorage if not present.
 */
function initializeRoomData() {
  const roomNames = ["Room 301", "Room 303", "Room 309", "Room 404", "Room 405"];
  
  const currentData = JSON.parse(localStorage.getItem("roomData"));
  if (currentData && currentData.length !== roomNames.length) {
    localStorage.removeItem("roomData");
  }
  
  if (!localStorage.getItem("roomData")) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["8:00 AM - 11:00 AM", "11:00 AM - 2:00 PM", "2:00 PM - 5:00 PM"];
    const rooms = [];

    roomNames.forEach(name => {
      const schedule = {};
      days.forEach(day => {
        schedule[day] = timeSlots.map(slot => ({
          timeSlot: slot,
          status: Math.random() > 0.5 ? "Occupied" : "Vacant"
        }));
      });
      rooms.push({ name: name, schedule: schedule });
    });

    localStorage.setItem("roomData", JSON.stringify(rooms));
  }
}

/**
 * Initializes the admin account in localStorage if not present.
 */
function initializeAdminAccount() {
  if (!localStorage.getItem("adminAccount")) {
    const adminAccount = {
      email: "admin@granby.ph",
      password: btoa("GCSTPH"), // Encoded default password
      role: "Admin", // Added role field to distinguish admin account
      status: "Active"
    };
    localStorage.setItem("adminAccount", JSON.stringify(adminAccount));
  }
}

initializeRoomData();
initializeAdminAccount();

/**
 * Retrieves room data.
 */
function getRoomData() {
  return JSON.parse(localStorage.getItem("roomData")) || [];
}

/**
 * Updates room status.
 */
function updateRoomStatus(roomName, day, timeSlotIndex, newStatus) {
  const rooms = getRoomData();
  const room = rooms.find(r => r.name === roomName);
  if (room && room.schedule[day] && room.schedule[day][timeSlotIndex]) {
    room.schedule[day][timeSlotIndex].status = newStatus;
    localStorage.setItem("roomData", JSON.stringify(rooms));
  }
}

/**
 * Retrieves stored admin account.
 */
function getAdminAccount() {
  return JSON.parse(localStorage.getItem("adminAccount")) || null;
}

/**
 * Validates login credentials against stored users and admin account.
 * Returns user details including role if login is successful.
 *
 * The function has been updated so that if the email is "admin@granby.ph",
 * only the admin account is used for validation.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {object|null} - Returns user object if login is successful, else null.
 */
function validateLogin(email, password) {
  const adminEmail = "admin@granby.ph";
  let adminAccount = JSON.parse(localStorage.getItem("adminAccount"));
  
  // If the email is admin email, check adminAccount only.
  if (email === adminEmail) {
    if (adminAccount && atob(adminAccount.password) === password) {
      // Ensure the adminAccount role is "Admin"
      if (!adminAccount.role || adminAccount.role !== "Admin") {
        adminAccount.role = "Admin";
        localStorage.setItem("adminAccount", JSON.stringify(adminAccount));
      }
      return adminAccount;
    }
    return null;
  }
  
  // Otherwise, check normal users
  let users = JSON.parse(localStorage.getItem("userData")) || [];
  const user = users.find(user => user.email === email && atob(user.password) === password);
  return user || null;
}

/**
 * Registers a new user.
 * Returns true if the registration was successful, or false if the email already exists.
 *
 * @param {string} email - The new user's email.
 * @param {string} password - The new user's password.
 * @returns {boolean}
 */
function registerUser(email, password) {
  let users = JSON.parse(localStorage.getItem("userData")) || [];
  // Check if the email is already registered in userData
  if (users.some(user => user.email === email)) {
    return false;
  }
  users.push({
    email: email,
    password: btoa(password), // Store encoded password
    role: "User",
    status: "Active"
  });
  localStorage.setItem("userData", JSON.stringify(users));
  return true;
}