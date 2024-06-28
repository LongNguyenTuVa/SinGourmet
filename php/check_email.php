<?php
require_once 'db.php'; // Include your DB connection details

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_POST['email']) || !isset($_POST['username'])) {
        echo "Invalid input. Both email and username are required.";
        exit;
    }
    $email = $_POST['email'];
    $username = $_POST['username']; // Retrieve the username from POST data

    // Create a MySQLi connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and bind
    $stmt = $conn->prepare("SELECT email, username FROM Users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $email, $username); // Bind both email and username parameters
    $stmt->execute();
    $stmt->store_result();

    // Initialize response variables
    $emailExists = false;
    $usernameExists = false;

    // Fetch the results
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($existingEmail, $existingUsername);
        while ($stmt->fetch()) {
            if ($existingEmail === $email) {
                $emailExists = true;
            }
            if ($existingUsername === $username) {
                $usernameExists = true;
            }
        }
    }

    // Prepare the response based on the checks
    if ($emailExists && $usernameExists) {
        echo "both_exist";
    } elseif ($emailExists) {
        echo "email_exists";
    } elseif ($usernameExists) {
        echo "username_exists";
    } else {
        echo "available";
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo "Invalid request method.";
}
?>

