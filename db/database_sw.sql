-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-01-2022 a las 18:12:04
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- BASE DE DATOS: `database_ws`

--
-- CREACIÓN DE LAS TABLAS
--

CREATE TABLE `timers` (
  `id_registro` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `codigo` varchar(500) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cedula` varchar(500) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombre` varchar(500) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `workers` (
  `codigo` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cedula` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombres` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apellidos` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cargo` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;


-- CREAMOS LOS INDICES DE LAS TABLAS

ALTER TABLE `timers`
  ADD PRIMARY KEY (`id_registro`);

ALTER TABLE `workers`
  ADD PRIMARY KEY (`codigo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
