$(document).ready(function () {
    $('#usersTable').DataTable();
});

function changeSection() {
  $.ajax({
    url: '/admin/tvshowlive',
    method: 'GET',
    success: (response) => {
        let section = document.getElementById('change-section')
        if(section.innerHTML() !== response) {
          location.reload()
        }
    }
})
}

changeSection()

setInterval(changeSection, 1000)