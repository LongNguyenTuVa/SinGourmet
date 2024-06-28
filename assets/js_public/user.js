// JavaScript for user page
document.addEventListener('DOMContentLoaded', function() {
  const tierMapping = {
    1: 'Free',
    2: 'Community',
    3: 'Chef'
  };
  // Make an AJAX request to fetch user data
  fetch('../../php/fetch_user_data.php')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched user data:', data); // Debug log
        if (data.error) {
            alert(data.error);
            // Optionally redirect to login page if not logged in
            window.location.href = '../../pages/user_login.html';
        } else {
            // Update the page content with user data
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            // Get the tier name from the mapping
            const tierName = tierMapping[data.tier] || 'Unknown';
            document.getElementById('tier').textContent = tierName;
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });

  // Tab functionality
  document.getElementById('ownTab').addEventListener('click', () => {
    showSection('ownContent');
    setActiveTab('ownTab');
  });

  document.getElementById('freeTab').addEventListener('click', () => {
    showSection('freeContent');
    setActiveTab('freeTab');
  });

  document.getElementById('communityTab').addEventListener('click', () => {
    showSection('communityContent');
    setActiveTab('communityTab');
  });

  document.getElementById('chefTab').addEventListener('click', () => {
    showSection('chefContent');
    setActiveTab('chefTab');
  });

  // View more functionality
  document.getElementById('viewMoreOwn').addEventListener('click', () => {
    loadMoreItems('ownContent', 'own', ownIndex);
    setActiveTab('ownTab');
  });

  document.getElementById('viewMoreFree').addEventListener('click', () => {
    loadMoreItems('freeContent', 'free', freeIndex);
    setActiveTab('freeTab');
  });

  document.getElementById('viewMoreCommunity').addEventListener('click', () => {
    loadMoreItems('communityContent', 'community', communityIndex);
    setActiveTab('communityTab');
  });

  document.getElementById('viewMoreChef').addEventListener('click', () => {
    loadMoreItems('chefContent', 'chef', chefIndex);
    setActiveTab('chefTab');
  });

  let ownIndex = 0;
  let freeIndex = 0;
  let communityIndex = 0;
  let chefIndex = 0;

  function showSection(sectionId) {
    const sections = document.querySelectorAll('.content_section');
    sections.forEach(section => {
      section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'grid';
  }

  function loadMoreItems(sectionId, type, startIndex) {
    const section = document.getElementById(sectionId);
    for (let i = 0; i < 6; i++) {
      const index = startIndex + i;
      if (index >= 10) break; // Assuming we have 50 items for each type
      const newItem = document.createElement('div');
      newItem.className = 'item';
      newItem.innerHTML = `<img src="../assets/images_public/${type}${index + 1}.png" alt="Food Image" class="item_picture"><p>${capitalize(type)} Recipe</p>`;
      section.insertBefore(newItem, section.querySelector('.view_more_btn'));
    }
    if (type === 'Chinese') ownIndex += 6;
    if (type === 'Indian') freeIndex += 6;
    if (type === 'Western') communityIndex += 6;
    if (type === 'f') chefIndex += 6;
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function setActiveTab(tabId) {
    const tabs = document.querySelectorAll('.tab_btn');
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
  }



// I want default display 6 items
  // Initial load for "Own" section
  showSection('ownContent');
  loadMoreItems('ownContent', 'Chinese', ownIndex);

  // Initial load for "Free" section
  showSection('freeContent');
  loadMoreItems('freeContent', 'Indian', freeIndex);

  // Initial load for "community" section
  showSection('communityContent');
  loadMoreItems('communityContent', 'Western', communityIndex);

  // Initial load for "Chef" section
  showSection('chefContent');
  loadMoreItems('chefContent', 'f', chefIndex);

});

// JavaScript for profile picture
document.getElementById('changeProfilePicLink').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('profilePicInput').click();
});

document.getElementById('profilePicInput').addEventListener('change', function () {
  // If a file is selected
  if (this.files && this.files[0]) {
    let formData = new FormData();
    formData.append('profile_picture', this.files[0]);

    // Send the image file to the server via AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../../php/user.php', true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // Handle successful upload
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // Update the profile picture on the page
          document.getElementById('profilePicture').src = response.filePath;
        } else {
          alert('Failed to upload image. ' + response.message);
        }
      } else {
        alert('An error occurred while uploading the image.');
      }
    };

    xhr.send(formData);
  }
});

// Handle Login/Logout button click
document.getElementById('authButton').addEventListener('click', function(event) {
  if (this.textContent === 'Logout') {
    event.preventDefault();
    fetch('../../php/user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=logout'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '../../pages/user_login.html'; // Redirect to login page after logout
        } else {
            alert('Logout failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error during logout:', error));
  }
});