<?php

include "db.inc.php";

$req = json_decode(file_get_contents('php://input'), false);

if ($req->query == '') {
    http_response_code(400);
    die("Query is empty");
}
if (!isset($req->db)) {
    http_response_code(400);
    die("No database selected");
}

$dbConn;
if ($req->readOnly) {
    $dbConn = $readDbConn;
} else {
    $dbConn = $writeDbConn;
}

openDatabase($dbConn, $req->$db);

try {
    $result = $dbConn->query($req->query);
} catch (Exception $e) {
    http_response_code(500);
    die($dbConn->error);
}


$columnNames = [];
foreach (mysqli_fetch_fields($result) as $field) {
    $columnNames[] = $field->name;
}

$limit = (int) $req->limit;
$offset = (int) $req->offset;

$count = $result->num_rows;
$rows = $result->fetch_all(MYSQLI_ASSOC);
$rows = array_slice($rows, $offset, $limit);


$res = (object)[];
$res->count = $count;
$res->headers = $columnNames;
$res->data = $rows; // TODO: Check if query has data

header("Content-Type: application/json");
echo json_encode($res);
