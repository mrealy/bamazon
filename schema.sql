CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id int(10) AUTO_INCREMENT NOT NULL,
	item_id int(10) NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NULL,
    price int(10) NOT NULL,
	stock_quantity int(10) NOT NULL,
    PRIMARY KEY (id)
);