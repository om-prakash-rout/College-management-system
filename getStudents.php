<?php
include "db.php";
header("Content-Type: application/json");

$sql = "SELECT * FROM students ORDER BY id DESC";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$students = [];

while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);

$conn->close();
?>
