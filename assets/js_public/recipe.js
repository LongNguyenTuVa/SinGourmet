document.addEventListener('DOMContentLoaded', function () {
    let allRecipes = [];
    let userTier = 1; // Default to 'free' tier

    // Mapping of string descriptions to numerical tiers
    const tierMapping = {
        "free": 1,
        "community": 2,
        "chef": 3
    };

    fetch('../../php/fetch_recipe.php')
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
        const container = document.getElementById('recipe-container');
        container.innerHTML = ''; // Clear existing content
        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('col-sm-6', 'col-lg-4', 'all', recipe.category.toLowerCase());

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
                            <button class="add-recipe-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
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
        const recipes = document.querySelectorAll('#recipe-container .col-sm-6');

        filters.forEach(filter => {
            filter.addEventListener('click', function () {
                filters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                const filteredRecipes = allRecipes.filter(recipe => filterValue === '*' || recipe.category.toLowerCase() === filterValue);
                renderRecipes(filteredRecipes, userTier);

                showMoreRecipes(true); // Reset and show initial set of recipes for the selected filter
            });
        });
    }

    function showMoreRecipes(reset = false) {
        const recipes = document.querySelectorAll('#recipe-container .col-sm-6');
        let currentlyVisible = reset ? 0 : document.querySelectorAll('#recipe-container .col-sm-6[style="display: block;"]').length;
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

    document.getElementById('view-more').addEventListener('click', function (event) {
        event.preventDefault();
        showMoreRecipes();
    });

    function attachRecipeClickEvents() {
        const recipeBoxes = document.querySelectorAll('.box[data-recipe-id]');
        recipeBoxes.forEach(box => {
            box.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-recipe-id');
                const recipe = allRecipes.find(r => r.id == recipeId);
                const recipeTier = tierMapping[recipe.tier.toLowerCase()];
                console.log("User Tier:", userTier, "Recipe Tier:", recipeTier);
                if ((userTier === 1 && recipeTier !== 1) || (userTier === 2 && recipeTier === 3)) {
                    showAccessDeniedModal();
                } else {
                    showRecipeModal(recipe);
                }
            });
            // Add click event for the add button
            const addButton = box.querySelector('.add-recipe-btn');
            addButton.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent triggering the box click event
                const recipeId = box.getAttribute('data-recipe-id');
                addRecipeToUser(recipeId);
            });
        });
    }
    function addRecipeToUser(recipeId) {
        fetch('../../php/add_recipe_to_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipeId: recipeId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Recipe added to your account successfully!');
            } else {
                alert('Failed to add recipe: ' + data.message);
            }
        })
        .catch(error => console.error('Error adding recipe:', error));
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