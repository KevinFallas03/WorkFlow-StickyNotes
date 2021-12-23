<?php

if(!file_exists('config.php')){
    throw new \Exception('Create config.php based on config.sample.php');
}

$config = require 'config.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = mysqli_connect($config['host'], $config['username'], $config['password'], $config['dbname']);

if(!$mysqli){
    echo mysqli_connect_error();
    die();
}

$mysqli->set_charset('utf8mb4');

echo "<h1>WorkFlow</h1>";
echo "Database Connected Successfully";

?>
