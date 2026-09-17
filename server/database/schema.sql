-- YieldRent Relational Database Schema
-- Smart Farmer Machinery Rental & Live Weather Monitoring System
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB (XAMPP phpMyAdmin)

CREATE DATABASE IF NOT EXISTS `yieldrent_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `yieldrent_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('farmer', 'owner', 'admin') NOT NULL DEFAULT 'farmer',
  `phone` VARCHAR(30) DEFAULT '',
  `location` VARCHAR(150) DEFAULT 'Maharashtra, India',
  `avatar` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Machinery Table
CREATE TABLE IF NOT EXISTS `machinery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `owner_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `brand_model` VARCHAR(100) NOT NULL,
  `hp_power` VARCHAR(50) DEFAULT '50 HP',
  `fuel_type` VARCHAR(50) DEFAULT 'Diesel',
  `hourly_rate` DECIMAL(10,2) NOT NULL,
  `daily_rate` DECIMAL(10,2) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `latitude` DECIMAL(10,6) DEFAULT 18.5204,
  `longitude` DECIMAL(10,6) DEFAULT 73.8567,
  `image_url` TEXT,
  `description` TEXT,
  `operational_guidelines` TEXT,
  `is_available` TINYINT(1) DEFAULT 1,
  `rating` DECIMAL(3,2) DEFAULT 4.80,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `machinery_id` INT NOT NULL,
  `farmer_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `rental_type` ENUM('daily', 'hourly') DEFAULT 'daily',
  `duration` INT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  `farmer_notes` TEXT,
  `owner_notes` TEXT,
  `weather_condition_at_booking` VARCHAR(100) DEFAULT 'Clear Sky',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`machinery_id`) REFERENCES `machinery`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Inquiries / Messaging Table
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `machinery_id` INT,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `machinery_id` INT NOT NULL,
  `farmer_id` INT NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`machinery_id`) REFERENCES `machinery`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Weather Logs Table
CREATE TABLE IF NOT EXISTS `weather_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `location` VARCHAR(150) NOT NULL,
  `temperature` DECIMAL(5,2),
  `condition_text` VARCHAR(100),
  `humidity` INT,
  `wind_speed` DECIMAL(5,2),
  `advisory` TEXT,
  `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
