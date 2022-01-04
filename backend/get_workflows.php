<?php
session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "mysqli_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

if (!isset($_SESSION["user_id"]))
{
    echo ("{'error':'log in needed'}");
    exit();
}

$user_id=$_SESSION["user_id"];

$conn = get_connection();

$workflows = run_query(
    $conn, 
    "   SELECT 
            id
            , user_id
            , name
            , description
            , creation_date 
        FROM workflows 
        WHERE user_id='$user_id'
    "
);


$json = mysqli_fetch_all ($workflows, MYSQLI_ASSOC);
echo json_encode($json);

mysqli_close($conn);
?>