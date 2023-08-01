$(document).ready(function () {
  $('#usersTable').DataTable();
});

function changeSection() {
  $.ajax({
    url: '/admin/tvshowlive',
    method: 'GET',
    success: (data) => {
      let connect = document.getElementById('namePro').innerHTML()
      if (data.Name !== connect) {
        // Reload the page
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