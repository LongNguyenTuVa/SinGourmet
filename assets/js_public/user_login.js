// login.js

// Password visibility toggle
document.getElementById('toggleLoginPassword').addEventListener('click', function () {
    const password = document.getElementById('loginPassword');
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Function to display messages on the page
function displayMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = message;
    messageContainer.className = type; // Set class based on message type (success or error)
    messageContainer.style.display = 'block';
    console.log("Displayed message: ", message);
}

// Validate Login Form
function validateLoginForm() {
    console.log("Validating form...");
    const userInput = document.forms["loginForm"]["email"].value;
    const password = document.forms["loginForm"]["password"].value;

    if (userInput === "" || password === "") {
        displayMessage("Both fields must be filled out", "error");
        return false;
    }
    return true;
}

// Function to handle login submission via AJAX
function loginUser(event) {
    event.preventDefault(); // Prevent default form submission
    console.log("Form submission prevented");

    if (!validateLoginForm()) {
        console.log("Form validation failed");
        return; // Stop submission if validation fails
    }

    console.log("Form validated successfully");

    // Collect form data
    const form = event.target;
    const formData = new FormData(form);
    const params = new URLSearchParams(formData).toString();

    // Create and send AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "../../php/user_login.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) { // Request complete
            if (xhr.status === 200) { // Success
                console.log("Server response received"); // Debug message
                const response = xhr.responseText.trim();
                if (response === "success") {
                    window.location.href = "user.html"; // Redirect to user page on successful login
                } else {
                    displayMessage(response, "error"); // Display error message
                }
            } else {
                console.error("Server error: " + xhr.status); // Debug error
                displayMessage("An error occurred during login. Please try again.", "error");
            }
        }
    };

    console.log("Sending AJAX request"); // Debug message
    xhr.send(params); // Send the data to the server
}

// Attach the loginUser function to the form's submit event
document.getElementById('loginForm').addEventListener('submit', loginUser);

console.log("Login script loaded and event listener attached");
