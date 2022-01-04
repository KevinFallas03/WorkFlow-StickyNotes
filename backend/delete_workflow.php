<?php
session_start();

include "mysqli_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

if (!isset($_SESSION["user_id"]))
{
    echo ("{'error':'login needed'}");
    exit();
}
$user_id = $_SESSION["user_id"];

if (!isset($_REQUEST["workflow_id"]))
{
    echo ("{'error':'workflow_id parameters is needed'}");
    exit();
}
$workflow_id = $_REQUEST["workflow_id"]; 

$conn = get_connection();

$result = run_query(
    $conn, 
    "   
        DELETE FROM workflows 
        WHERE id = '$user_id' AND user_id = '$workflow_id';

    "
);
if($result!=false){
    echo "Workflow Deleted";
}
else{
    echo "Could not delete the workflow";
}

mysqli_close($conn);
?>