-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 20-11-2021 a las 21:40:26
-- Versión del servidor: 10.3.16-MariaDB
-- Versión de PHP: 8.

-- ****************************** --
--            TABLES              --
-- ****************************** --

-- INCOMPLETO NO USAR AUN 
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(11) NOT NULL PRIMARY KEY,
  `user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `workflows` (
  `id_workflow` int(11) NOT NULL PRIMARY KEY,
  `id_user` int(11) NOT NULL KEY,
  `workflow_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workflow_description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workflow_colour` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sticky_notes` (
  `id_sticky_note` int(11) NOT NULL PRIMARY KEY,
  `id_user` int(11) DEFAULT NULL KEY,
  `id_workflow` int(11) DEFAULT NULL KEY,
  `status` int(1) NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colour` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deadline` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;






