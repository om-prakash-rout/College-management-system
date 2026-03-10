<?php
include "db.php";

header("Content-Type: application/json");

$email = strtolower(trim($_GET['email'] ?? ''));

if (empty($email)) {
    echo json_encode(["error" => "Email required"]);
    exit;
}

$stmt = $conn->prepare("SELECT name, email, role FROM admin WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Admin not found"]);
    exit;
}

$admin = $result->fetch_assoc();

echo json_encode([
    "name" => $admin['name'],
    "email" => $admin['email'],
    "role" => $admin['role']
]);

$stmt->close();
$conn->close();
?>
