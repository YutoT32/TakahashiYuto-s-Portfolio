-- 001_init.sql: データベースのスキーマを初期定義

/*
(1) productsテーブル
内容：商品情報
属性：商品ID、名前、説明、価格、在庫数、画像URL、作成日時
*/
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  stock INT NOT NULL,
  image_url VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
(2) ordersテーブル
内容：注文情報
属性：注文ID、合計金額、作成日時
*/
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
(3) order_itemsテーブル
内容：注文と商品の関連情報
属性：注文ID、商品ID、数量、単価
主キー：注文IDと商品IDの複合キー
外部キー：注文IDはordersテーブルのidを参照、商品IDはproductsテーブルのidを参照
*/
CREATE TABLE IF NOT EXISTS order_items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);