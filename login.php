<?php
include "db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data['email'] ?? ''));
$password = trim($data['password'] ?? '');
$role = strtolower(trim($data['role'] ?? ''));

if (empty($email) || empty($password) || empty($role)) {
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

/* ---------- SELECT TABLE BASED ON ROLE ---------- */
switch ($role) {
    case "admin":
        $table = "admin";
        break;
    case "teacher":
        $table = "teachers";
        break;
    case "student":
        $table = "students";
        break;
    default:
        echo json_encode(["error" => "Invalid role"]);
        exit;
}

$stmt = $conn->prepare("SELECT * FROM $table WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

/* ---------- PASSWORD CHECK ---------- */

/* 
IF you are storing plain password (temporary)
*/
if ($user['password'] !== $password) {
    echo json_encode(["error" => "Incorrect password"]);
    exit;
}

/*
IF using hashed passwords (recommended):
if (!password_verify($password, $user['password'])) {
    echo json_encode(["error" => "Incorrect password"]);
    exit;
}
*/

/* ---------- SUCCESS ---------- */
echo json_encode([
    "success" => true,
    "role" => $role,
    "name" => $user['name'] ?? $user['full_name'] ?? $user['first_name'],
    "email" => $user['email']   // ⭐ IMPORTANT ADDITION
]);

$stmt->close();
$conn->close();
?>
