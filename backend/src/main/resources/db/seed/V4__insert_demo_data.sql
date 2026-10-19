-- Dados de demonstração. Os horários são relativos ao momento em que o banco é criado.

-- Usuário: demo@foody.com / senha: foody123
INSERT INTO users (name, email, password_hash, created_at)
VALUES ('Usuário Demo', 'demo@foody.com', '$2a$10$iBa/wRjlNlsyQwmF5.TVnO9NqfzuOo789bNjEXwfCKiCv3UlyS0iq', CAST(strftime('%s', 'now') AS INTEGER) * 1000);

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Maria Silva', 'Rua das Flores, 123 - Centro', 1, (CAST(strftime('%s', 'now') AS INTEGER) - 120) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 120) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Pizza Margherita', 2, 45.90 FROM orders
UNION ALL SELECT MAX(id), 'Refrigerante 2L', 1, 12.50 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('João Souza', 'Av. Brasil, 500 - apto 32', 1, (CAST(strftime('%s', 'now') AS INTEGER) - 420) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 420) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Hambúrguer artesanal', 2, 32.00 FROM orders
UNION ALL SELECT MAX(id), 'Batata frita grande', 1, 18.00 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Patrícia Nunes', 'Rua Bela Vista, 88 - casa 3', 1, (CAST(strftime('%s', 'now') AS INTEGER) - 4440) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 4440) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Yakisoba de frango', 1, 42.90 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Carla Dias', 'Rua Verde, 10 - Jardim América', 2, (CAST(strftime('%s', 'now') AS INTEGER) - 1080) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 600) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Combinado de sushi (20 peças)', 1, 79.90 FROM orders
UNION ALL SELECT MAX(id), 'Temaki salmão', 2, 24.90 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Rafael Lima', 'Rua XV de Novembro, 845', 2, (CAST(strftime('%s', 'now') AS INTEGER) - 1500) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 900) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Açaí 500ml', 3, 18.50 FROM orders
UNION ALL SELECT MAX(id), 'Granola extra', 3, 3.00 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Ana Costa', 'Alameda Santos, 1200 - bloco B', 2, (CAST(strftime('%s', 'now') AS INTEGER) - 5280) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 4200) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Strogonoff de frango', 2, 36.90 FROM orders
UNION ALL SELECT MAX(id), 'Suco de laranja 500ml', 2, 9.90 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Pedro Alves', 'Rua das Acácias, 45', 3, (CAST(strftime('%s', 'now') AS INTEGER) - 2460) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 480) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Pizza Calabresa', 1, 42.90 FROM orders
UNION ALL SELECT MAX(id), 'Pizza Quatro Queijos', 1, 48.90 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Beatriz Rocha', 'Av. Paulista, 2000 - sala 81', 3, (CAST(strftime('%s', 'now') AS INTEGER) - 2160) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 720) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Salada Caesar', 2, 29.90 FROM orders
UNION ALL SELECT MAX(id), 'Água com gás', 2, 5.50 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Lucas Martins', 'Rua Augusta, 300', 4, (CAST(strftime('%s', 'now') AS INTEGER) - 5700) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 3000) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Pastel de carne', 4, 8.00 FROM orders
UNION ALL SELECT MAX(id), 'Caldo de cana 500ml', 2, 7.00 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Fernanda Gomes', 'Rua Harmonia, 77 - casa 2', 4, (CAST(strftime('%s', 'now') AS INTEGER) - 7800) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 5100) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Marmita fitness', 2, 27.50 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Thiago Ferreira', 'Rua Oscar Freire, 1500', 4, (CAST(strftime('%s', 'now') AS INTEGER) - 10800) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 8400) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Poke de salmão', 1, 46.90 FROM orders
UNION ALL SELECT MAX(id), 'Kombucha', 1, 14.00 FROM orders;

INSERT INTO orders (customer_name, delivery_address, status, created_at, updated_at)
VALUES ('Gustavo Ribeiro', 'Rua dos Pinheiros, 950', 5, (CAST(strftime('%s', 'now') AS INTEGER) - 4200) * 1000, (CAST(strftime('%s', 'now') AS INTEGER) - 3840) * 1000);
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT MAX(id), 'Lasanha à bolonhesa', 1, 39.90 FROM orders
UNION ALL SELECT MAX(id), 'Pudim', 2, 12.00 FROM orders;
