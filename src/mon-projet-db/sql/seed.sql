INSERT INTO categories (id, name) VALUES
(1, 'Electronics'),
(2, 'Books'),
(3, 'Clothing'),
(4, 'Home & Kitchen');

INSERT INTO products (id, name, description, price, category_id) VALUES
(1, 'Smartphone', 'Latest model smartphone with advanced features', 699.99, 1),
(2, 'Laptop', 'High-performance laptop for gaming and work', 1299.99, 1),
(3, 'Novel', 'Bestselling novel of the year', 19.99, 2),
(4, 'T-shirt', 'Comfortable cotton t-shirt', 15.99, 3),
(5, 'Coffee Maker', 'Automatic coffee maker with programmable settings', 49.99, 4);

INSERT INTO customers (id, first_name, last_name, email, phone, address) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '1234567890', '123 Elm St, Springfield'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', '456 Oak St, Springfield');

INSERT INTO orders (id, customer_id, total, created_at) VALUES
(1, 1, 719.98, '2023-10-01 10:00:00'),
(2, 2, 15.99, '2023-10-02 11:30:00');

INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1, 699.99),
(2, 1, 5, 1, 49.99),
(3, 2, 4, 1, 15.99);