CREATE TABLE orders (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name    VARCHAR(120) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    -- 1 RECEBIDO, 2 EM_PREPARO, 3 SAIU_PARA_ENTREGA, 4 ENTREGUE, 5 CANCELADO
    status           INTEGER      NOT NULL CHECK (status BETWEEN 1 AND 5),
    created_at       TIMESTAMP    NOT NULL
);

CREATE TABLE order_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER        NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_name VARCHAR(120)   NOT NULL,
    quantity     INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price   NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
