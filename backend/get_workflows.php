<?php
//session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "mysqli_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

// if (!isset($_SESSION["id_usuario"]))
// {
//     echo ("[false,{'Error':'El usuario no ha realizado login'}]");
//     exit();
// }
// $id_usuario=$_SESSION["id_usuario"];

if (!isset($_REQUEST["user_id"]))
{
    echo ("{'error':'parameter user_id needed'}");
    exit();
}

$user_id=$_REQUEST["user_id"];

$conn = get_connection();

$workflows = run_query(
    $conn, 
    "SELECT id, user_id, name, description, creation_date FROM workflows WHERE user_id='$user_id'"
);


$json = mysqli_fetch_all ($workflows, MYSQLI_ASSOC);
echo json_encode($json );

// if ($row = mysqli_fetch_row ($workflows))
// {
//     // $_SESSION["id_usuario"] = $row[0];
//     // $_SESSION["email_usuario"] = $row[1];
//     echo "[true,
//         {
//             'id':'$row[0]',
//             'user_id':'$row[1]',
//             'name':'$row[2]',
//             'description':'$row[3]',
//             'creation_date':'$row[4]'
//         }]";
// }
// else
// {
//     echo "[false,{'error': 'user not found or user without any workflow'}]";
// }

mysqli_close($conn);
?>