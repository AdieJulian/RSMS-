document.addEventListener("DOMContentLoaded", function () {
  // 🌐 Tab Switching Elements
  const userManagementTab = document.getElementById("userManagementTab");
  const roomManagementTab = document.getElementById("roomManagementTab");
  const accountManagementTab = document.getElementById("accountManagementTab");
  const userManagementContent = document.getElementById("userManagementContent");
  const accountManagementContent = document.getElementById("accountManagementContent");

  userManagementTab.addEventListener("click", () => setActiveTab("userManagement"));
  accountManagementTab.addEventListener("click", () => setActiveTab("accountManagement"));
  roomManagementTab.addEventListener("click", () =>
    alert("Room Management is under development.")
  );

  function setActiveTab(tabName) {
    document.querySelectorAll(".settings-tab").forEach((btn) =>
      btn.classList.remove("active")
    );
    userManagementContent.style.display = "none";
    accountManagementContent.style.display = "none";

    if (tabName === "userManagement") {
      userManagementTab.classList.add("active");
      userManagementContent.style.display = "flex";
    } else if (tabName === "accountManagement") {
      accountManagementTab.classList.add("active");
      accountManagementContent.style.display = "grid"; // Uses new grid layout
    }
  }

  // 🟡 Account Management Section Handling
  const resetDefaultBtn = document.getElementById("resetDefaultBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // 🔑 Change Password Form Handling
  const changePasswordForm = document.getElementById("changePasswordForm");
  changePasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    let adminAccount = JSON.parse(localStorage.getItem("adminAccount"));
    if (currentPassword !== atob(adminAccount.password)) {
      alert("❌ Incorrect current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("⚠️ New passwords do not match.");
      return;
    }

    adminAccount.password = btoa(newPassword);
    localStorage.setItem("adminAccount", JSON.stringify(adminAccount));
    alert("✅ Password updated successfully.");
    changePasswordForm.reset();
  });

  // 🔄 Reset Default Password Handling
  resetDefaultBtn.addEventListener("click", function () {
    let adminAccount = JSON.parse(localStorage.getItem("adminAccount"));
    adminAccount.password = btoa("GCSTPH");
    localStorage.setItem("adminAccount", JSON.stringify(adminAccount));
    alert("✅ Password has been reset to default (GCSTPH).");
  });

  // 🚪 Logout Handling
  logoutBtn.addEventListener("click", function () {
    window.location.href = "log_in.html";
  });

  // 🔹 Default Active Tab
  setActiveTab("userManagement");

  // 🛠️ User Management (Create User Modal)
  const createUserBtn = document.getElementById("createUserBtn");
  const userModal = document.getElementById("userModal");
  const createUserForm = document.getElementById("createUserForm");

  createUserBtn.addEventListener("click", function (e) {
    e.preventDefault();
    userModal.style.display = "flex";
  });

  window.addEventListener("click", function (event) {
    if (event.target === userModal) {
      closeModal();
    }
  });

  createUserForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (email && password && role) {
      addUser(email, password, role);
      closeModal();
      loadUserData();
    }
  });

  // Event listeners for search & filter controls
  const searchInputField = document.getElementById("searchEmail");
  const filterRoleSelect = document.getElementById("filterRole");

  if (searchInputField) {
    searchInputField.addEventListener("input", loadUserData);
  }
  if (filterRoleSelect) {
    filterRoleSelect.addEventListener("change", loadUserData);
  }

  // 🛠️ Load Existing Users with Filtering & Inline Role Edit
  loadUserData();
});

function closeModal() {
  document.getElementById("userModal").style.display = "none";
  document.getElementById("createUserForm").reset();
}

/* 🛠️ User Management Functions */
function addUser(email, password, role) {
  let users = JSON.parse(localStorage.getItem("userData")) || [];
  const newUser = {
    email: email,
    password: btoa(password),
    role: role,
    status: "Active",
  };
  users.push(newUser);
  localStorage.setItem("userData", JSON.stringify(users));
}

/* Updated loadUserData: Remove Status column, add inline role editing and filtering */
function loadUserData() {
  let users = JSON.parse(localStorage.getItem("userData")) || [];

  // Apply filtering from search and filter controls if they exist
  const searchInput = document.getElementById("searchEmail");
  const roleFilter = document.getElementById("filterRole");

  if (searchInput) {
    const query = searchInput.value.toLowerCase().trim();
    users = users.filter((user) => user.email.toLowerCase().includes(query));
  }
  if (roleFilter && roleFilter.value !== "") {
    users = users.filter((user) => user.role === roleFilter.value);
  }

  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";
  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>
        <select onchange="updateUserRole('${user.email}', this.value)">
          <option value="Sub Admin" ${user.role === "Sub Admin" ? "selected" : ""}>Sub Admin</option>
          <option value="Faculty" ${user.role === "Faculty" ? "selected" : ""}>Faculty</option>
          <option value="Student" ${user.role === "Student" ? "selected" : ""}>Student</option>
        </select>
      </td>
      <td>
        <button class="delete-btn" onclick="deleteUserByEmail('${user.email}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* Helper function to update a user role by email */
function updateUserRole(email, newRole) {
  let users = JSON.parse(localStorage.getItem("userData")) || [];
  let user = users.find((u) => u.email === email);
  if (user) {
    user.role = newRole;
    localStorage.setItem("userData", JSON.stringify(users));
    console.log(`Updated role for ${email} to ${newRole}`);
  }
}

/* Helper function to delete a user based on email */
function deleteUserByEmail(email) {
  let users = JSON.parse(localStorage.getItem("userData")) || [];
  users = users.filter((u) => u.email !== email);
  localStorage.setItem("userData", JSON.stringify(users));
  loadUserData();
}