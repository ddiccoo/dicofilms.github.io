<?php
$host = "localhost";
$user = "root"; 
$pass = "";     
$db   = "bukutamu_db";

$conn = mysqli_connect(hostname:'localhost', username: 'root', password:'', database:'bukutamu_db');

// Mengambil parameter offset dari URL, default 0
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$limit = 5; // Jumlah data per pemuatan

$sql = "SELECT nama, kehadiran, pesan, created_at FROM ucapan ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
$result = mysqli_query(mysql: $conn, query: $sql);

$ucapan = [];
while ($row = mysqli_fetch_assoc(result: $result)) {
    $ucapan[] = $row;
}

echo json_encode(value: $ucapan);
mysqli_close(mysql: $conn);
?>