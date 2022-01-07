<?php
session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "../mysqli_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

if (!isset($_REQUEST["id"]) && !isset($_REQUEST["new_position"]))
{

    echo ("{'error':'parameter id or new_position needed'}");
    exit();
}

$id = $_REQUEST["id"];
$new_position = $_REQUEST["new_position"];

$conn = get_connection();
$query = "UPDATE `inclusive_whiteboard`.`states` SET `position` = $new_position WHERE id=$id";

$result = run_query(
    $conn, 
    $query
);

if($result){
    // echo "Workflow Deleted";
    $last_id = $conn->insert_id;
    // echo ($last_id);
    echo $result;
}
else{
    echo -1;
}

mysqli_close($conn);
?>