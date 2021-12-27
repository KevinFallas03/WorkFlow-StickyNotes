<?php

$config = require 'config.php'; // import database credentials
if(!file_exists('config.php')){
    throw new \Exception('Create config.php based on config.sample.php');
}

function get_connection(){
    
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    $mysqli_conn = mysqli_connect(
        $config['host'], 
        $config['username'], 
        $config['password'], 
        $config['dbname']
    );
    
    if(!$mysqli_conn){
        echo mysqli_connect_error();
        exit();
    }
    
    $mysqli_conn->set_charset('utf8mb4');
    
    return ($mysqli_conn)
}

function run_query($conn,$query)
{
    $result = mysqli_query($conn, $query);
    if (!$result) 
    {
        $result_error = mysqli_error($conn);
        echo "[false,{'error':'Cannot run the query','error description':'$result_error'}]";
        exit;
    }
    return ($result);
}


?>
