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

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES
(3205, "Cat statue", "Artifacts", 1000, 1),
(3420, "Gizmo", "Gadgets", 15, 5),
(2053, "Skis", "Sporting Goods", 150, 2),
(4023, "Laptop", "Computers", 600, 1),
(0598, "What to sell on bamazon?", "Self-Help Books", 10, 5),
(2039, "Cat Memes", "Bonus Points", 2, 9001);

SELECT * FROM products;
