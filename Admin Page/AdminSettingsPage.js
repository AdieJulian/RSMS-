// Placeholder script for Admin Settings page functionality.

document.addEventListener("DOMContentLoaded", function () {
    const addUserLink = document.getElementById("addNewUser");
    const userModal = document.getElementById("userModal");

    // Open modal when "Add New User" is clicked
    addUserLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        userModal.style.display = "block";
    });

    // Close modal when clicking outside or pressing "Cancel"
    window.addEventListener("click", function (event) {
        if (event.target === userModal) {
            closeModal();
        }
    });

    function closeModal() {
        userModal.style.display = "none";
    }
});