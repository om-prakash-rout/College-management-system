<?php
include "db.php";

header("Content-Type: application/json");

$email = strtolower(trim($_GET['email'] ?? ''));

if (empty($email)) {
    echo json_encode(["error" => "Email required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        CONCAT(first_name, ' ', last_name) AS full_name,
        email,
        stream AS course,
        department AS branch
    FROM students 
    WHERE email = ?
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Student not found"]);
    exit;
}

$student = $result->fetch_assoc();

echo json_encode($student);

$stmt->close();
$conn->close();
?>
