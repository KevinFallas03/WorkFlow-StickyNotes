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
$query = "  DELETE FROM workflows
            WHERE id = '$workflow_id' AND user_id = '$user_id'; ";

$result = run_query(
    $conn, 
    $query
);
$rows_affected = $conn->affected_rows;

if($rows_affected > 0){
    echo "[true, {'deleted': '$workflow_id'}]";
}else{
    echo "[false, {'error': 'no rows affected'}]";
}

mysqli_close($conn);
?>