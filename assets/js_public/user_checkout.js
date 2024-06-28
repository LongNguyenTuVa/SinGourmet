function validateCheckoutForm() {
    var isValid = true;
    var messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = '';
    messageContainer.style.display = 'none';

    var name = document.forms["checkoutForm"]["name"].value;
    var cardNum = document.forms["checkoutForm"]["cardNum"].value.replace(/\s+/g, '');
    var cvv = document.forms["checkoutForm"]["CVV"].value;
    var expiryDate = document.forms["checkoutForm"]["expiryDate"].value.replace(/\//g, '');

    if (!/^\d{16}$/.test(cardNum)) {
        isValid = false;
        messageContainer.innerHTML += 'Card number must be 16 digits.<br>';
    }

    if (!/^\d{3}$/.test(cvv)) {
        isValid = false;
        messageContainer.innerHTML += 'CVV must be 3 digits.<br>';
    }

    if (!/^\d{4}$/.test(expiryDate)) {
        isValid = false;
        messageContainer.innerHTML += 'Expiry date must be in MM/YY format.<br>';
    }

    if (!isValid) {
        messageContainer.style.display = 'block';
    }

    return isValid;
}

function togglePasswordVisibility() {
    var passwordField = document.getElementById('CVV');
    var toggleIcon = document.getElementById('toggleLoginPassword');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

function formatCardNumber(event) {
    var input = event.target;
    var value = input.value.replace(/\D/g, '').substring(0, 16); // Remove non-digits and limit to 16 digits
    var formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
    input.value = formattedValue;

    // Show VISA icon if more than 4 digits
    var visaIcon = document.getElementById('visaIcon');
    if (value.length > 4) {
        visaIcon.style.display = 'block';
    } else {
        visaIcon.style.display = 'none';
    }
}

function formatExpiryDate(event) {
    var input = event.target;
    var value = input.value.replace(/\D/g, '').substring(0, 4); // Remove non-digits and limit to 4 digits
    var formattedValue = value.replace(/(\d{2})(?=\d)/g, '$1/'); // Add slash after 2 digits
    input.value = formattedValue;
}

function enforceNumericInput(event) {
    var input = event.target;
    input.value = input.value.replace(/\D/g, '');
}
let sessionTier = '';
function fetchSessionTier(summaryText) {
    fetch('../../php/user_checkout.php?action=get_tier')
        .then(response => response.json())
        .then(data => {
            sessionTier = data.tier;
            console.log('Session Tier:', sessionTier);
            // Call another function that needs to use sessionTier
            performActionBasedOnTier(summaryText);
        })
        .catch(error => console.error('Error fetching session tier:', error));
}
function performActionBasedOnTier(summaryText) {
    if (sessionTier === 1) {
        summaryText.textContent = 'You have selected the Free tier. Enjoy access to free recipes from the community and chefs.';
    } else if (sessionTier === 2) {
        summaryText.textContent = 'You have selected the Community tier. Enjoy access to community recipes verified by Singourmet.';
    } else if (sessionTier === 3) {
        summaryText.textContent = 'You have selected the Chef tier. Enjoy access to premium recipes from professional chefs worldwide.';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var cardNumberInput = document.getElementById('cardNumber');
    var cvvInput = document.getElementById('CVV');
    var expiryDateInput = document.getElementById('expiryDate');

    cardNumberInput.addEventListener('input', formatCardNumber);
    cvvInput.addEventListener('input', enforceNumericInput);
    expiryDateInput.addEventListener('input', formatExpiryDate);

    var summaryText = document.getElementById('summaryText');
    fetchSessionTier(summaryText);

    // if (sessionTier === 1) {
    //     summaryText.textContent = 'You have selected the Free tier. Enjoy access to free recipes from the community and chefs.';
    // } else if (sessionTier === 2) {
    //     summaryText.textContent = 'You have selected the Community tier. Enjoy access to community recipes verified by Singourmet.';
    // } else if (sessionTier === 3) {
    //     summaryText.textContent = 'You have selected the Chef tier. Enjoy access to premium recipes from professional chefs worldwide.';
    // }
});