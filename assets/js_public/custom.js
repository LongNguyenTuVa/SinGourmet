window.onload = function() {
  fetch('../../php/user.php')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data:', data); // Debug log

      if (data.loggedIn) {
        document.getElementById('authButton').textContent = 'Log out';
        document.getElementById('authButton').href = '../php/logout.php'; // Redirect to logout script

        if (data.success && data.filePath) {
          document.getElementById('profilePicture').src = data.filePath;
        }

        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;
      } else {
        document.getElementById('authButton').textContent = 'Log in';
        document.getElementById('authButton').href = '../../pages/user_login.html'; // Redirect to login page
      }
    })
    .catch(error => console.error('Error fetching user data:', error));
};

function uploadProfilePicture(formData) {
  fetch('../../php/user.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('profilePicture').src = data.filePath;
      } else {
        alert('Error uploading profile picture: ' + data.message);
      }
    })
    .catch(error => console.error('Error uploading profile picture:', error));
}

$(document).ready(function() {
  const profilePictureForm = document.getElementById('profilePictureForm');
  if (profilePictureForm) {
    profilePictureForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(this);
      uploadProfilePicture(formData);
    });
  }

  function getYear() {
    document.getElementById('displayYear').textContent = new Date().getFullYear();
    document.getElementById('displayYear2').textContent = new Date().getFullYear();
  }
  getYear();

  // isotope js
  $('.filters_menu li').click(function() {
    $('.filters_menu li').removeClass('active');
    $(this).addClass('active');

    var data = $(this).attr('data-filter');
    $grid.isotope({
      filter: data
    });
  });

  var $grid = $(".grid").isotope({
    itemSelector: ".all",
    percentPosition: false,
    masonry: {
      columnWidth: ".all"
    }
  });

  // nice select
  $('select').niceSelect();

  // client section owl carousel
  $('.client_owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1000: {
        items: 2
      }
    }
  });
});

/** google_map js **/
function myMap() {
  var mapProp = {
    center: new google.maps.LatLng(40.712775, -74.005973),
    zoom: 18,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}
