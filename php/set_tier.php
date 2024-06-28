<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$tier = $data['tier'] ?? '';

if (!empty($tier)) {
    $_SESSION['tier'] = $tier;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid tier']);
}
?>
