document.addEventListener("DOMContentLoaded", function() {
  initializeRoomData();
  const rooms = getRoomData();
  const tbody = document.querySelector("#roomTable tbody");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Build table rows: one per room per day per time slot.
  rooms.forEach(room => {
    days.forEach(day => {
      room.schedule[day].forEach((slotObj, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${room.name}</td>
          <td>${day}</td>
          <td>${slotObj.timeSlot}</td>
          <td>${slotObj.status}</td>
          <td>
            <button class="approve-btn" onclick="approve('${room.name}', '${day}', ${index})">Approve</button>
            <button class="deny-btn" onclick="deny('${room.name}', '${day}', ${index})">Deny</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  });
});

// Update functions now pass roomName, day, and timeSlot index.
function approve(roomName, day, timeSlotIndex) {
  updateRoomStatus(roomName, day, timeSlotIndex, "Occupied");
  location.reload();
}

function deny(roomName, day, timeSlotIndex) {
  updateRoomStatus(roomName, day, timeSlotIndex, "Vacant");
  location.reload();
}