function checkLoginStatus() {
	return fetch('../../php/user.php')
			.then(response => response.json());
}

function setTierAndRedirectCheckout(tier) {
	checkLoginStatus()
			.then(data => {
					if (data.loggedIn) {
							// User is logged in, proceed with setting the tier
							fetch('../../php/set_tier.php', {
									method: 'POST',
									headers: {
											'Content-Type': 'application/json'
									},
									body: JSON.stringify({ tier: tier })
							})
							.then(response => response.json())
							.then(data => {
									if (data.success) {
											window.location.href = '../../pages/user_checkout.html'; // Redirect to checkout page
									} else {
											alert('Failed to set tier');
									}
							})
							.catch(error => console.error('Error:', error));
					} else {
							// User is not logged in, redirect to login page
							window.location.href = '../../pages/user.html';
					}
			})
			.catch(error => console.error('Error checking login status:', error));
}