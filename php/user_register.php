<?php
session_start();
require_once 'db.php'; // Include your DB connection details

// // Check if user is logged in
// if (!isset($_SESSION['user_id'])) {
//     header('Location: ../pages/user_login.html'); // Redirect to login page if not logged in
//     exit;
// }

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Validate input
    if (empty($email) || empty($username) || empty($password) || empty($confirmPassword)) {
        echo "All fields are required.";
        exit;
    }

    if ($password !== $confirmPassword) {
        echo "Passwords do not match.";
        exit;
    }

    if (strlen($password) < 8) {
        echo "Password must be at least 8 characters long.";
        exit;
    }

    if (!preg_match('/\d/', $password)) {
        echo "Password must contain at least one number.";
        exit;
    }

    if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
        echo "Password must contain at least one special character.";
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Create a MySQLi connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and bind the SQL statement to check the email
    $stmt = $conn->prepare("SELECT email FROM Users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    // Check if email exists
    if ($stmt->num_rows > 0) {
        echo "This email is already registered.";
        $stmt->close();
        $conn->close();
        exit;
    } else {
        // Email does not exist, now check the username
        $stmt->close(); // Close the previous statement

        // Prepare and bind the SQL statement to check the username
        $stmt = $conn->prepare("SELECT username FROM Users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        // Check if username exists
        if ($stmt->num_rows > 0) {
            echo "This username is already registered.";
            $stmt->close();
            $conn->close();
            exit;
        }
    }

    // Close statement and connection
    $stmt->close();

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO Users (email, username, password_hash) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $hashedPassword);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Invalid request method.";
}
?>
