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

if (!isset($_REQUEST['note_id']))
{
    echo ("{'error':'note_id param is needed'}");
    exit();
}
$note_id = $_REQUEST['note_id'];

$conn = get_connection();
$result = run_query(
    $conn, 
    " 
    DELETE FROM `inclusive_whiteboard`.`sticky_notes`
    WHERE id = $note_id;
    "
);
$rows_affected = $conn->affected_rows;

if($rows_affected > 0){
    echo $note_id;
}else{
    echo -1;
}

mysqli_close($conn);
?>