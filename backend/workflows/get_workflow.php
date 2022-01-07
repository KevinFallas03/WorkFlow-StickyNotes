<?php
session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "../mysqli_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

if (!isset($_REQUEST["workflow_id"]))
{
    echo ("{'error':'workflow_id param needed'}");
    exit();
}

$workflow_id = $_REQUEST["workflow_id"];

$conn = get_connection();
$query = "  SELECT *
            FROM states s
            WHERE s.workflow_id='$workflow_id'
            ORDER BY s.position";

$workflow = run_query(
    $conn, 
    $query
);


$json = mysqli_fetch_all ($workflow, MYSQLI_ASSOC);
echo json_encode($json);

mysqli_close($conn);
?>