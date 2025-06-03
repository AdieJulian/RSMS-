document.addEventListener("DOMContentLoaded", function() {
  // Initialize room data in localStorage if not already set.
  initializeRoomData();
  
  // Retrieve room data from localStorage.
  const rooms = getRoomData();
  const tbody = document.querySelector("#roomTable tbody");

  // Populate table using room data.
  rooms.forEach(room => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>Room ${room.id}</td>
      <td>${room.day}</td>
      <td>${room.timeSlot}</td>
      <td>${room.status}</td>
    `;
    tbody.appendChild(tr);
  });
});

// Filter function for table rows.
function filterTable() {
  const roomFilter = document.getElementById("room-search").value.trim().toLowerCase();
  const dayFilter = document.getElementById("day-filter").value;
  const timeFilter = document.getElementById("time-filter").value;
  const availabilityFilter = document.getElementById("availability-filter").value;

  const rows = document.querySelectorAll("#roomTable tbody tr");

  rows.forEach(row => {
    // Get cell values.
    const roomText = row.cells[0].textContent.trim().toLowerCase();
    const day = row.cells[1].textContent.trim();
    const time = row.cells[2].textContent.trim();
    const availability = row.cells[3].textContent.trim();

    // Apply filters.
    const matchesRoom = !roomFilter || roomText.includes(roomFilter);
    const matchesDay = !dayFilter || day === dayFilter;
    const matchesTime = !timeFilter || time === timeFilter;
    const matchesAvailability = !availabilityFilter || availability === availabilityFilter;

    if (matchesRoom && matchesDay && matchesTime && matchesAvailability) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Add event listeners to filter inputs.
document.querySelectorAll(".filter-container select, .filter-container input")
  .forEach(filter => {
    filter.addEventListener("input", filterTable);
});

// Approve and deny functions (for possible future button use).
function approve(roomId) {
  updateRoomStatus(roomId, "Occupied");
  location.reload(); // refresh to show changes
}

function deny(roomId) {
  updateRoomStatus(roomId, "Vacant");
  location.reload();
}