-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 31-01-2025 a las 17:54:16
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tapleon`
--
CREATE DATABASE IF NOT EXISTS `tapleon` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tapleon`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bares`
--

DROP TABLE IF EXISTS `bares`;
CREATE TABLE `bares` (
  `id_bar` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `hora_apertura` time DEFAULT NULL,
  `hora_cierre` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bares`
--

INSERT INTO `bares` (`id_bar`, `nombre`, `direccion`, `telefono`, `hora_apertura`, `hora_cierre`) VALUES
(1, 'Bar Las Torres', 'Av. de Álvaro López Núñez, 25, León', '987234567', '12:00:00', '23:30:00'),
(2, 'Restaurante Ezequiel', 'Calle Ancha, 20, León', '987123456', '12:00:00', '23:30:00'),
(3, 'Casa Blas', 'C/ Sampiro, 1, León', '987345678', '12:00:00', '23:30:00'),
(4, 'Bar La Tizona', 'Calle de Ordoño IV, 10, León', '987456789', '12:00:00', '23:30:00'),
(5, 'Camarote Madrid', 'C/ Cervantes, 8, León', '987567890', '12:00:00', '23:30:00'),
(6, 'Bar Genarín', 'Plaza del Espolón, León', '987678901', '12:00:00', '23:30:00'),
(7, 'El Patio', 'Plaza Torres de Omaña, 2, León', '987789012', '12:00:00', '23:30:00'),
(8, 'Café Bar Rúa 11', 'Calle La Rúa, León', '987890123', '12:00:00', '23:00:00'),
(9, 'Cafetería Glamour', 'Av. de Nocedo, 73, 24007 León', '987890123', '08:00:00', '23:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido1` varchar(50) NOT NULL,
  `apellido2` varchar(50) DEFAULT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` char(128) NOT NULL,
  `tipo` enum('user','admin') DEFAULT 'user',
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido1`, `apellido2`, `nombre_usuario`, `contrasena`, `tipo`, `email`) VALUES
(1, 'Lidia', 'Saludes', 'González', 'lidiaSG', '5690b5e9e233d3364b35f57c0f66138b9bca1785d84b65fa46deb142f2244b21d6b55444542c1e06a176ad9e41c1bb00e0dd4ffc18a834d6aed75a8a1366f2df', 'admin', 'lidia@example.com'),
(2, 'María', 'López', NULL, 'mlopez', '5c0cbc0891604385d6bec1bc96be9d8f54a5584ac569fd29e6da69065bc1f5d37d9fd7fc0084283108d5fc95108c6bd278d491002e8856656fa64e34bb9a6625', 'user', 'maria.lopez@example.com'),
(3, 'Carlos', 'Hernández', 'Martínez', 'carlos_h', '1f92246ac13db9f5845af4963520e1dcfdabb692681a2db0a31ef7f1ae61596e956c630285cd223f36132ee3f7f69641817ddacf573ef6b69df1631809464f4d', 'user', 'carlos.hernandez@example.com'),
(4, 'Ana', 'Ramírez', 'Díaz', 'ana_rd', '41e4ddbb46fcb49f1c0ffaef36fb099c42dc6c1bcaf5aab3b451d13aa1225d0893ebb9e753424c2d2de17d21427c462adf8cee150aa9c67389081630d3861ce9', 'user', 'ana.ramirez@example.com'),
(5, 'Luis', 'García', NULL, 'luisg', 'ce93c9fb29f3208e6a8886eccab2e2ee741982c67295ea71f6530bdd21cc2fa9838c044383c09d25bad8338cfa49922bb22de0a86ff1e43bbcf4b6182920e1eb', 'user', 'luis.garcia@example.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
CREATE TABLE `favoritos` (
  `id_favorito` int(11) NOT NULL,
  `cliente` int(11) DEFAULT NULL,
  `tapa` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favoritos`
--

INSERT INTO `favoritos` (`id_favorito`, `cliente`, `tapa`) VALUES
(1, 2, 1),
(2, 3, 2),
(3, 3, 3),
(4, 3, 4),
(5, 2, 5),
(6, 2, 6),
(7, 4, 7),
(8, 4, 8),
(9, 3, 9),
(10, 4, 1),
(11, 2, 7),
(16, 5, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tapas`
--

DROP TABLE IF EXISTS `tapas`;
CREATE TABLE `tapas` (
  `id_tapa` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `alt` varchar(100) NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `bar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tapas`
--

INSERT INTO `tapas` (`id_tapa`, `titulo`, `alt`, `imagen`, `descripcion`, `bar`) VALUES
(1, 'Paella', 'Imagen paella', 'tapa04.webp', 'Arroz tradicional con mariscos y especias.', 1),
(2, 'Tabla de embutidos', 'Imagen tabla embutidos', 'tapa05.webp', 'Selección de salchichón, lomo y queso.', 2),
(3, 'Patatas gajo', 'Imagen patatas gajo', 'tapa06.webp', 'Crujientes patatas al horno con especias.', 3),
(4, 'Patatas bravas', 'Imagen patatas bravas', 'tapa07.webp', 'Patatas fritas con salsa picante.', 4),
(5, 'Tabla de salchichón', 'Imagen tabla salchichón', 'tapa08.webp', 'Lonchas salchichón artesanal con queso.', 5),
(6, 'Bruschetta', 'Imagen bruschetta', 'tapa09.webp', 'Pan tostado con tomate, albahaca y aceitunas.', 6),
(7, 'Pinchos mediterráneos', 'Imagen pinchos mediterráneos', 'tapa10.webp', 'Brochetas de queso, aceitunas y salchichón.', 7),
(8, 'Cortezas', 'Imagen cortezas', 'tapa11.webp', 'Crujientes cortezas de cerdo.', 8),
(9, 'Pinchos vascos', 'Imagen pinchos vascos', 'tapa12.webp', 'Brochetas variadas de aceitunas, salmón, queso y más.', 9),
(10, 'Tortilla de patata', 'Imagen Tortilla de patata', NULL, 'Tortilla de patata jugosa', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bares`
--
ALTER TABLE `bares`
  ADD PRIMARY KEY (`id_bar`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id_favorito`),
  ADD KEY `cliente` (`cliente`),
  ADD KEY `tapa` (`tapa`);

--
-- Indices de la tabla `tapas`
--
ALTER TABLE `tapas`
  ADD PRIMARY KEY (`id_tapa`),
  ADD KEY `bar` (`bar`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bares`
--
ALTER TABLE `bares`
  MODIFY `id_bar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id_favorito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `tapas`
--
ALTER TABLE `tapas`
  MODIFY `id_tapa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`tapa`) REFERENCES `tapas` (`id_tapa`);

--
-- Filtros para la tabla `tapas`
--
ALTER TABLE `tapas`
  ADD CONSTRAINT `tapas_ibfk_1` FOREIGN KEY (`bar`) REFERENCES `bares` (`id_bar`) ON DELETE CASCADE;

-- Crear un nuevo usuario
CREATE USER 'tapleon'@'localhost' IDENTIFIED BY 'tapleon';

-- Otorgar privilegios completos al usuario sobre la base de datos 'tapleon'
GRANT ALL PRIVILEGES ON tapleon.* TO 'tapleon'@'localhost';

-- Asegurarse de que los privilegios se apliquen inmediatamente
FLUSH PRIVILEGES;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
