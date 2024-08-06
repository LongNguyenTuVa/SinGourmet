<?php
session_start();
require_once 'db.php'; // Include your DB connection details

// // Check if user is logged in
// if (!isset($_SESSION['user_id'])) {
//     header('Location: ../pages/user_login.html'); // Redirect to login page if not logged in
//     exit;
// }

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userInput = $_POST['email'];
    $password = $_POST['password'];

    // Validate input
    if (empty($userInput) || empty($password)) {
        echo "Please fill in all fields.";
        exit;
    }

    // Create a MySQLi connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and bind
    $stmt = $conn->prepare("SELECT user_id, username, password_hash, tier FROM Users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $userInput, $userInput);
    $stmt->execute();
    $stmt->store_result();

    // Check if user exists
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($db_id, $db_username, $db_password, $tier);
        $stmt->fetch();

        // Verify password
        if (password_verify($password, $db_password)) {
            // Store username in session
            $_SESSION['user_id'] = $db_id;
            $_SESSION['tier'] = $tier;
            $_SESSION['username'] = $db_username;
            echo "success"; // Indicate success to the client
        } else {
            echo "Invalid email/username or password.";
        }
    } else {
        echo "No account found with that email/username.";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Invalid request method.";
}
?>
