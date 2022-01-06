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

if (!isset($_POST['json_string']))
{
    echo ("{'error':'workflow_id parameters is needed'}");
    exit();
}
$body = $_POST['json_string'];
$data = json_decode($body);

$conn = get_connection();

$result = run_query(
    $conn, 
    "   
    INSERT INTO `inclusive_whiteboard`.`states`
    (`user_id`, `workflow_id`, `name`, `position`)
    VALUES (2, $data->workflow_id,'$data->name', $data->position);
    "
);

if($result){
    // echo "Workflow Deleted";
    $last_id = $conn->insert_id;
    echo ($last_id);
}
else{
    echo -1;
}

mysqli_close($conn);
?>