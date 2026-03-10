<?php
$host = "sql103.infinityfree.com";
$user = "if0_41157190";
$pass = "Hk3qPEYbFrRN";   // Put your real password here
$dbname = "if0_41157190_college_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
