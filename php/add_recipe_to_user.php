<?php
session_start();
include 'db.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Get the user ID from the session
$user_id = $_SESSION['user_id'];

// Get the recipe ID from the POST request
$data = json_decode(file_get_contents('php://input'), true);
$recipe_id = $data['recipeId'];

if (!$recipe_id) {
    echo json_encode(['success' => false, 'message' => 'Recipe ID not provided']);
    exit;
}


// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the recipe-user association already exists
$sql_check = "SELECT * FROM users_recipes WHERE user_id = ? AND recipe_id = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("ii", $user_id, $recipe_id);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Recipe already added']);
    exit;
}

// Insert the recipe-user association
$sql = "INSERT INTO users_recipes (user_id, recipe_id) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id, $recipe_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add recipe']);
}

$stmt->close();
$conn->close();
?>
