# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 5.7.21)
# Database: deallit_dev
# Generation Time: 2018-03-23 18:00:42 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `categorie_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name_eng` varchar(256) NOT NULL DEFAULT '',
  `id` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`categorie_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`categorie_id`, `name_eng`, `id`)
VALUES
	(1,'Auto / Moto','auto'),
	(2,'Technologie','tech'),
	(3,'Home','home'),
	(4,'Women','fashion-women'),
	(5,'Men','fashion-men'),
	(6,'Sports','sports'),
	(7,'Real estate','real-estate'),
	(8,'Fun','fun'),
	(9,'Services','services'),
	(10,'Groceries','groceries');

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table follows
# ------------------------------------------------------------

DROP TABLE IF EXISTS `follows`;

CREATE TABLE `follows` (
  `follow_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `followed_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`follow_id`),
  UNIQUE KEY `user_id` (`user_id`,`followed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;

INSERT INTO `follows` (`follow_id`, `user_id`, `followed_id`)
VALUES
	(14,5,5),
	(13,5,13);

/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table messages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `message_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(256) NOT NULL DEFAULT '',
  `from_id` int(11) unsigned NOT NULL,
  `to_id` int(11) unsigned NOT NULL,
  `seen` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;

INSERT INTO `messages` (`message_id`, `message`, `from_id`, `to_id`, `seen`)
VALUES
	(1,'blyat',5,6,0),
	(2,'',5,5,0),
	(3,'f',5,5,0),
	(4,'fffffff',5,5,0),
	(5,'edwdwef',5,6,0),
	(6,'wfewf',5,6,0),
	(7,'wfewfwf',5,6,0),
	(8,'wfewfwf',5,6,0),
	(9,'erferf',5,6,0),
	(10,'erg',5,6,0),
	(11,'ergerg',5,6,0),
	(12,'xd',5,6,0),
	(13,'asdasda',5,6,0),
	(14,'slt bb',5,10,0),
	(15,'bb',5,10,0),
	(16,'calme toi',5,10,0),
	(17,'c trop cher',5,10,0),
	(18,'dddd',10,5,0),
	(19,'ffff',10,5,0),
	(20,'mdr',10,5,0),
	(21,'oh gros',10,5,0),
	(22,'fdp',10,5,0),
	(23,'oh con',10,5,0),
	(24,'fait pas le type',10,5,0),
	(25,'xd',5,10,0),
	(26,'ftg',5,10,0),
	(27,'fewefwef',5,10,0);

/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table orders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `order_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery` enum('postal','in_person') NOT NULL DEFAULT 'in_person',
  `prefered_payment` enum('cash','credit_card_online','crypto','credit_card_in_person') NOT NULL DEFAULT 'crypto',
  `price_usd` int(11) DEFAULT NULL,
  `price_eur` int(11) DEFAULT NULL,
  `price_btc` bigint(11) DEFAULT NULL,
  `price_eth` bigint(11) DEFAULT NULL,
  `payed` tinyint(1) NOT NULL DEFAULT '0',
  `canceled` tinyint(1) NOT NULL DEFAULT '0',
  `shipped` tinyint(1) NOT NULL DEFAULT '0',
  `finished` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;

INSERT INTO `orders` (`order_id`, `user_id`, `product_id`, `date`, `delivery`, `prefered_payment`, `price_usd`, `price_eur`, `price_btc`, `price_eth`, `payed`, `canceled`, `shipped`, `finished`)
VALUES
	(9,5,57,'2018-03-04 03:12:49','in_person','crypto',65,80,2,NULL,1,0,0,0),
	(10,5,57,'2018-03-04 03:12:49','in_person','crypto',65,80,2,NULL,0,0,0,0),
	(11,5,57,'2018-03-04 03:12:49','in_person','crypto',65,80,2,NULL,0,0,0,0),
	(12,5,57,'2018-03-04 03:12:49','in_person','crypto',65,80,2,NULL,0,0,0,0);

/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table postal_adresses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `postal_adresses`;

CREATE TABLE `postal_adresses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `locality` varchar(256) DEFAULT NULL,
  `region` varchar(256) DEFAULT NULL,
  `postal_code` varchar(256) DEFAULT NULL,
  `country` varchar(256) DEFAULT NULL,
  `line1` varchar(256) DEFAULT NULL,
  `line2` varchar(256) DEFAULT NULL,
  `line3` varchar(256) DEFAULT NULL,
  `line4` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table product_ratings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `product_ratings`;

