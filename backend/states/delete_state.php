<?php
session_start();

include "../mysqli_connection.php";

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

if (!isset($_REQUEST['state_id']))
{
    echo ("{'error':'state_id param is needed'}");
    exit();
}
$state_id = $_REQUEST['state_id'];

$delete_stickynotes_query = "DELETE FROM sticky_notes WHERE status_id = $state_id";
$delete_state_query = "DELETE FROM states WHERE id = $state_id;";

$conn = get_connection();

$result = run_query(
    $conn, 
    $delete_stickynotes_query
);

$result = run_query(
    $conn, 
    $delete_state_query
);

$rows_affected = $conn->affected_rows;

if($rows_affected > 0){
    echo "[true, {'successfull': 'state deleted'}]";
}else{
    echo "[true, {'error': 'could not delete the state'}]";
}

mysqli_close($conn);
?>