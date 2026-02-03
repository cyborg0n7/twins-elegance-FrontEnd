CREATE VIEW vw_order_summary AS
SELECT 
    o.id AS order_id,
    c.first_name,
    c.last_name,
    c.email,
    c.phone,
    o.total,
    o.created_at,
    COUNT(oi.id) AS item_count
FROM 
    orders o
JOIN 
    customers c ON o.customer_id = c.id
LEFT JOIN 
    order_items oi ON o.id = oi.order_id
GROUP BY 
    o.id, c.first_name, c.last_name, c.email, c.phone, o.total, o.created_at;