--Drops database if it already exists
DROP DATABASE IF EXISTS bamazon;

--Creates database for app
CREATE DATABASE bamazon;

--Declares which database we want to use
USE bamazon;

--Adds table with columns to database selected
CREATE TABLE products (
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL, 
price DECIMAL,
stock_quantity INT default 0,
PRIMARY KEY (id)
);