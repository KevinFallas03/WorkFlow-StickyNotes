<?php
session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "../mysqli_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

if (!isset($_REQUEST["username"]) && !isset($_REQUEST["password"]))
{

    echo ("{'error':'parameter username or password needed'}");
    exit();
}

$username = $_REQUEST["username"];
$password = $_REQUEST["password"];

$conn = get_connection();
$query = "SELECT id, user, password FROM users WHERE user='$username' AND password=md5('$password');";

$result = run_query(
    $conn, 
    $query
);

if ($row = mysqli_fetch_row ($result)) {
    $_SESSION["user_id"] = $row[0];
    $_SESSION["username"] = $row[1];
    echo "[true, {'user_id':'$row[0]', 'username':'$row[1]'}]";
    header("Location: ../../index.html");
} else {
    echo "[false, {'error': 'user not found or user without any workflow'}]";
}

mysqli_close($conn);
?>