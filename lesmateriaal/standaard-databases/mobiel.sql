DROP DATABASE IF EXISTS `mobiel`;
CREATE DATABASE `mobiel`;
USE `mobiel`;

CREATE TABLE `vrienden` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `naam` text NOT NULL,
    `plaats` text NOT NULL
);

CREATE TABLE `telefoons` (
    `code` varchar(3) PRIMARY KEY,
    `merk` text NOT NULL,
    `type` varchar(16) NOT NULL
);

CREATE TABLE `aankopen` (
    `id` int NOT NULL,
    `code` varchar(3) NOT NULL,
    `prijs` int,
    PRIMARY KEY (`id`,`code`),
    CONSTRAINT FOREIGN KEY (`id`) REFERENCES `vrienden` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT FOREIGN KEY (`code`) REFERENCES `telefoons` (`code`) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO `vrienden` (`id`, `naam`, `plaats`) VALUES
(1, 'Alan', 'Groningen'),
(2, 'Bob', 'Assen'),
(3, 'Christel', 'Heerlen'),
(4, 'Daphne', 'Groningen'),
(5, 'Eve', 'Heerlen'),
(6, 'Frits', 'Delft'),
(7, 'Gonny', 'Groningen'),
(8, 'Hajar', 'Emmen'),
(9, 'Ingo', 'Assen');

INSERT INTO `telefoons` (`code`, `merk`, `type`) VALUES
('a1', 'Apple', 'iPhone 13'),
('a2', 'Apple', 'iPhone 14'),
('a3', 'Apple', 'iPhone SE'),
('g1', 'Google', 'Pixel 6a'),
('g2', 'Google', 'Pixel 7'),
('o1', 'OnePlus', '11'),
('s1', 'Samsung', 'Galaxy A23'),
('s2', 'Samsung', 'Galaxy S23'),
('s3', 'Samsung', 'Z flip 4'),
('x1', 'Xiaomi', '12 Lite'),
('x2', 'Xiaomi', '12X');

INSERT INTO `aankopen` (`id`, `code`, `prijs`) VALUES
(1, 'a1', 819),
(6, 'a1', 849),
(4, 'a2', 929),
(8, 'g2', 589),
(9, 'o1', 869),
(2, 's1', 319),
(3, 's1', 299),
(8, 's1', 329),
(9, 's3', 929),
(7, 'x1', 415),
(8, 'x2', 499);