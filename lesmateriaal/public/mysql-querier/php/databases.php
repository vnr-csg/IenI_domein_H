<?php
include "db.inc.php";

$result = $writeDbConn->query("SHOW databases");

foreach ($result as $row) {
    $dbName = $row["Database"];
    if ($dbName != "information_schema" && $dbName != "performance_schema" && $dbName != "mysql" && $dbName != "sys") {
        $databases[] = $row["Database"];
    }
}

header("Content-Type: application/json");
echo json_encode(array_values($databases));
