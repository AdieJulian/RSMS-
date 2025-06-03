document.addEventListener("DOMContentLoaded", function() {
  initializeRoomData();
  const rooms = getRoomData();
  const tbody = document.querySelector("#roomTable tbody");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // For each room, for every day, for every time slot, create a row.
  rooms.forEach(room => {
    days.forEach(day => {
      room.schedule[day].forEach(slotObj => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${room.name}</td>
          <td>${day}</td>
          <td>${slotObj.timeSlot}</td>
          <td>${slotObj.status}</td>
        `;
        tbody.appendChild(tr);
      });
    });
  });
});

// Filter function remains similar
function filterTable() {
  const roomFilter = document.getElementById("room-search").value.trim().toLowerCase();
  const dayFilter = document.getElementById("day-filter").value;
  const timeFilter = document.getElementById("time-filter").value;
  const availabilityFilter = document.getElementById("availability-filter").value;

  const rows = document.querySelectorAll("#roomTable tbody tr");

  rows.forEach(row => {
    const roomText = row.cells[0].textContent.trim().toLowerCase();
    const day = row.cells[1].textContent.trim();
    const time = row.cells[2].textContent.trim();
    const availability = row.cells[3].textContent.trim();

    const matchesRoom = !roomFilter || roomText.includes(roomFilter);
    const matchesDay = !dayFilter || day === dayFilter;
    const matchesTime = !timeFilter || time === timeFilter;
    const matchesAvailability = !availabilityFilter || availability === availabilityFilter;

    row.style.display = (matchesRoom && matchesDay && matchesTime && matchesAvailability) ? "" : "none";
  });
}

document.querySelectorAll(".filter-container select, .filter-container input").forEach(filter => {
  filter.addEventListener("input", filterTable);
});