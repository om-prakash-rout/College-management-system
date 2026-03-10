<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$first_name = $data['firstName'] ?? '';
$last_name = $data['lastName'] ?? '';
$gender = $data['gender'] ?? '';
$dob = $data['dob'] ?? '';
$roll_number = $data['rollNumber'] ?? '';
$stream = $data['stream'] ?? '';
$honours = $data['honors'] ?? '';
$department = $data['department'] ?? '';
$year = $data['yearOfStudy'] ?? 0;
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$address = $data['address'] ?? '';
$guardian_name = $data['guardianName'] ?? '';
$guardian_contact = $data['guardianContact'] ?? '';
$password = $data['password'] ?? '';

$stmt = $conn->prepare("INSERT INTO students 
(first_name,last_name,gender,dob,roll_number,stream,honours,department,year_of_study,email,phone,address,guardian_name,guardian_contact,password)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

if (!$stmt) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$stmt->bind_param(
    "ssssssssissssss",
    $first_name,
    $last_name,
    $gender,
    $dob,
    $roll_number,
    $stream,
    $honours,
    $department,
    $year,
    $email,
    $phone,
    $address,
    $guardian_name,
    $guardian_contact,
    $password
);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
