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

  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all
      navItems.forEach(i => i.classList.remove('active'));
      // Add active to clicked one
      item.classList.add('active');

      // Trigger click animation
      item.classList.remove('clicked');
      void item.offsetWidth; // Force reflow to restart animation
      item.classList.add('clicked');
    });
  });
<script>
  function setActive(clickedItem) {
    // Remove active & clicked from all items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to clicked
    clickedItem.classList.add('active');

    // Trigger ripple animation cleanly
    clickedItem.classList.remove('clicked'); // reset if already clicked
    void clickedItem.offsetWidth; // reflow
    clickedItem.classList.add('clicked');
  }
</script>
