<?php
include "db.inc.php";

if (!isset($_GET["db"])) {
    http_response_code(400);
    die("No database specified.");
}


openDatabase($readDbConn, $_GET["db"]);

try {
    $result = $readDbConn->query("SHOW tables");
} catch (Exception $e) {
    http_response_code(500);
    die("Failed to get database tables: " . $readDbConn->error);
}

$layouts = array();

foreach ($result as $row) {
    $tableName = array_values($row)[0];
    $layoutRow = array();
    try {
        $columnResult = $readDbConn->query(
            "SELECT COLUMN_NAME, DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = Database() AND TABLE_NAME='" . $tableName . "';"
        );
    } catch (Exception $e) {
        http_response_code(500);
        die("Failed to get layout: " . $readDbConn->error);
    }

    $columnNames = array();
    foreach ($columnResult as $columnRow) {
        $columnInfo = array();
        $columnInfo[0] = $columnRow["COLUMN_NAME"];
        $columnInfo[1] = $columnRow["DATA_TYPE"];
        $columnNames[] = $columnInfo;
    }
    $layoutRow['name'] = $tableName;
    $layoutRow['columns'] = $columnNames;
    $layouts[] = $layoutRow;
}
header("Content-Type: application/json");
echo json_encode($layouts);
