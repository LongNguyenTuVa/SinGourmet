<?php
session_start();
// Include the database configuration file
include 'db.php';

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM recipes";
$result = $conn->query($sql);

$recipes = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tier = '';
        switch($row["tier"]) {
            case 1:
                $tier = 'Free';
                break;
            case 2:
                $tier = 'Community';
                break;
            case 3:
                $tier = 'Chef';
                break;
        }

        $recipes[] = array(
            'id' => $row["recipe_id"],
            'title' => $row["title"],
            'description' => $row["description"],
            'ingredient' => $row["ingredient"],
            'step' => $row["step"],
            'category' => $row["category"],
            'image_url' => $row["image_url"],
            'tier' => $tier
        );
    }
}

$conn->close();

$response = array(
    'recipes' => $recipes,
    'user_tier' => isset($_SESSION['tier']) ? $_SESSION['tier'] : '1' // default to 'free' if not set
);

header('Content-Type: application/json');
echo json_encode($response);
?>
