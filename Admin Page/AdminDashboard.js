document.addEventListener("DOMContentLoaded", function () {
  // Ensure room data is initialized before use
  initializeRoomData();
  
  // Retrieve shared room data
  const rooms = getRoomData();
  const totalRooms = rooms.length;
  const vacantRooms = rooms.filter(r => r.status === "Vacant").length;
  const occupiedRooms = totalRooms - vacantRooms;
  const roomRequests = Math.floor(Math.random() * 10); // Replace with real data if available

  // Update statistic boxes in the horizontal layout
  document.getElementById("vacantRooms").textContent   = vacantRooms;
  document.getElementById("occupiedRooms").textContent = occupiedRooms;
  document.getElementById("roomRequests").textContent  = roomRequests;

  // Prepare data for the bar graphs
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["8:00 AM - 11:00 AM", "11:00 AM - 2:00 PM", "2:00 PM - 5:00 PM"];
  const dayData = days.map(d => rooms.filter(r => r.day === d).length);
  const timeData = timeSlots.map(t => rooms.filter(r => r.timeSlot === t).length);

  // Pie Chart: Room Occupancy
  new Chart(document.getElementById("pieChart").getContext("2d"), {
    type: "pie",
    data: {
      labels: ["Vacant", "Occupied"],
      datasets: [{
        data: [vacantRooms, occupiedRooms],
        backgroundColor: ["#28a745", "#dc3545"],
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,         // Use fixed size (as specified on canvas)
      maintainAspectRatio: true,
      layout: { padding: 5 },
      plugins: {
        title: { display: true, text: "Room Occupancy" },
        legend: { position: 'bottom' }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });

  // Common options for bar charts
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  // Bar Chart: Rooms by Day
  new Chart(document.getElementById("daysBarChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: "Rooms per Day",
        data: dayData,
        backgroundColor: "rgba(0,123,255,0.8)",
        borderRadius: 5
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        ...commonOptions.plugins,
        title: { display: true, text: "Rooms by Day" }
      }
    }
  });

  // Bar Chart: Rooms by Time Slot
  new Chart(document.getElementById("timeSlotsBarChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: timeSlots,
      datasets: [{
        label: "Rooms per Time Slot",
        data: timeData,
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        borderRadius: 5
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        ...commonOptions.plugins,
        title: { display: true, text: "Rooms by Time Slot" }
      }
    }
  });
});