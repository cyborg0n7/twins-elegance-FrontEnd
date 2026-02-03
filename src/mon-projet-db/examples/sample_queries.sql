-- Sample SQL Queries for Database Interaction

-- 1. Insert a new customer
INSERT INTO customers (first_name, last_name, email, phone, address)
VALUES ('John', 'Doe', 'john.doe@example.com', '1234567890', '123 Main St, Anytown, USA');

-- 2. Retrieve all products
SELECT * FROM products;

-- 3. Update a product's price
UPDATE products
SET price = 19.99
WHERE id = 1;

-- 4. Delete a customer
DELETE FROM customers
WHERE id = 2;

-- 5. Get all orders for a specific customer
SELECT o.id, o.total, o.created_at
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.id = 1;

-- 6. Get order details including items
SELECT o.id AS order_id, oi.product_id, oi.quantity, oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = 1;

-- 7. Get total sales by category
SELECT c.name AS category_name, SUM(oi.price * oi.quantity) AS total_sales
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
GROUP BY c.name;

-- 8. Count total customers
SELECT COUNT(*) AS total_customers FROM customers;

-- 9. Get the latest orders
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- 10. Get customer order summary
SELECT c.first_name, c.last_name, COUNT(o.id) AS total_orders, SUM(o.total) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;