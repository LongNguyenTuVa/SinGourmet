<?php
session_start();
require_once 'db.php'; // Include your DB connection details

// Check if the request is for fetching the session tier
if (isset($_GET['action']) && $_GET['action'] == 'get_tier') {
    $tier = $_SESSION['tier'] ?? '';
    echo json_encode(['tier' => $tier]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = trim($_POST['name']);
    $cardNum = str_replace(' ', '', trim($_POST['cardNum'])); // Remove spaces
    $expiryDate = trim($_POST['expiryDate']);
    $cvv = trim($_POST['CVV']);    

    // Ensure the form fields are not empty
    if(empty($name) || empty($cardNum) || empty($expiryDate) || empty($cvv)) {
        die("All fields are required.");
    }

    // Validate card number (must be 16 digits)
    if(!preg_match("/^\d{16}$/", $cardNum)) {
        die("Card number must be 16 digits.");
    }

    // Validate CVV (must be 3 digits)
    if(!preg_match("/^\d{3}$/", $cvv)) {
        die("CVV must be 3 digits.");
    }

    // Validate expiry date (MM/YY)
    if(!preg_match("/^\d{2}\/\d{2}$/", $expiryDate)) {
        die("Expiry date must be in MM/YY format.");
    }

    // Create a MySQLi connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $user_id = $_SESSION['user_id'];
    $new_tier = $_SESSION['tier']; // Example: You should set this based on the actual checkout process
    
    $sql = "UPDATE Users SET tier = ? WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $new_tier, $user_id);
    
    if ($stmt->execute()) {
        echo "Your subscription has been updated successfully.";
        header("Location: ../pages/user.html"); // Redirect to user page after successful update
    } else {
        echo "Error updating subscription: " . $conn->error;
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo "Invalid request method.";
}
?>
