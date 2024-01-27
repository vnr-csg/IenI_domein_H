<?php
// Show errors for debugging
ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);
// Allow more memory for bigger databases
ini_set("memory_limit", "8192M");

// Database connections
$writeDbConn = new mysqli("127.0.0.1", "user", "password");
$readDbConn = new mysqli("127.0.0.1", "readonly", "password");

function openDatabase($conn, $db)
{
    try {
        $conn->query("USE " . $db);
    } catch (Exception $e) {
        http_response_code(404);
        die($conn->error);
    }
}
