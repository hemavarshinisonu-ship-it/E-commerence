-- E-Commerce Database Schema

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100),
  stock INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_cart_product (user_id, product_id)
);

-- 4. Wishlist Items Table (STEP 1 requirement)
CREATE TABLE IF NOT EXISTS wishlist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'paid',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed Initial Products
INSERT IGNORE INTO products (id, name, description, price, image, category, stock) VALUES
(1, 'Aura Wireless Noise-Canceling Headphones', 'Premium over-ear studio sound with active noise cancellation and 40-hour battery life.', 249.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'Electronics', 15),
(2, 'Minimalist Leather Smart Watch', 'Sleek OLED touchscreen display wrapped in genuine Italian leather strap.', 189.50, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'Electronics', 20),
(3, 'Ergonomic Mechanical Keyboard', 'RGB backlight with custom linear switches for satisfying tactile feel and low latency.', 129.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 'Electronics', 12),
(4, 'Urban Explorer Backpack', 'Waterproof canvas backpack with padded laptop sleeve and anti-theft hidden pockets.', 79.95, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Accessories', 30),
(5, 'Ultra-Lightweight Running Sneakers', 'Responsive cushioning sole designed for effortless long distance road running.', 119.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Apparel', 25),
(6, 'Retro Matte Black Sunglasses', 'Polarized UV400 protective lenses encased in handcrafted durable acetate frame.', 49.99, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', 'Accessories', 50),
(7, 'Aroma Essential Oil Diffuser', 'Ultrasonic whisper-quiet mist diffuser with 7 ambient LED mood light modes.', 39.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', 'Home', 40),
(8, 'Organic Heavyweight Hoodie', '100% organic cotton fleece drop-shoulder hoodie in muted earth tones.', 68.00, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', 'Apparel', 18);
