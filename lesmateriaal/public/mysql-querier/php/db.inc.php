<?php
// Show errors for debugging
ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);
// Allow more memory for bigger databases
ini_set("memory_limit", "8192M");

// Database connections
$rootDbConn = new mysqli("127.0.0.1", "user", "password");
$readDbConn = new mysqli("127.0.0.1", "readonly", "password");
 