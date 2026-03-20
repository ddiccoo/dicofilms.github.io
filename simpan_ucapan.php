<?php
// Pengaturan Database
$host = "localhost";
$user = "root"; // Sesuaikan dengan username database Anda
$pass = "";     // Sesuaikan dengan password database Anda
$db   = "bukutamu_db";

$conn = mysqli_connect(hostname:'localhost', username: 'root', password:'', database:'bukutamu_db');

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// Menangkap data dari request POST
$nama = mysqli_real_escape_string(mysql: $conn, string: $_POST['nama']);
$kehadiran = mysqli_real_escape_string(mysql: $conn, string: $_POST['kehadiran']);
$pesan = mysqli_real_escape_string(mysql: $conn, string: $_POST['pesan']);

if (!empty($nama) && !empty($pesan)) {
    $sql = "INSERT INTO ucapan (nama, kehadiran, pesan) VALUES ('$nama', '$kehadiran', '$pesan')";
    
    if (mysqli_query(mysql: $conn, query: $sql)) {
        echo json_encode(value: ["status" => "success", "message" => "Ucapan berhasil dikirim"]);
    } else {
        echo json_encode(value: ["status" => "error", "message" => "Gagal menyimpan: " . mysqli_error(mysql: $conn)]);
    }
} else {
    echo json_encode(value: ["status" => "error", "message" => "Data tidak lengkap"]);
}

mysqli_close(mysql: $conn);
?>