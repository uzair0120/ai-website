-- Database Structure for AI-Powered Secure Document Search Portal
CREATE DATABASE IF NOT EXISTS `ai_doc_portal`;
USE `ai_doc_portal`;

CREATE TABLE IF NOT EXISTS `documents` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `content_text` LONGTEXT NOT NULL,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);