CREATE TABLE `product_ratings` (
  `product_rating_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating_title` varchar(256) NOT NULL DEFAULT '',
  `rating_description` varchar(256) NOT NULL DEFAULT '',
  `rating_value` int(3) unsigned NOT NULL,
  PRIMARY KEY (`product_rating_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table product_tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `product_tags`;

CREATE TABLE `product_tags` (
  `product_tag_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(11) unsigned NOT NULL,
  `tag` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`product_tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;

INSERT INTO `product_tags` (`product_tag_id`, `product_id`, `tag`)
VALUES
	(253,35,'voiture'),
	(254,35,'ford'),
	(258,34,'voiture'),
	(259,34,'porsche'),
	(260,33,'voiture'),
	(261,33,'aston martin'),
	(264,37,'tmtc'),
	(265,48,'bmw'),
	(266,36,'voiture'),
	(267,36,'mustang'),
	(268,47,'bmw');

/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table products
# ------------------------------------------------------------

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `product_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL DEFAULT '',
  `description` varchar(2048) DEFAULT '',
  `creator_id` int(11) unsigned NOT NULL,
  `images` varchar(256) DEFAULT NULL,
  `price_usd` int(11) unsigned DEFAULT NULL,
  `price_eur` int(11) unsigned DEFAULT NULL,
  `quantity` int(11) unsigned NOT NULL DEFAULT '1',
  `categorie_id` int(11) unsigned DEFAULT NULL,
  `state` enum('new','used') DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`product_id`, `name`, `description`, `creator_id`, `images`, `price_usd`, `price_eur`, `quantity`, `categorie_id`, `state`)
VALUES
	(1,'The blyat product','Its amazing really',1,'[\"http://i0.kym-cdn.com/photos/images/facebook/001/260/588/f4f.png\"]',123,0,1,NULL,NULL),
	(2,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(13,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(14,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(15,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(16,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(17,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(18,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(19,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(20,'The bike','Its amazing really',1,'https://s3.eu-west-2.amazonaws.com/my-market/images/286f5c78ba2eacc7b24dba1f14a82247',32,0,1,NULL,NULL),
	(34,'oiuoiuiououiuou','C\'est pas pour toi fpd',5,'[\"9eb5afffe1f7df2ee241bcb66a86032f\"]',32,0,1,1,NULL),
	(36,'La mustang de la pauvrete','dddd',5,'[\"a888d65946a4fd2c9f091f2961d784ab\"]',32,0,1,1,NULL),
	(37,'Aston martin db33','',6,'[\"bd5e70a4c3efb781446b798cdb71a3f4\"]',47000,0,1,1,NULL),
	(38,'Gtx 660ti 2Go','Tres bon etats, pas de soucis bb',10,'[\"1b46f36432bbe7ad712670ff7ad52002\"]',59,0,1,NULL,NULL),
	(39,'La mustang de la pauvrete','dddd',5,'[\"a888d65946a4fd2c9f091f2961d784ab\"]',32,0,1,1,NULL),
	(40,'Aston martin db33','',6,'[\"bd5e70a4c3efb781446b798cdb71a3f4\"]',47000,0,1,1,NULL),
	(41,'Gtx 660ti 2Go','Tres bon etats, pas de soucis bb',10,'[\"1b46f36432bbe7ad712670ff7ad52002\"]',59,0,1,NULL,NULL),
	(42,'La mustang de la pauvrete','dddd',5,'[\"a888d65946a4fd2c9f091f2961d784ab\"]',32,0,1,1,NULL),
	(43,'Aston martin db33','',6,'[\"bd5e70a4c3efb781446b798cdb71a3f4\"]',47000,0,1,1,NULL),
	(44,'Gtx 660ti 2Go','Tres bon etats, pas de soucis bb',10,'[\"1b46f36432bbe7ad712670ff7ad52002\"]',59,0,1,NULL,NULL),
	(45,'La mustang de la pauvrete','dddd',5,'[\"a888d65946a4fd2c9f091f2961d784ab\"]',32,0,1,1,NULL),
	(46,'Aston martin db33','',6,'[\"bd5e70a4c3efb781446b798cdb71a3f4\"]',47000,0,1,1,NULL),
	(47,'fdshjbkassafasdfasdfadsfasdfasdf','dsfasdfasdfasdf',5,'[\"23a2f18b928e7b87cde5bfadd593cee1\"]',44444,0,1,NULL,NULL),
	(48,'La bm','C&#x27;est trop pour toi bb',5,'[\"3c5d4ed54e93b1b271a5e3f0d649d41e\"]',420,0,1,NULL,NULL),
	(50,'Le canape','Dor boosted players only',5,'[\"5ca0c46edfd836cc45d2281765ae42f7\"]',150,0,1,NULL,NULL),
	(51,'Le derniersdfsdfsdfsdfsdf','blyatsdfsdfdsfsdfsdf',5,'[\"cea89fa74ca3bc7edce38eb73546d25c\"]',233,0,1,NULL,NULL),
	(52,'C\'est d\'une beaute','klergjklegjerger',5,'[\"29cf3ee55dab3935cc5109494462120a\"]',42222,0,1,NULL,NULL),
	(53,'fsfdsfsdsadfasasf','',5,NULL,423423,NULL,1,1,NULL),
	(54,'Ma voiture ','YO',5,'[\"f68e698a1bb5f8564ec9ec8a86171c4a\"]',42,NULL,1,1,NULL),
	(55,'Magnifique','DDDDDDDD',5,'[\"57a0f610deeaef8a59bddea50a4e74fc\"]',NULL,4222,1,1,NULL),
	(56,'oihoihioh','ihiohiohohioh',5,'[\"c89f6810cf975e9ab20238923351f20a\"]',NULL,64,1,1,NULL),
	(57,'Collection 29 livres des grands prix litteraires','mdr',13,'[\"da1fe3f4a2177445fb7ccb635b6f08ee\"]',NULL,80,1,1,NULL),
	(58,'2323232323','232323232323',5,NULL,22222,NULL,1,1,NULL);

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_notifications
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_notifications`;

CREATE TABLE `user_notifications` (
  `notification_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(256) NOT NULL DEFAULT '',
  `params` varchar(1024) DEFAULT '',
  `user_id` int(11) unsigned NOT NULL,
  `seen` int(11) DEFAULT NULL,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_notifications` WRITE;
/*!40000 ALTER TABLE `user_notifications` DISABLE KEYS */;

INSERT INTO `user_notifications` (`notification_id`, `type`, `params`, `user_id`, `seen`)
VALUES
	(1,'welcome-1','',5,NULL),
	(6,'order-transmitted-1','{\"order_id\":1}',5,NULL);

/*!40000 ALTER TABLE `user_notifications` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_transactions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_transactions`;

CREATE TABLE `user_transactions` (
  `transaction_id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `currency` enum('usd','eur','btc','eth','t_btc','t_eth') DEFAULT NULL,
  `value_deposit` bigint(64) DEFAULT NULL,
  `value_withdrawal` bigint(64) DEFAULT NULL,
  `value_local_sent` bigint(64) DEFAULT NULL,
  `value_local_received` bigint(64) DEFAULT NULL,
  `hash` varchar(1024) DEFAULT NULL,
  `order_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `contact_id` int(11) unsigned DEFAULT NULL,
  `wallet_id` int(11) unsigned DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `hash` (`hash`),
  UNIQUE KEY `order_id` (`order_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_transactions` WRITE;
/*!40000 ALTER TABLE `user_transactions` DISABLE KEYS */;

INSERT INTO `user_transactions` (`transaction_id`, `currency`, `value_deposit`, `value_withdrawal`, `value_local_sent`, `value_local_received`, `hash`, `order_id`, `user_id`, `contact_id`, `wallet_id`, `date`)
VALUES
	(6111,'t_btc',500000000,NULL,NULL,NULL,'64d93007f6143904df9dfe6fdecbc8589248da1733704e21918dfa25efc2d415',NULL,5,NULL,NULL,'2018-03-10 23:15:54'),
	(6112,'t_btc',500000000,NULL,NULL,NULL,'465fda023f3359a5287c6c15d916336016829e25b5a5df2eb72c763cf2bc134f',NULL,5,NULL,NULL,'2018-03-10 23:15:54'),
	(6113,'t_btc',500000000,NULL,NULL,NULL,'86a6cab716a99c8b107b47b0d2d96f868fed14ef77c4773044817147b1a5c6f4',NULL,5,NULL,NULL,'2018-03-10 23:15:54'),
	(6114,'t_btc',500000000,NULL,NULL,NULL,'534a5579246deb8e97bf6c918375300680f59a1f8dff76291cc7372a2bfa286e',NULL,5,NULL,NULL,'2018-03-10 23:15:54'),
	(6227,'t_btc',500000000,NULL,NULL,NULL,'71d2384855b6dfe6371f09494015f99c5507fc8c8164995be271ce9d91d73402',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6228,'t_btc',500000000,NULL,NULL,NULL,'bfbf223998cd75837fc12fed7ea221f73a462a61395c5596d469d8f8c8786d0a',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6230,'t_btc',500000000,NULL,NULL,NULL,'42bc50898f6ca731124f8aecda38f993a1f2df2bc76e611e2726e3ce6e1f9b2b',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6232,'t_btc',500000000,NULL,NULL,NULL,'03659b1bd7fa8362a7a147e056af71ab86cfe3e8aecdcfeb9e71a007d520b947',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6234,'t_btc',500000000,NULL,NULL,NULL,'2223d10558a0fc9610e87df05b74c528057209255b30422efc88888ad9c8256b',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6235,'t_btc',500000000,NULL,NULL,NULL,'38b43b5155733c4d37bbd607c76e6596d87e0b89b8877465064417586870a69b',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6236,'t_btc',500000000,NULL,NULL,NULL,'d5f6ccf4ba0f71a71c7235881555c20a932dc2c7aeab3738c86bfea51e6af5d6',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6237,'t_btc',500000000,NULL,NULL,NULL,'ef3e72fe7dfabf1e8256727cb64754212bb6d57609853be581188560cce8ba54',NULL,5,NULL,NULL,'2018-03-10 23:44:09'),
	(6272,'t_btc',500000000,NULL,NULL,NULL,'dd4bc9e107e710143491c36d35cd6e815918cd49879ef740f615d1ba62b511d1',NULL,5,NULL,NULL,'2018-03-10 23:49:39'),
	(6288,'t_btc',500000000,NULL,NULL,NULL,'0b515474d6ffe14fb35e97e7b9df0e3ef1b86bf1572269fa0d58d1c6d80de6f2',NULL,5,NULL,NULL,'2018-03-10 23:50:00'),
	(6294,'t_btc',500000000,NULL,NULL,NULL,'2d1a3f43da4e009ce07e63071e59e5311fce4dc9710dea8aac22fdb161519f52',NULL,5,NULL,NULL,'2018-03-10 23:50:23'),
	(6709,'t_btc',500000000,NULL,NULL,NULL,'058530a3108a55c1a24827726e7e53522c9bce21e074cee8fad904f42bcfc1fb',NULL,5,NULL,NULL,'2018-03-11 00:28:55'),
	(8095,'t_btc',500000000,NULL,NULL,NULL,'dc7e54bdde734285a28b40c9ec5972314abc4a7983c32e1ec807730d6c27d199',NULL,5,NULL,NULL,'2018-03-11 14:54:07'),
	(8107,'t_btc',500000000,NULL,NULL,NULL,'c9aad827b8b8bb1dd259a11d913e3640c732c38f329d6f75bb41c7bf0ca07027',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8114,'t_btc',500000000,NULL,NULL,NULL,'c16fb5d3781ec4b1be2c795449d06471bf31cf34d062824a60b6f66a167c9164',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8115,'t_btc',500000000,NULL,NULL,NULL,'2c5f8bb14673194825582b05faf4943470aa05627ab96813405f26545fe7606c',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8116,'t_btc',500000000,NULL,NULL,NULL,'80c2ee29591d8b3950fb20dea4a9a8cf3b2886c8cf861c24480245ac9f427998',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8117,'t_btc',500000000,NULL,NULL,NULL,'bbe98228714f5ae4d965c42e071afb7efb215c9390241144b121bfb5bf9fbd75',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8118,'t_btc',500000000,NULL,NULL,NULL,'8fee892423964a073fc13de38eeca4ca7f51e44b9de09c4d7192abb0948ff66e',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8121,'t_btc',500000000,NULL,NULL,NULL,'91c4527905bc9573d98b90cd4b1306f2899e442226bde57096905d33810749b2',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8122,'t_btc',500000000,NULL,NULL,NULL,'ff20d3196c51b5b60a57bc5b65ceed6e9b62ac604764d40425a875d204b202bc',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8124,'t_btc',500000000,NULL,NULL,NULL,'6ae35f39f3ccda437b772dcad343cee7cbca45555b38175325aa4f89d9ae09bc',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8125,'t_btc',500000000,NULL,NULL,NULL,'3db6654a1a7919d3eac2bb4b4129c70ba7af0e964992bf5a2eccc124a1438dce',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8128,'t_btc',500000000,NULL,NULL,NULL,'303c8f7a3aeb2cd81d52ea487102a2d28a0f55e748ae8a5253b5fcc39508a7dc',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8132,'t_btc',500000000,NULL,NULL,NULL,'7668d5b47efbafcfca69ac139972d50ee5bce54071f66a768f6600c3fe46b2eb',NULL,5,NULL,NULL,'2018-03-11 14:56:36'),
	(8370,'t_btc',200000000,NULL,NULL,NULL,'80c3ff8c6413d64927242df738b446030d887d8527c1109e576c0f6f59dd7537',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8372,'t_btc',200000000,NULL,NULL,NULL,'d40226d486c145991d89a8d3c7e76ea65222019a43e76510ef4b6695f6a83329',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8375,'t_btc',200000000,NULL,NULL,NULL,'065b2b26f7f09cefdde3bd262cf9777e21d7fccc6d878bb4498c9d7199c65556',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8382,'t_btc',200000000,NULL,NULL,NULL,'780776bfb327444c8d0619f4d3c425d6b04071c77ee5b8e88345dd26e28f158f',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8383,'t_btc',200000000,NULL,NULL,NULL,'c6604a4e8a3b90129d78c8f961fdf5ea23da6510ecce510815b07bd758cdf379',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8384,'t_btc',200000000,NULL,NULL,NULL,'998957a7b617758f9082224847644fffc62234079907db682dfe3453df9a1078',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8385,'t_btc',200000000,NULL,NULL,NULL,'997ef8430b63003d4c5f3533cca9682058b07b8ac37e00383ddd4793df01a290',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8388,'t_btc',500000000,NULL,NULL,NULL,'ea57b94b33106f3cd9b6b7ed638be67e216860c66544eaa9b06ac2627ae796a0',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8393,'t_btc',200000000,NULL,NULL,NULL,'a254432b4a003d2d6c6e2aa043ccdca989eedc15d2f47530a4dd26fd7d5bf9a4',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8398,'t_btc',200000000,NULL,NULL,NULL,'b113ae1d9865147848cca6516ca1464661ddd90920463714c772268340a7eed9',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8400,'t_btc',500000000,NULL,NULL,NULL,'8c22720e46741824c9cc75d832fa63b29e9cc4249b9d34a89f33b50671a1d3dd',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8401,'t_btc',200000000,NULL,NULL,NULL,'d88e544ab8c5514aea304baf17746539e070a75b95d1f8c5041ca8b5b68d7fe4',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8403,'t_btc',500000000,NULL,NULL,NULL,'3744786130b3b54c5c569dcc8ca8d79ba30e9209df50142b6c2f61007240a6e6',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8407,'t_btc',200000000,NULL,NULL,NULL,'c5d3934e860567c238229942520786472a7fb10587acdf77ddbad73800cc36be',NULL,5,NULL,NULL,'2018-03-11 15:04:42'),
	(8439,'t_btc',200000000,NULL,NULL,NULL,'e88ccfd93fd0a9504d451e71092155de3c564d94738f996a4b8bed3c317b33c5',NULL,5,NULL,NULL,'2018-03-11 15:05:59'),
	(8446,'t_btc',200000000,NULL,NULL,NULL,'3c6eb5442554f520aa03234e6b49385268430409db0a78afafccebc6759f05e5',NULL,5,NULL,NULL,'2018-03-11 15:05:59'),
	(8506,'t_btc',200000000,NULL,NULL,NULL,'229edf04aab70ccd2885bc9262e80811ed3595f475eef5f13cd43b9d61da5264',NULL,5,NULL,NULL,'2018-03-11 15:06:44'),
	(8529,'t_btc',200000000,NULL,NULL,NULL,'4fd4f49e43f7c187a740ccdcefe4ab2d8ea3ac2bdc9be1b5e5b725d4d6350e92',NULL,5,NULL,NULL,'2018-03-11 15:06:44'),
	(8549,'t_btc',200000000,NULL,NULL,NULL,'abb724961144a59a13f08407a7c13c0671456c28976a67a411ac333174ae0406',NULL,5,NULL,NULL,'2018-03-11 15:07:18'),
	(8590,'t_btc',200000000,NULL,NULL,NULL,'c20bf14eedfe68348c3f97442b3e50f3e372f14a11c32bb9c52b949639d442ff',NULL,5,NULL,NULL,'2018-03-11 15:07:18'),
	(9090,'t_btc',200000000,NULL,NULL,NULL,'83244eedc57addbd7b58e918868884162154d55be9991acb2575a52ef9f46812',NULL,5,NULL,NULL,'2018-03-11 15:19:33'),
	(9308,'t_btc',200000000,NULL,NULL,NULL,'79bf494e884146523dcbbbc18b711a2ac9c15c3fa30427266f108fcdaecf9b50',NULL,5,NULL,NULL,'2018-03-11 15:24:06'),
	(9361,'t_btc',200000000,NULL,NULL,NULL,'44bce97e22bc77113e5de3bd1243f8f91b75e277e0c6c3043799101ce0eba15a',NULL,5,NULL,NULL,'2018-03-11 15:28:59'),
	(9362,'t_btc',200000000,NULL,NULL,NULL,'2ddcb9e7ba79966cd2ef913fc850a9640bf61ee91de37abf1385c894d7fbfbc9',NULL,5,NULL,NULL,'2018-03-11 15:28:59'),
	(9423,'t_btc',200000000,NULL,NULL,NULL,'3fd4927c7dcccf67e8e2cc4893a7979b5908acb92e78c0a79005b51087e748d0',NULL,5,NULL,NULL,'2018-03-11 15:30:38'),
	(9552,'t_btc',200000000,NULL,NULL,NULL,'5f14a369f2a5e7a3585149434548503c90f6d2c20a1143401cffe1dc3d3d6f0f',NULL,5,NULL,NULL,'2018-03-11 15:31:36'),
	(9554,'t_btc',200000000,NULL,NULL,NULL,'1be5f2871e80f58a6a0c40e6bb229df903c6076c5e507088f9eb24834e507e3a',NULL,5,NULL,NULL,'2018-03-11 15:31:36'),
	(9737,'t_btc',200000000,NULL,NULL,NULL,'20f1b07ab5438cfc57f908abcc8f6256ad1d36a15ed3fc1fa38cdc3e034f887a',NULL,5,NULL,NULL,'2018-03-11 15:33:36'),
	(9883,'t_btc',200000000,NULL,NULL,NULL,'3d2abec43f76a8c14c9aab191b29c80d62c80e36be40e4b933f605e60b337d6e',NULL,5,NULL,NULL,'2018-03-11 15:35:52'),
	(9961,'t_btc',200000000,NULL,NULL,NULL,'1196b5afec32050ae558c98d25a393a420585b19d83115a2b6d3756bf817e95b',NULL,5,NULL,NULL,'2018-03-11 15:38:26'),
	(10108,'t_btc',200000000,NULL,NULL,NULL,'6ad3ff97205a0d2fb2fc2a9d4960a7ab14744ed91cece10156b479c92f3cf261',NULL,5,NULL,NULL,'2018-03-11 15:39:30'),
	(10246,'t_btc',200000000,NULL,NULL,NULL,'f99a8ba6a4493ab03ee92b455c6be20c33c4a6265921b49d542cadfc4d1b6580',NULL,5,NULL,NULL,'2018-03-11 15:40:04'),
	(10471,'t_btc',200000000,NULL,NULL,NULL,'8a016fa2304a664daacd10d44f296195f5204c11dcfc57c51fdc8476a0d5079b',NULL,5,NULL,NULL,'2018-03-11 15:40:53'),
	(10570,'t_btc',200000000,NULL,NULL,NULL,'f493923b443d04ef4089f9b881a6491fd410da670d27297a5956397ddc2b3d82',NULL,5,NULL,NULL,'2018-03-11 15:41:42'),
	(10664,'t_btc',200000000,NULL,NULL,NULL,'1e4b9ecf204c9e7d66f2ed1aa524d8fda554ce929d3b66c0b363eb13e44cb088',NULL,5,NULL,NULL,'2018-03-11 15:42:00'),
	(10754,'t_btc',200000000,NULL,NULL,NULL,'8d53393e8d45b8187ec28dda61bd8c2f0c61d339359434627188995879be0b77',NULL,5,NULL,NULL,'2018-03-11 15:44:55'),
	(10859,'t_btc',200000000,NULL,NULL,NULL,'0bf5ff703725cb209fb5a4323564bf98dc8f3c24c0a22d24128b39d97508ac48',NULL,5,NULL,NULL,'2018-03-11 15:46:57'),
	(11126,'t_btc',200000000,NULL,NULL,NULL,'d2d8014bdcbf9f3962cf25a572eed6c4a5007402584da9e75d67dc101853d32e',NULL,5,NULL,NULL,'2018-03-11 15:48:25'),
	(11194,'t_btc',200000000,NULL,NULL,NULL,'b0ced621acf19b34a383dc57c1b10afd8e04659b3d0da39e591822c7152e339a',NULL,5,NULL,NULL,'2018-03-11 15:50:29'),
	(12147,'t_btc',23190000000,NULL,NULL,NULL,'ec395eb3bc4ff1ea7a79c6f7ba0f67603e80e6094b995370be2e978f34c83502',NULL,5,NULL,NULL,'2018-03-11 16:55:16'),
	(12148,'t_btc',200000000,NULL,NULL,NULL,'6e966657fcc962f5ec5467ebcc9ae88a0eed8508b158c755f77f89832cf444a5',NULL,5,NULL,NULL,'2018-03-11 16:55:16'),
	(12149,'t_btc',200000000,NULL,NULL,NULL,'1a619af0f821083f595a34292d9f717fd4d4162deb1ded585e97b26c79ab48f5',NULL,5,NULL,NULL,'2018-03-11 16:55:16'),
	(12218,'t_btc',390000000,NULL,NULL,NULL,'baba855bac10d0891ca282dcc75329d67a0d2a698743deb1bf846db83ef33baa',NULL,5,NULL,NULL,'2018-03-11 17:40:59'),
	(12222,'t_btc',200000000,NULL,NULL,NULL,'7df57a9699f8b861cb73e7e6dcda563cb1d3cd8e255d5c37caeaa5cbe1b37467',NULL,5,NULL,NULL,'2018-03-11 17:40:59'),
	(12238,'t_btc',200000000,NULL,NULL,NULL,'43f420f8dd74a0365215d22c37742b5f6b991636dd15894742d3ed1ceee7206a',NULL,5,NULL,NULL,'2018-03-11 17:43:52'),
	(12635,'t_btc',300000000,NULL,NULL,NULL,'ac13c373b73cf9eaf452619b612749180b3af7c6dea480ea7175267eaa859a0d',NULL,5,NULL,NULL,'2018-03-11 19:49:11');

/*!40000 ALTER TABLE `user_transactions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_wallets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_wallets`;

CREATE TABLE `user_wallets` (
  `wallet_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `type` enum('btc','eth','t_btc','t_eth') DEFAULT NULL,
  `public_address` varchar(1024) NOT NULL DEFAULT '',
  `wif` varchar(1024) DEFAULT '',
  `is_segwit` int(1) NOT NULL DEFAULT '0',
  `balance` bigint(20) NOT NULL DEFAULT '0',
  `total_received` bigint(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`wallet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_wallets` WRITE;
/*!40000 ALTER TABLE `user_wallets` DISABLE KEYS */;

INSERT INTO `user_wallets` (`wallet_id`, `user_id`, `type`, `public_address`, `wif`, `is_segwit`, `balance`, `total_received`)
VALUES
	(14,5,'t_btc','n3yriEj8kpmt4HHY5M5JWsLfbJUgdJjaby','cTnpBJENE4csqRmoPmZRvQPd9U8DZXKuHV1ofLSN9GSUxwmdTroF',0,300000000,300000000);

/*!40000 ALTER TABLE `user_wallets` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mail` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL DEFAULT '',
  `two_fa_secret` varchar(256) DEFAULT NULL,
  `user_image` varchar(256) DEFAULT NULL,
  `first_name` varchar(256) DEFAULT NULL,
  `last_name` varchar(256) DEFAULT NULL,
  `gender` enum('man','woman') DEFAULT NULL,
  `currency` enum('eur','usd','btc') NOT NULL DEFAULT 'usd',
  `market_identifier` varchar(256) DEFAULT NULL,
  `market_name` varchar(256) DEFAULT NULL,
  `market_background` varchar(256) DEFAULT NULL,
  `seen_messages_id` int(11) unsigned DEFAULT NULL,
  `seen_notifications_id` int(11) unsigned DEFAULT NULL,
  `amount_btc` bigint(64) NOT NULL DEFAULT '0',
  `amount_eth` bigint(64) NOT NULL DEFAULT '0',
  `amount_t_btc` bigint(64) NOT NULL DEFAULT '0',
  `amount_t_eth` bigint(64) NOT NULL DEFAULT '0',
  `waiting_confirmation` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`user_id`, `mail`, `password`, `two_fa_secret`, `user_image`, `first_name`, `last_name`, `gender`, `currency`, `market_identifier`, `market_name`, `market_background`, `seen_messages_id`, `seen_notifications_id`, `amount_btc`, `amount_eth`, `amount_t_btc`, `amount_t_eth`, `waiting_confirmation`)
VALUES
	(5,'maestru2a@gmail.com','$2a$10$cmO/ifslKjQK.ybaUs1imuc404DZ7g/EffW1lPdSABgHOt8bErVk.',NULL,'88dfe046e285757c13f081fd5d21cceb','Jean Baptiste','Le dieu',NULL,'usd','gggg','The first store','7542f50d27843e8943c20ba3f4c9f9d7',NULL,NULL,0,0,47880000000,0,NULL),
	(6,'maestru2fa@gmail.com','$2a$10$GccVjrqzbLQAAa2Jw63VEOBY12eWdHqWumuMNe0Q2BFAJDE536f3K',NULL,NULL,'ddd','dddd','man','usd',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL),
	(7,'test@gmail.com','$2a$10$2w2NwpcgizYnQTd.ndLgvuFm6PX6xYN93h46rMvEIuWhOCh/Ne83u',NULL,NULL,NULL,NULL,'woman','usd',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL),
	(8,'database@ggmmg.cpd','$2a$10$RqxjE3FkS5J0HIjX7pcufugs0GTqq4RgDyOd1ZyqitYaTbYGgO0nG',NULL,NULL,NULL,NULL,'woman','usd',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL),
	(9,'ddddd@gmgg.com','$2a$10$zHy4LzwMnKT/EB9ul.pSrujmU/wfMSzipbdf5II5PctifKThKA5mq',NULL,NULL,NULL,NULL,'man','usd',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL),
	(10,'theblyat@gmail.com','$2a$10$lihAKW9qN1ksHoI2ZKmnEOXylejZuTK4bxrLGB/pIqUyS5DiNRZGC',NULL,'034252f275d788e2852298bcc42901f8','The blyat','xd',NULL,'usd',NULL,NULL,'ae530612b16d36796103689a26289114',NULL,NULL,0,0,0,0,NULL),
	(12,'34344','$2a$10$cmO/ifslKjQK.ybaUs1imuc404DZ7g/EffW1lPdSABgHOt8bErVk.',NULL,'43e5d375b20b78ec3efd99902069ca25','Jean Baptiste','Terrazzoni',NULL,'eur','gggg','The first store','5f35b5169fd423e344560ac551e8e948',NULL,NULL,0,0,0,0,NULL),
	(13,'jterrazzoni@gmail.com','$2a$10$RtMbKG13w.0sEppERMepDOpJt/uOAjssPJ0.SDKGhzh.veP88Jj3e',NULL,NULL,NULL,NULL,NULL,'usd',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
