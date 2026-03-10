<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$id = $data['id'] ?? 0;

if (!$id) {
    echo json_encode(["error" => "Invalid student ID"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM students WHERE id = ?");

if (!$stmt) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
