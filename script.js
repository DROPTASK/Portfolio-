// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Automatically close the sidebar on page load
  document.querySelector('.sidebar').classList.add('closed');

  // Toggle sidebar open/close
  document.getElementById('toggleSidebar').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('closed');
  });

  // Close sidebar with the close button
  document.getElementById('closeSidebar').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.add('closed');
  });

  // Close sidebar when any menu item is clicked
  document.querySelectorAll('.sidebar nav ul li').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.add('closed');
    });
  });
});
document.querySelector('.profile-button').addEventListener('click', () => {
  document.querySelector('.profile-container').classList.toggle('active');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  alert('Logging out...');
});
