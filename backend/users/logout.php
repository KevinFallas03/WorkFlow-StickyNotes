<?php
session_start();
unset($_SESSION["user_id"]);
unset($_SESSION["username"]);
header("Location: /pages/login.html");
// echo ("<!DOCTYPE html>
// <html lang='en'>
// <head>
//     <meta charset='UTF-8'>
//     <meta http-equiv='X-UA-Compatible' content='IE=edge'>
//     <meta name='viewport' content='width=device-width, initial-scale=1.0'>
//     <head>
//         <meta http-equiv='refresh' content='0; URL=index.html' />
//     <title>Tarjetas: Saliendo del sistema!</title>
// </head>
// <body></body>
// </html>");
?>