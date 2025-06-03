document.addEventListener("DOMContentLoaded", function () {
  // Initialize room data and retrieve the rooms array
  initializeRoomData();
  const rooms = getRoomData();

  // Define days and timeSlots arrays
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["8:00 AM - 11:00 AM", "11:00 AM - 2:00 PM", "2:00 PM - 5:00 PM"];

  // Compute total time slots and number of vacant slots
  let totalSlots = 0, vacantSlots = 0;
  rooms.forEach(room => {
    days.forEach(day => {
      const slots = room.schedule[day];
      totalSlots += slots.length;
      vacantSlots += slots.filter(slot => slot.status === "Vacant").length;
    });
  });
  const occupiedSlots = totalSlots - vacantSlots;

  // Update statistic boxes (ensure your HTML has the corresponding elements with these IDs)
  document.getElementById("vacantRooms").textContent = vacantSlots;
  document.getElementById("occupiedRooms").textContent = occupiedSlots;
  document.getElementById("roomRequests").textContent = vacantSlots; // Example

  // Prepare data for bar graphs
  // 1. For "Rooms by Day": For each day, count vacant slots across all rooms
  const dayData = days.map(day => {
    let count = 0;
    rooms.forEach(room => {
      count += room.schedule[day].filter(slot => slot.status === "Vacant").length;
    });
    return count;
  });

  // 2. For "Rooms by Time Slot": For each time slot, count vacant instances across all days and rooms
  const timeData = timeSlots.map(slot => {
    let count = 0;
    rooms.forEach(room => {
      days.forEach(day => {
        const slotObj = room.schedule[day].find(s => s.timeSlot === slot);
        if (slotObj && slotObj.status === "Vacant") {
          count++;
        }
      });
    });
    return count;
  });

  // Create the pie chart for room occupancy
  new Chart(document.getElementById("pieChart").getContext("2d"), {
    type: "pie",
    data: {
      labels: ["Vacant", "Occupied"],
      datasets: [{
        data: [vacantSlots, occupiedSlots],
        backgroundColor: ["#28a745", "#dc3545"],
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      layout: { padding: 5 },
      plugins: {
        title: { display: true, text: "Room Occupancy" },
        legend: { position: 'bottom' }
      },
      animation: { animateScale: true, animateRotate: true }
    }
  });

  // Define common options for bar charts with improved tooltip and hover settings
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            // Show dataset label and value
            const label = context.dataset.label || "";
            const value = context.parsed.y !== null ? context.parsed.y : "";
            return label + ': ' + value;
          }
        }
      }
    }
  };

  // Create the Bar Chart: Vacant Slots by Day
  new Chart(document.getElementById("daysBarChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: "Vacant Slots by Day",
        data: dayData,
        backgroundColor: "rgba(0,123,255,0.8)",
        borderRadius: 5
      }]
    },
    options: {
      ...commonOptions,
      scales: { y: { beginAtZero: true } },
      plugins: {
        ...commonOptions.plugins,
        title: { display: true, text: "Vacant Slots by Day" }
      }
    }
  });

  // Create the Bar Chart: Vacant Slots by Time Slot
  new Chart(document.getElementById("timeSlotsBarChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: timeSlots,
      datasets: [{
        label: "Vacant Slots by Time Slot",
        data: timeData,
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        borderRadius: 5
      }]
    },
    options: {
      ...commonOptions,
      scales: { y: { beginAtZero: true } },
      plugins: {
        ...commonOptions.plugins,
        title: { display: true, text: "Vacant Slots by Time Slot" }
      }
    }
  });
});
