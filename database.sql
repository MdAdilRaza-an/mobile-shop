-- Create Database
CREATE DATABASE IF NOT EXISTS mobile_shop_db;
USE mobile_shop_db;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    brand VARCHAR(100),
    image VARCHAR(255),
    category_id INT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Cart Table
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Wishlist Table
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert Sample Categories
INSERT INTO categories (name, slug) VALUES
('Smartphones', 'smartphones'),
('Flagship', 'flagship'),
('Budget', 'budget'),
('Mid-Range', 'mid-range');

-- Insert Sample Products
INSERT INTO products (name, slug, description, price, stock, brand, image, category_id, is_featured) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Apple iPhone 15 Pro with A17 Pro chip, 48MP camera', 99999, 10, 'Apple', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 1, TRUE),
('Samsung Galaxy S24 Ultra', 'samsung-s24-ultra', 'Samsung Galaxy S24 Ultra with AI features, 200MP camera', 129999, 8, 'Samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 2, TRUE),
('Google Pixel 8', 'google-pixel-8', 'Google Pixel 8 with Tensor G3, amazing camera', 74999, 15, 'Google', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 1, TRUE),
('OnePlus 12', 'oneplus-12', 'OnePlus 12 with Snapdragon 8 Gen 3', 64999, 12, 'OnePlus', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500', 4, TRUE),
('Xiaomi 14', 'xiaomi-14', 'Xiaomi 14 with Leica camera', 59999, 20, 'Xiaomi', 'https://images.unsplash.com/photo-1678911820864-e5e6f2e3a36b?w=500', 4, FALSE);

-- Insert Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@mobileshop.com', '$2b$10$YourHashedPasswordHere', 'admin');

-- Note: Run backend first to hash password properly or use bcrypt to generate hash