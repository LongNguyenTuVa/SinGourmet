document.addEventListener('DOMContentLoaded', function() {
  const tierMapping = {
    1: 'Free',
    2: 'Community',
    3: 'Chef'
  };
  let allRecipes = [];
  let userTier = 1; // Default to 'free' tier
  // Mapping of string descriptions to numerical tiers
  const tierMappingString = {
    "free": 1,
    "community": 2,
    "chef": 3
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

  fetch('../../php/fetch_recipe_user.php')
    .then(response => response.json())
    .then(data => {
      console.log("Fetched data:", data);
      allRecipes = data.recipes;
      userTier = parseInt(data.user_tier, 10);
      console.log("User Tier:", userTier);
      renderRecipes(allRecipes, userTier);
      applyFilters();
    })
    .catch(error => console.error('Error fetching recipes:', error));

  function renderRecipes(recipes, userTier) {
    const container = document.getElementById('user-container');
    container.innerHTML = ''; // Clear existing content
    recipes.forEach(recipe => {
      const recipeElement = document.createElement('div');
      const recipeTier = tierMappingString[recipe.tier.toLowerCase()];
      recipeElement.classList.add('col-sm-6', 'col-lg-4', 'all', `tier-${recipeTier}`);
      console.log("html:", `tier-${recipeTier}`);

      recipeElement.innerHTML = `
        <div class="box" data-recipe-id="${recipe.id}">
          <div>
            <div class="img-box">
              <img src="../${recipe.image_url}" alt="${recipe.title}">
            </div>
            <div class="detail-box">
              <h5>${recipe.title}</h5>
              <p>${recipe.description}</p>
              <p>Category: ${recipe.category}</p>
              <p>Tier: ${recipe.tier}</p>
              <button class="remove-recipe-btn" title="Remove from My Recipes">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(recipeElement);
    });
    showMoreRecipes(); // Show initial set of recipes
    attachRecipeClickEvents();
  }

  function applyFilters() {
    const filters = document.querySelectorAll('.filters_menu li');
    const recipes = document.querySelectorAll('#user-container .col-sm-6');

    filters.forEach(filter => {
      filter.addEventListener('click', function() {
        filters.forEach(f => f.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');
        const filterTier = parseInt(filterValue, 10);

        const filteredRecipes = allRecipes.filter(recipe => filterValue === '*' || tierMappingString[recipe.tier.toLowerCase()] === filterTier);
        renderRecipes(filteredRecipes, userTier);

        showMoreRecipes(true); // Reset and show initial set of recipes for the selected filter
      });
    });
  }

  function showMoreRecipes(reset = false) {
    const recipes = document.querySelectorAll('#user-container .col-sm-6');
    let currentlyVisible = reset ? 0 : document.querySelectorAll('#user-container .col-sm-6[style="display: block;"]').length;
    const increment = 3;

    recipes.forEach((recipe, index) => {
      if (index < currentlyVisible + increment) {
        recipe.style.display = 'block';
      } else {
        recipe.style.display = 'none';
      }
    });

    currentlyVisible += increment;

    const viewMoreButton = document.getElementById('view-more');
    if (currentlyVisible >= recipes.length) {
      viewMoreButton.style.display = 'none';
    } else {
      viewMoreButton.style.display = 'block';
    }
  }

  document.getElementById('view-more').addEventListener('click', function(event) {
    event.preventDefault();
    showMoreRecipes();
  });

  function attachRecipeClickEvents() {
    const recipeBoxes = document.querySelectorAll('.box[data-recipe-id]');
    recipeBoxes.forEach(box => {
      box.addEventListener('click', function() {
        const recipeId = this.getAttribute('data-recipe-id');
        const recipe = allRecipes.find(r => r.id == recipeId);
        const recipeTier = tierMappingString[recipe.tier.toLowerCase()];
        console.log("User Tier:", userTier, "Recipe Tier:", recipeTier);
        if ((userTier === 1 && recipeTier !== 1) || (userTier === 2 && recipeTier === 3)) {
          showAccessDeniedModal();
        } else {
          showRecipeModal(recipe);
        }
      });

      // Add click event for the remove button
      const removeButton = box.querySelector('.remove-recipe-btn');
      removeButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent triggering the box click event
        const recipeId = box.getAttribute('data-recipe-id');
        removeRecipeFromUser(recipeId, box);
      });
    });
  }

  function removeRecipeFromUser(recipeId, recipeElement) {
    fetch('../../php/remove_recipe_from_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipeId: recipeId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Recipe removed from your account successfully!');
            recipeElement.remove(); // Remove the recipe element from the DOM
        } else {
            alert('Failed to remove recipe: ' + data.message);
        }
    })
    .catch(error => console.error('Error removing recipe:', error));
  }

  function showRecipeModal(recipe) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <h2>${recipe.title}</h2>
      <img src="../${recipe.image_url}" alt="${recipe.title}" class="img-fluid">
      <div><strong>Description:</strong></div><div>${recipe.description}</div>
      <div><strong>Ingredients:</strong></div><div class="preserve-whitespace">${recipe.ingredient}</div>
      <div><strong>Steps:</strong></div><div class="preserve-whitespace">${recipe.step}</div>
      <div><strong>Category:</strong></div><div>${recipe.category}</div>
      <div><strong>Tier:</strong></div><div>${recipe.tier}</div>
    `;
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    recipeModal.show();
  }

  function showAccessDeniedModal() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <h2>Access Denied</h2>
      <p>You do not have access to view this recipe. Please upgrade your tier to access more recipes.</p>
    `;
    const accessDeniedModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    accessDeniedModal.show();
  }
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