$(document).ready(function () {
    $('#usersTable').DataTable();
});

function changeSection() {
  $.ajax({
    url: '/admin/tvshowlive',
    method: 'GET',
    success: (response) => {
      let section = document.getElementById('change-section');

      // Check if the response is different from the current userProfile data
      if (JSON.stringify(response) !== JSON.stringify(userProfile)) {
        location.reload();
      }
    }
  });
}

// Initialize the userProfile object
let userProfile = {};

// Call the changeSection function immediately
changeSection();

// Call the changeSection function every 1000ms (1 second)
setInterval(changeSection, 1000);