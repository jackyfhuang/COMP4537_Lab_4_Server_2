-- Database setup script for Lab 4
-- Run this script as MySQL root user or a user with CREATE DATABASE and GRANT privileges

-- Create the database
CREATE DATABASE IF NOT EXISTS lab4_patients_db;

-- Create read-only user (for SELECT queries only)
-- This user can ONLY execute SELECT statements - Principle of Least Privilege
CREATE USER IF NOT EXISTS 'lab4_readonly_user'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON lab4_patients_db.* TO 'lab4_readonly_user'@'localhost';
FLUSH PRIVILEGES;

-- Create insert user (for INSERT operations)
-- This user can execute SELECT, INSERT, and CREATE TABLE (for initial table creation only)
-- But NOT UPDATE, DELETE, DROP, ALTER, etc.
CREATE USER IF NOT EXISTS 'lab4_insert_user'@'localhost' IDENTIFIED BY 'insert_password';
GRANT SELECT, INSERT, CREATE ON lab4_patients_db.* TO 'lab4_insert_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify privileges (optional - run as root)
-- SHOW GRANTS FOR 'lab4_readonly_user'@'localhost';
-- SHOW GRANTS FOR 'lab4_insert_user'@'localhost';

-- Note: The table will be created automatically by the Node.js server
-- when the first INSERT operation is performed.
