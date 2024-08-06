<?php
// Include the database configuration file
include 'db.php';

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start session to retrieve user ID
session_start();
$user_id = $_SESSION['user_id']; // Make sure the user is logged in and the user ID is stored in the session

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $conn->real_escape_string($_POST['title']);
    $description = $conn->real_escape_string($_POST['description']);
    $ingredients = $conn->real_escape_string($_POST['ingredients']);
    $steps = $conn->real_escape_string($_POST['steps']);
    $image = $conn->real_escape_string($_POST['image']);
    $tier = $conn->real_escape_string($_POST['tier']);

    // Insert the recipe into the database
    $sql = "INSERT INTO Recipes (creator_id, title, description, ingredients, steps, image, tier) 
            VALUES ('$user_id', '$title', '$description', '$ingredients', '$steps', '$image', '$tier')";

    if ($conn->query($sql) === TRUE) {
        echo "New recipe created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
    // Redirect back to user page after submission
    header("Location: ../pages/user.html");
    exit();
} else {
    echo "Invalid request method";
}
?>
