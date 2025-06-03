function initializeRoomData(totalRooms = 100) {
  // Remove old room data if totalRooms is different
  const currentData = JSON.parse(localStorage.getItem("roomData"));
  if (currentData && currentData.length !== totalRooms) {
    localStorage.removeItem("roomData"); // Clear outdated data
  }

  // Check again if data exists after clearing
  if (!localStorage.getItem("roomData")) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["8:00 AM - 11:00 AM", "11:00 AM - 2:00 PM", "2:00 PM - 5:00 PM"];
    const rooms = [];

    for (let i = 1; i <= totalRooms; i++) {
      rooms.push({
        id: i,
        day: days[Math.floor(Math.random() * days.length)],
        timeSlot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        status: Math.random() > 0.5 ? "Occupied" : "Vacant"
      });
    }

    localStorage.setItem("roomData", JSON.stringify(rooms));
  }
}

/** Retrieve room data */
function getRoomData() {
  return JSON.parse(localStorage.getItem("roomData")) || [];
}

/** Update room status */
function updateRoomStatus(roomId, newStatus) {
  const rooms = getRoomData();
  const idx = rooms.findIndex(r => r.id === roomId);
  if (idx !== -1) {
    rooms[idx].status = newStatus;
    localStorage.setItem("roomData", JSON.stringify(rooms));
  }
}