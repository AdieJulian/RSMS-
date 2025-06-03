document.addEventListener("DOMContentLoaded", function() {
  // Initialize the room data if it doesn't exist
  initializeRoomData();
  
  // Retrieve room data from localStorage
  const rooms = getRoomData();
  const tbody = document.querySelector("#roomTable tbody");

  // Populate the request table with each room's information
  rooms.forEach(room => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>Room ${room.id}</td>
      <td>${room.day}</td>
      <td>${room.timeSlot}</td>
      <td>${room.status}</td>
      <td>
        <button class="approve-btn" onclick="approve(${room.id})">Approve</button>
        <button class="deny-btn" onclick="deny(${room.id})">Deny</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
});

// Approve function: Update status to Occupied and refresh the page
function approve(roomId) {
  updateRoomStatus(roomId, "Occupied");
  location.reload();
}

// Deny function: Update status to Vacant and refresh the page
function deny(roomId) {
  updateRoomStatus(roomId, "Vacant");
  location.reload();
}