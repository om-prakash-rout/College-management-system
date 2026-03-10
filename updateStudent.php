<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$id = $data['id'] ?? 0;
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

if (!$id) {
    echo json_encode(["error" => "Invalid student ID"]);
    exit;
}

if (!empty($data['password'])) {

    $password = $data['password'];

    $stmt = $conn->prepare("UPDATE students SET 
        first_name=?, 
        last_name=?, 
        gender=?, 
        dob=?, 
        roll_number=?, 
        stream=?, 
        honours=?, 
        department=?, 
        year_of_study=?, 
        email=?, 
        phone=?, 
        address=?, 
        guardian_name=?, 
        guardian_contact=?, 
        password=? 
        WHERE id=?");

    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $stmt->bind_param(
        "ssssssssissssssi",
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
        $password,
        $id
    );

} else {

    $stmt = $conn->prepare("UPDATE students SET 
        first_name=?, 
        last_name=?, 
        gender=?, 
        dob=?, 
        roll_number=?, 
        stream=?, 
        honours=?, 
        department=?, 
        year_of_study=?, 
        email=?, 
        phone=?, 
        address=?, 
        guardian_name=?, 
        guardian_contact=? 
        WHERE id=?");

    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $stmt->bind_param(
        "ssssssssisssssi",
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
        $id
    );
}

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
