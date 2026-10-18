ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP;

UPDATE orders SET updated_at = created_at;
