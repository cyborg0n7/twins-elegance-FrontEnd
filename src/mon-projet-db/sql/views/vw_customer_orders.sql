CREATE VIEW vw_customer_orders AS
SELECT 
    c.id AS customer_id,
    c.first_name,
    c.last_name,
    o.id AS order_id,
    o.total AS order_total,
    o.created_at AS order_date,
    oi.product_id,
    oi.quantity,
    oi.price AS item_price
FROM 
    customers c
JOIN 
    orders o ON c.id = o.customer_id
JOIN 
    order_items oi ON o.id = oi.order_id
ORDER BY 
    c.id, o.created_at;