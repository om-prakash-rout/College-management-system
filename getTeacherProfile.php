<?php
include "db.php";

header("Content-Type: application/json");

$email = strtolower(trim($_GET['email'] ?? ''));

if (empty($email)) {
    echo json_encode(["error" => "Email required"]);
    exit;
}

$stmt = $conn->prepare("SELECT full_name, email, department, designation FROM teachers WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Teacher not found"]);
    exit;
}

$teacher = $result->fetch_assoc();

echo json_encode($teacher);

$stmt->close();
$conn->close();
?>
