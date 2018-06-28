# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.21)
# Database: deallit_dev
# Generation Time: 2018-06-28 12:42:18 +0000
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
	(59,'Porsche 918 Spyder','',15,NULL,299000,NULL,1,1,NULL),
	(60,'Porsche 356','',15,NULL,483000,NULL,1,1,NULL),
	(61,'Porsche 917','',15,NULL,233000,NULL,1,1,NULL);

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
	(7,'welcome-1','',14,NULL),
	(8,'welcome-1','',15,NULL);

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
	(14,'test@test.com','$2a$10$YdhRE2Uy9dp1id1s68lq4eejTt9uOA.iwXqZ9OhAwfp6IPxqS34qe',NULL,NULL,NULL,NULL,NULL,'usd',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL),
	(15,'test2@test.com','$2a$10$mFNIrH1p/jVSYamwCqCsYOS3mcuN.QgPGZKt8A9kvzKpqjfN141wS',NULL,NULL,NULL,NULL,NULL,'usd',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
