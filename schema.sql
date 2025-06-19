 Remove a base de dados se já existir, para começar do zero.
DROP DATABASE IF EXISTS bookmarks_db;
CREATE DATABASE bookmarks_db;

USE bookmarks_db;

-- Tabela de Utilizadores para guardar informações de login
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias (antigas pastas)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    parentId INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabela de Favoritos
CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    categoryId INT NULL,
    tags JSON,
    isPublic BOOLEAN DEFAULT FALSE,
    createdByUserId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabela de Tags
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    UNIQUE(ownerId, name), -- Garante que cada utilizador tem tags únicas
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
);
