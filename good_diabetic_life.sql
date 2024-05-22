-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2024 a las 12:36:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `good_diabetic_life`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blood_sugar`
--

CREATE TABLE `blood_sugar` (
  `id` int(11) NOT NULL,
  `hour` varchar(20) NOT NULL,
  `option_blood_sugar` varchar(20) NOT NULL,
  `blood_sugar` int(11) NOT NULL,
  `hyperglycemia` tinyint(1) NOT NULL,
  `hypoglycemia` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctor`
--

CREATE TABLE `doctor` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `image` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `hour` varchar(20) NOT NULL,
  `option_food` varchar(20) NOT NULL,
  `ingredients` varchar(1000) NOT NULL,
  `total_carbohydrates` double NOT NULL,
  `insulin` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `information`
--

CREATE TABLE `information` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `comment` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `information_blood_sugar`
--

CREATE TABLE `information_blood_sugar` (
  `id_information` int(11) NOT NULL,
  `id_blood_sugar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `information_food`
--

CREATE TABLE `information_food` (
  `id_information` int(11) NOT NULL,
  `id_food` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `information_sport`
--

CREATE TABLE `information_sport` (
  `id_information` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredient`
--

CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL,
  `ingredient` varchar(50) NOT NULL,
  `grams` double NOT NULL,
  `carbohydrates` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient`
--

CREATE TABLE `patient` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `image` blob NOT NULL,
  `weight` double DEFAULT NULL,
  `type_diabetes` varchar(20) DEFAULT NULL,
  `diabetes_treatment` varchar(20) DEFAULT NULL,
  `blood_sugar_min` int(11) DEFAULT NULL,
  `blood_sugar_max` int(11) DEFAULT NULL,
  `breakfast_quantity` double DEFAULT NULL,
  `lunch_quantity` double DEFAULT NULL,
  `dinner_quantity` double DEFAULT NULL,
  `ratio` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient_doctor`
--

CREATE TABLE `patient_doctor` (
  `id_patient` int(11) NOT NULL,
  `id_doctor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient_information`
--

CREATE TABLE `patient_information` (
  `id_patient` int(11) NOT NULL,
  `id_information` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient_ingredient`
--

CREATE TABLE `patient_ingredient` (
  `id_patient` int(11) NOT NULL,
  `id_ingredient` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ration_table`
--

CREATE TABLE `ration_table` (
  `id` int(11) NOT NULL,
  `ingredient` varchar(50) NOT NULL,
  `grams` double NOT NULL,
  `carbohydrates` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ration_table`
--

INSERT INTO `ration_table` (`id`, `ingredient`, `grams`, `carbohydrates`) VALUES
(1, 'Arroz', 80, 20),
(2, 'Arroz a la cubana', 190, 25),
(3, 'Macarrones', 100, 20),
(4, 'Macarrones con tomate', 150, 25),
(5, 'Espaguetis', 100, 20),
(6, 'Espaguetis con tomate', 150, 25),
(7, 'Garbanzos', 100, 20),
(8, 'Lentejas', 100, 20),
(9, 'Guisantes', 200, 20),
(10, 'Alubias', 100, 20),
(11, 'Patatas hervidas', 100, 20),
(12, 'Patatas fritas', 60, 20),
(13, 'Patatas chips', 30, 15),
(14, 'Bastoncitos de pan', 15, 10),
(15, 'Pan Krispolls', 30, 20),
(16, 'Pan de molde', 25, 12),
(17, 'Tostada pan blanco', 30, 20),
(18, 'Pan canapé', 2, 1.4),
(19, 'Pan integral', 9, 5.9),
(20, 'Pan mini tosta', 2, 7.5),
(21, 'Pan chapata', 6.3, 4.3),
(22, 'Pan blanco', 9, 6.6),
(23, 'Pan de pueblo', 10, 5),
(24, 'Pan', 20, 10),
(25, 'Tortita arroz integral', 6, 5.2),
(26, 'Cereales Special K', 15, 10),
(27, 'Cereales Choco Crispies', 15, 12),
(28, 'Cereales Chocos', 15, 12),
(29, 'Cereales Muesli', 15, 10),
(30, 'Galletas María', 30, 20),
(31, 'Galletas rellenas de chocolate', 30, 20),
(32, 'Fresas', 75, 5),
(33, 'Higos', 40, 5),
(34, 'Kiwi', 100, 10),
(35, 'Mandarina', 100, 10),
(36, 'Manzana', 150, 15),
(37, 'Melocotón', 130, 10),
(38, 'Melón', 280, 10),
(39, 'Naranja', 100, 10),
(40, 'Pera', 100, 10),
(41, 'Piña', 100, 10),
(42, 'Plátano', 50, 10),
(43, 'Sandía', 150, 10),
(44, 'Uva', 50, 10),
(45, 'Macedonia', 50, 10),
(46, 'Alcachofas', 300, 10),
(47, 'Coliflor', 300, 10),
(48, 'Ensalada', 150, 5),
(49, 'Ensalada mixta', 150, 10),
(50, 'Judía verde', 200, 10),
(51, 'Tomate', 300, 10),
(52, 'Almendras', 75, 5),
(53, 'Avellanas', 70, 5),
(54, 'Nueces', 150, 5),
(55, 'Aceitunas rellenas de anchoas', 50, 0.025),
(56, 'Maíz frito', 30, 20),
(57, 'Palomitas', 30, 20),
(58, 'Paella mixta', 125, 20),
(59, 'Tortilla de patatas', 100, 10),
(60, 'Croquetas', 90, 19),
(61, 'Empanadillas', 80, 20),
(62, 'Calamares', 120, 10),
(63, 'Pizza de jamón y queso', 100, 25),
(64, 'Hamburguesa', 254, 45.4),
(65, 'Ketchup', 9, 2),
(66, 'Canelones', 250, 27),
(67, 'Raviolis', 200, 52),
(68, 'Sushi roll', 40, 11.2),
(69, 'Döner Kebab', 350, 60),
(70, 'Durum Kebab', 400, 40),
(71, 'Salmorejo', 280, 26.2),
(72, 'Chiretas rebozadas', 150, 31.6),
(73, 'Fabada asturiana', 359, 35.5),
(74, 'Borrida de ratjada', 350, 32.9),
(75, 'Sancocho', 330, 35),
(76, 'Quesada pasiega', 72.5, 30.8),
(77, 'Corbata de Unquera', 30, 16.2),
(78, 'Morteruelo', 381, 51),
(79, 'Sobadillos', 48, 26.8),
(80, 'Crema catalana', 167, 26.48),
(81, 'Migas extremeñas', 192, 68.6),
(82, 'Empanada gallega', 212, 82.5),
(83, 'Patatas a la riojana', 307, 40.5),
(84, 'Cocido madrileño', 405, 66.45),
(85, 'Michirones', 230, 41.8),
(86, 'Txantxigorri', 106, 40.74),
(87, 'Marmitako', 485, 40),
(88, 'Fideuá', 490, 73.3),
(89, 'Couscous', 369, 66.5),
(90, 'Copa chocolate y nata', 115, 20),
(91, 'Gelatina', 90, 13.7),
(92, 'Donut', 58, 25),
(93, 'Cruasán', 61, 35),
(94, 'Ensaimada', 76, 30),
(95, 'Magdalena', 50, 20),
(96, 'Helado vainilla', 160, 35),
(97, 'Pastel de chocolate', 105, 45),
(98, 'Tarta de Santiago', 75, 35),
(99, 'Tarta de manzana', 107, 40),
(100, 'Chocolate con leche', 20, 10),
(101, 'Mermelada', 15, 10.2),
(102, 'Cerveza', 333, 15),
(103, 'Cava brut', 100, 1.5),
(104, 'Vino tinto', 100, 0.2),
(105, 'Carajillo', 70, 0),
(106, 'Coñac', 75, 0),
(107, 'Licor de frutas', 30, 10.5),
(108, 'Leche semidesnatada', 200, 9.2),
(109, 'Queso fresco', 150, 5),
(110, 'Quesito en porciones', 31, 1.7),
(111, 'Queso manchego semi', 54, 0.8),
(112, 'Queso en lonchas', 58, 2.2),
(113, 'Flan de huevo', 125, 25),
(114, 'Natillas', 125, 25),
(115, 'Yogur natural', 125, 5),
(116, 'Yogur natural azucarado', 125, 15),
(117, 'Yogur natural sabores', 125, 15),
(118, 'Yogur denatado natural', 125, 5.5),
(119, 'Yogur desnatado con frutas', 125, 10.8),
(120, 'Actimel', 94, 10),
(121, 'Petit suise', 55, 10),
(122, 'Tofu', 95, 3.1),
(123, 'Seitán', 100, 2.8),
(124, 'Hamburguesa vegetal', 75, 11.6),
(125, 'Crema de calabacín', 420, 7.7),
(126, 'Tropezones', 15, 1),
(127, 'Crema de calabaza', 301, 15),
(128, 'Sopa de estrellas', 150, 20),
(129, 'Papilla de verduras con pollo', 259, 10),
(130, 'Pan con chocolate', 30, 15),
(131, 'Merluza rebozada', 70, 5),
(132, 'Varitas de pescado', 60, 13),
(133, 'Pollo empanado', 70, 4),
(134, 'Papilla de frutas', 200, 26),
(135, 'Papilla de pera con yogur', 180, 16),
(136, 'Papilla de cereales', 100, 15),
(137, 'Crep', 75, 22),
(138, 'Crep de chocolate', 90, 3.1),
(139, 'Crep de jamón y queso', 155, 2.6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sport`
--

CREATE TABLE `sport` (
  `id` int(11) NOT NULL,
  `hour` varchar(20) NOT NULL,
  `type_sport` varchar(50) NOT NULL,
  `sport_time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `blood_sugar`
--
ALTER TABLE `blood_sugar`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `information`
--
ALTER TABLE `information`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `information_blood_sugar`
--
ALTER TABLE `information_blood_sugar`
  ADD KEY `id_information` (`id_information`,`id_blood_sugar`),
  ADD KEY `id_blood_sugar` (`id_blood_sugar`);

--
-- Indices de la tabla `information_food`
--
ALTER TABLE `information_food`
  ADD KEY `id_information` (`id_information`,`id_food`),
  ADD KEY `id_food` (`id_food`);

--
-- Indices de la tabla `information_sport`
--
ALTER TABLE `information_sport`
  ADD KEY `id_information` (`id_information`,`id_sport`),
  ADD KEY `id_sport` (`id_sport`);

--
-- Indices de la tabla `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `patient_doctor`
--
ALTER TABLE `patient_doctor`
  ADD KEY `id_patient` (`id_patient`,`id_doctor`),
  ADD KEY `id_doctor` (`id_doctor`);

--
-- Indices de la tabla `patient_information`
--
ALTER TABLE `patient_information`
  ADD KEY `id_patient` (`id_patient`,`id_information`),
  ADD KEY `id_information` (`id_information`);

--
-- Indices de la tabla `patient_ingredient`
--
ALTER TABLE `patient_ingredient`
  ADD KEY `id_patient` (`id_patient`,`id_ingredient`),
  ADD KEY `id_ingredient` (`id_ingredient`);

--
-- Indices de la tabla `ration_table`
--
ALTER TABLE `ration_table`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `sport`
--
ALTER TABLE `sport`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `blood_sugar`
--
ALTER TABLE `blood_sugar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `doctor`
--
ALTER TABLE `doctor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `information`
--
ALTER TABLE `information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `patient`
--
ALTER TABLE `patient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ration_table`
--
ALTER TABLE `ration_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT de la tabla `sport`
--
ALTER TABLE `sport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `information_blood_sugar`
--
ALTER TABLE `information_blood_sugar`
  ADD CONSTRAINT `information_blood_sugar_ibfk_1` FOREIGN KEY (`id_information`) REFERENCES `information` (`id`),
  ADD CONSTRAINT `information_blood_sugar_ibfk_2` FOREIGN KEY (`id_blood_sugar`) REFERENCES `blood_sugar` (`id`);

--
-- Filtros para la tabla `information_food`
--
ALTER TABLE `information_food`
  ADD CONSTRAINT `information_food_ibfk_1` FOREIGN KEY (`id_information`) REFERENCES `information` (`id`),
  ADD CONSTRAINT `information_food_ibfk_2` FOREIGN KEY (`id_food`) REFERENCES `food` (`id`);

--
-- Filtros para la tabla `information_sport`
--
ALTER TABLE `information_sport`
  ADD CONSTRAINT `information_sport_ibfk_1` FOREIGN KEY (`id_information`) REFERENCES `information` (`id`),
  ADD CONSTRAINT `information_sport_ibfk_2` FOREIGN KEY (`id_sport`) REFERENCES `sport` (`id`);

--
-- Filtros para la tabla `patient_doctor`
--
ALTER TABLE `patient_doctor`
  ADD CONSTRAINT `patient_doctor_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id`),
  ADD CONSTRAINT `patient_doctor_ibfk_2` FOREIGN KEY (`id_doctor`) REFERENCES `doctor` (`id`);

--
-- Filtros para la tabla `patient_information`
--
ALTER TABLE `patient_information`
  ADD CONSTRAINT `patient_information_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id`),
  ADD CONSTRAINT `patient_information_ibfk_2` FOREIGN KEY (`id_information`) REFERENCES `information` (`id`);

--
-- Filtros para la tabla `patient_ingredient`
--
ALTER TABLE `patient_ingredient`
  ADD CONSTRAINT `patient_ingredient_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id`),
  ADD CONSTRAINT `patient_ingredient_ibfk_2` FOREIGN KEY (`id_ingredient`) REFERENCES `ingredient` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
