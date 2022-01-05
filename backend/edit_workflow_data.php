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

if (!isset($_REQUEST['workflow_id']))
{
    echo ("{'error':'workflow_id parameter is needed'}");
    exit();
}
$workflow_id = $_REQUEST['workflow_id'];

if (!isset($_REQUEST['name']))
{
    echo ("{'error':'name parameter is needed'}");
    exit();
}
$name = $_REQUEST['name'];

if (!isset($_REQUEST['description']))
{
    echo ("{'error':'description parameter is needed'}");
    exit();
}
$description = $_REQUEST['description'];

$conn = get_connection();
$query = "  UPDATE workflows
            SET 
                  name = '$name'
                , description = '$description'
            WHERE 
                id = '$workflow_id';
        ";

$result = run_query(
    $conn, 
    $query
);

// $json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
$rows_affected = $conn->affected_rows;

if($result){
    echo "[true, {'updated': '$workflow_id', 'name':'$name', 'description': '$description'}]";
    //echo json_encode($json);
}else{
    echo "[false, {'error': 'no rows affected'}]";
}

mysqli_close($conn);
?>