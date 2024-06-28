// register.js

// Password visibility toggle
function togglePasswordVisibility(toggleId, inputId) {
    document.getElementById(toggleId).addEventListener('click', function () {
        const input = document.getElementById(inputId);
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// Attach toggle visibility for password fields
togglePasswordVisibility('togglePassword', 'password');
togglePasswordVisibility('toggleConfirmPassword', 'confirmPassword');

// Validate Register Form
function validateRegisterForm() {
    console.log("Validating registration form..."); // Debug message
    const email = document.forms["registerForm"]["email"].value;
    const username = document.forms["registerForm"]["username"].value;
    const password = document.forms["registerForm"]["password"].value;
    const confirmPassword = document.forms["registerForm"]["confirmPassword"].value;

    // Basic validation
    if (email === "" || username === "" || password === "" || confirmPassword === "") {
        displayMessage("All fields must be filled out", "error");
        return false;
    }

    if (password !== confirmPassword) {
        displayMessage("Passwords do not match", "error");
        return false;
    }

    // Password complexity validation
    if (password.length < 8) {
        displayMessage("Password must be at least 8 characters long", "error");
        return false;
    }

    const numberPattern = /\d/;
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (!numberPattern.test(password)) {
        displayMessage("Password must contain at least one number", "error");
        return false;
    }

    if (!specialCharacterPattern.test(password)) {
        displayMessage("Password must contain at least one special character", "error");
        return false;
    }

    // Check if email already exists using AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "../../php/check_email.php", false); // Synchronous request for simplicity
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const data = "email=" + encodeURIComponent(email) + "&username=" + encodeURIComponent(username);
    xhr.send(data);

    // Handle the response
    if (xhr.status === 200) {
        console.log(xhr.responseText);
    }

    // All checks passed
    return true;
}

// Function to handle registration submission via AJAX
function registerUser(event) {
    event.preventDefault(); // Prevent default form submission

    if (!validateRegisterForm()) {
        console.log("Form validation failed"); // Debug message
        return; // Stop submission if validation fails
    }

    console.log("Form validated successfully"); // Debug message

    // Collect form data
    const form = event.target;
    const formData = new FormData(form);
    const params = new URLSearchParams(formData).toString();

    // Create and send AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "../../php/user_register.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) { // Request complete
            if (xhr.status === 200) { // Success
                console.log("Server response received"); // Debug message
                const response = xhr.responseText.trim();
                if (response === "success") {
                    // Redirect to user page on successful registration
                    console.log("Registration successful. Redirecting to user.html");
                    window.location.href = "../pages/user_login.html";
                } else {
                    // Display error message
                    displayMessage(response, "error");
                }
            } else {
                console.error("Server error: " + xhr.status); // Debug error
                displayMessage("An error occurred during registration. Please try again.", "error");
            }
        }
    };

    console.log("Sending AJAX request"); // Debug message
    xhr.send(params); // Send the data to the server
}

// Function to display messages on the page
function displayMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = message;
    messageContainer.className = type; // Set class based on message type (success or error)
    messageContainer.style.display = 'block';
    console.log("Displayed message: ", message);
}

// Attach the registerUser function to the form's submit event
document.getElementById('registerForm').addEventListener('submit', registerUser);

console.log("Register script loaded and event listener attached");
