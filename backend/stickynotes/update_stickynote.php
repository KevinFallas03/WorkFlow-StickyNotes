<?php
// session_start();

include "mysqli_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

// if (!isset($_SESSION["user_id"]))
// {
//     echo ("{'error':'login needed'}");
//     exit();
// }
// $user_id = $_SESSION["user_id"];

if (!isset($_POST['json_string']))
{
    echo ("{'error':'json_string body is needed'}");
    exit();
}
$body = $_POST['json_string'];
$data = json_decode($body);

$conn = get_connection();

$result = run_query(
    $conn, 
    "   
    UPDATE `inclusive_whiteboard`.`sticky_notes`
    SET `status_id` = 3,
        `html_code` = '$data->html_code',
        `description` = '$data->description'
    WHERE id = $data->note_id;
    "
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