/* bron: https://en.wikipedia.org/wiki/List_of_the_verified_oldest_people */

DROP DATABASE IF EXISTS `oudstevrouwen`;
CREATE DATABASE `oudstevrouwen`;
USE `oudstevrouwen`;

CREATE TABLE vrouwen (
  id INT PRIMARY KEY,
  naam VARCHAR(255),
  geboortedatum DATE,
  land VARCHAR(255),
  sterfdatum DATE,
  leeftijd INT
);

INSERT INTO vrouwen (id, naam, geboortedatum, land, sterfdatum, leeftijd) VALUES
  (1, 'Jeanne Calment', '1875-02-21', 'Frankrijk', '1997-08-04', 122),
  (2, 'Sarah Knauss', '1880-09-24', 'Verenigde Staten', '1999-12-30', 119),
  (3, 'Nabi Tajima', '1900-08-04', 'Japan', '2018-04-21', 117),
  (4, 'Emma Morano', '1899-11-29', 'Italië', '2017-04-15', 117),
  (5, 'Violet Brown', '1900-03-10', 'Jamaica', '2017-09-15', 117),
  (6, 'Kane Tanaka', '1903-01-02', 'Japan', '2022-04-19', 119),
  (7, 'Maria Capovilla', '1889-09-14', 'Ecuador', '2006-08-27', 116),
  (8, 'Misao Okawa', '1898-03-05', 'Japan', '2015-04-01', 117),
  (9, 'Gertrude Weaver', '1898-07-04', 'Verenigde Staten', '2015-04-06', 116),
  (10, 'Tane Ikai', '1879-01-18', 'Japan', '1995-07-12', 116),
  (11, 'Elizabeth Bolden', '1890-08-15', 'Verenigde Staten', '2006-12-11', 116),
  (12, 'Carrie C. White', '1874-11-18', 'Verenigde Staten', '1991-02-14', 116),
  (13, 'Maggie Barnes', '1882-03-06', 'Verenigde Staten', '1998-01-19', 115),
  (14, 'Kamato Hongo', '1887-09-16', 'Japan', '2003-10-31', 116),
  (15, 'Mamie Eva Keith', '1873-03-22', ' Verenigde Staten', '1984-10-14', 111),
  (16, 'Dina Manfredini', '1897-04-04', 'Italië', '2012-12-17', 115),
  (17, 'Besse Cooper', '1896-08-26', 'Verenigde Staten', '2012-12-04', 116),
  (18, 'Jiroemon Kimura', '1897-04-19', 'Japan', '2013-06-12', 116),
  (19, 'Maria Gomes Valentim', '1896-07-09', 'Brazilië', '2011-06-21', 114),
  (20, 'Hendrikje van Andel-Schipper', '1890-06-29', 'Nederland', '2005-08-30', 115);
