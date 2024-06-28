<?php
session_start();
require_once 'db.php'; // Include your DB connection details

// Function to get the user's profile picture path
function getProfilePicturePath($conn, $userId) {
    $stmt = $conn->prepare("SELECT profile_picture_url FROM Users WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($profilePicture);
    $stmt->fetch();
    $stmt->close();

    // Use a default image if the user does not have a profile picture
    return $profilePicture ?: "../assets/images_public/client2.jpg";
}

$response = array();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    $response['loggedIn'] = false;
    $response['success'] = false;
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['user_id'];
$response['loggedIn'] = true;

// Create a MySQLi connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle profile picture upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['profile_picture'])) {
    // Define the directory to save uploaded images
    $targetDir = "../profile_pics/";
    // Create the directory if it doesn't exist
    if (!file_exists($targetDir)) {
        // Attempt to create the directory
        if (!mkdir($targetDir, 0777, true)) {
            die(json_encode(['success' => false, 'message' => 'Failed to create directories. Check permissions.']));
        }
    }

    // File upload path
    $fileName = basename($_FILES["profile_picture"]["name"]);
    $targetFilePath = $targetDir . uniqid() . "_" . $fileName; // Add unique ID to prevent overwriting

    $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

    // Check if the file is an actual image
    $check = getimagesize($_FILES["profile_picture"]["tmp_name"]);
    if ($check !== false) {
        // Allow certain file formats
        $allowedTypes = array('jpg', 'jpeg', 'png', 'gif');
        if (in_array($imageFileType, $allowedTypes)) {
            // Move the file to the target directory
            if (move_uploaded_file($_FILES["profile_picture"]["tmp_name"], $targetFilePath)) {
                // Update the database with the new image path
                $stmt = $conn->prepare("UPDATE Users SET profile_picture_url = ? WHERE user_id = ?");
                if ($stmt === false) {
                    die(json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]));
                }
                
                $stmt->bind_param("si", $targetFilePath, $user_id);

                if ($stmt->execute()) {
                    // Return the new file path
                    $response['success'] = true;
                    $response['filePath'] = $targetFilePath;
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Database update failed: ' . $stmt->error;
                }

                $stmt->close();
            } else {
                $response['success'] = false;
                $response['message'] = 'File move failed.';
            }
        } else {
            $response['success'] = false;
            $response['message'] = 'Invalid file type.';
        }
    } else {
        $response['success'] = false;
        $response['message'] = 'File is not an image.';
    }

    $conn->close();
    echo json_encode($response);
    exit;
}

// Fetch user data for initial page load
$stmt = $conn->prepare("SELECT username, email FROM Users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($username, $email);
$stmt->fetch();
$stmt->close();

$response['username'] = $username;
$response['email'] = $email;
$response['filePath'] = getProfilePicturePath($conn, $user_id);
$response['success'] = true;

$conn->close();
echo json_encode($response);
?>
