-- 002_seed.sql: 商品データを初期登録

-- Tシャツ、マグカップ、バックパックの3商品を登録
INSERT INTO products (name, description, price, stock, image_url) VALUES
('T-shirt', 'Simple T-shirt', 2500, 10, ''),
('Mug', 'Coffee mug', 1500, 20, ''),
('Backpack', 'Daypack', 8900, 5, '');