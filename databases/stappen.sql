-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: stappen
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `average_steps_per_country`
--

DROP TABLE IF EXISTS `average_steps_per_country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `average_steps_per_country` (
  `Country` varchar(14) DEFAULT NULL,
  `Average steps per day` int NOT NULL,
  PRIMARY KEY (`Average steps per day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `average_steps_per_country`
--

LOCK TABLES `average_steps_per_country` WRITE;
/*!40000 ALTER TABLE `average_steps_per_country` DISABLE KEYS */;
INSERT INTO `average_steps_per_country` (`Country`, `Average steps per day`) VALUES ('Indonesia',3513),('India',4297),('Australia',4491),('United States',4774),('Canada',4819),('France',5141),('Germany',5205),('United Kingdom',5444),('China',6189),('Hong Kong',6880);
/*!40000 ALTER TABLE `average_steps_per_country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stappen`
--

DROP TABLE IF EXISTS `stappen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stappen` (
  `datum` varchar(9) DEFAULT NULL,
  `aantal stappen` int NOT NULL,
  PRIMARY KEY (`aantal stappen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stappen`
--

LOCK TABLES `stappen` WRITE;
/*!40000 ALTER TABLE `stappen` DISABLE KEYS */;
INSERT INTO `stappen` (`datum`, `aantal stappen`) VALUES ('1-4-2021',1287),('1-5-2021',2120),('1-12-2021',2257),('1-11-2021',2554),('1-10-2021',2688),('1-3-2021',2690),('1-3-2024',2717),('1-7-2024',2941),('1-1-2021',3183),('1-9-2021',3248),('1-1-2024',3329),('1-2-2021',3377),('1-8-2021',3415),('1-6-2024',3422),('1-4-2024',3681),('1-4-2022',3864),('1-7-2021',3885),('1-2-2024',4008),('1-2-2023',4326),('1-11-2023',4404),('1-1-2023',4473),('1-12-2022',4499),('1-4-2023',4535),('1-8-2022',4620),('1-5-2022',4709),('1-3-2023',4715),('1-5-2023',4808),('1-11-2022',4843),('1-1-2022',4870),('1-2-2022',4995),('1-10-2022',5004),('1-6-2021',5047),('1-3-2022',5086),('1-6-2022',5177),('1-12-2023',5215),('1-5-2024',5237),('1-9-2023',5456),('1-8-2023',5662),('1-6-2023',5740),('1-7-2023',5772),('1-9-2022',6042),('1-10-2023',6898),('1-7-2022',7160);
/*!40000 ALTER TABLE `stappen` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-02 19:54:02
