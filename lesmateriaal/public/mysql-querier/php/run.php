<?php

include "db.inc.php";

$req = json_decode(file_get_contents('php://input'), false);

if ($req->query == '') {
    http_response_code(400);
    die("Query is empty");
}
if (!isset($req->database)) {
    http_response_code(400);
    die("No database selected");
}

$dbConn;
if ($req->readonly) {
    $dbConn = $readDbConn;
} else {
    $dbConn = $writeDbConn;
}

openDatabase($dbConn, $req->database);

try {
    $result = $dbConn->query($req->query);
} catch (Exception $e) {
    http_response_code(400);
    die($dbConn->error);
}

if ($result === true) {
    http_response_code(204);
    exit();
}

$columnNames = [];
foreach (mysqli_fetch_fields($result) as $field) {
    $columnNames[] = $field->name;
}

$rows = $result->fetch_all(MYSQLI_ASSOC);

if (isset($req->limit)) {
    $limit = (int) $req->limit;
    $offset = (int) $req->offset;
    $rows = array_slice($rows, $offset, $limit);
}

header("x-row-count: " . $result->num_rows);

$headers = getallheaders();

if (isset($headers['Accept']) && $headers['Accept'] == "text/csv") {
    $csv = "";
    foreach ($columnNames as $col) {
        $csv .= $col;
        $csv .= ", ";
    }
    $csv .= "\r\n";
    foreach ($result as $row) {
        foreach (array_values($row) as $col) {
            $csv .= $col;
            $csv .= ", ";
        }
        $csv .= "\r\n";
    }
    header("Content-Type: text/csv");
    echo $csv;
} else {
    header("Content-Type: application/json");
    echo json_encode($rows);
}
