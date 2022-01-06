<?php
session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "../mysqli_connection.php";

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

echo "$name";
echo "$description";

$conn = get_connection();

$insert_wf_query = "INSERT INTO workflows
                    (
                        user_id
                        , name
                        , description
                    )
                    VALUES
                    (
                        $user_id
                        , '$name'
                        , '$description'
                    );";

$insert_result = run_query(
    $conn, 
    $insert_wf_query
);

if($conn->affected_rows <= 0) {
    echo "[false, {'error': 'could not insert the workflow'}]";
    exit();
}

$workflow_id = $conn->insert_id;

$queries = array(
    "  INSERT INTO states
        (
            user_id
            , workflow_id
            , name
            , position
        )
        VALUES
        (
            $user_id
            , $workflow_id
            , 'Unstarted'
            , 1
        );
    ",
    "  INSERT INTO states
        (
            user_id
            , workflow_id
            , name
            , position
        )
        VALUES
        (
            $user_id
            , $workflow_id
            , 'Started'
            , 2
        );
    ",
    "  INSERT INTO states
        (
            user_id
            , workflow_id
            , name
            , position
        )
        VALUES
        (
            $user_id
            , $workflow_id
            , 'Finised'
            , 3
        );
    "
);

foreach($queries as $query){
    $result = run_query(
        $conn, 
        $query
    );
}

if($conn->affected_rows > 0){
    echo "[true, {'success': 'workflow created'}]";
} else {
    echo "[false, {'error': 'states did not created'}]";
}

mysqli_close($conn);
?>