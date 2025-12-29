const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration de la connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mindmap',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Script de création des tables
const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Table users
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table users créée');

    // Table mindmaps
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mindmaps (
        id INT PRIMARY KEY AUTO_INCREMENT,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL DEFAULT 'Carte sans titre',
        data JSON NOT NULL,
        is_public BOOLEAN DEFAULT FALSE,
        share_token VARCHAR(64) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Table mindmaps créée');

    // Table share_permissions
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS share_permissions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        mindmap_id INT NOT NULL,
        user_id INT,
        permission ENUM('view', 'edit') DEFAULT 'view',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mindmap_id) REFERENCES mindmaps(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Table share_permissions créée');

    console.log('✅ Toutes les tables sont prêtes');
  } finally {
    connection.release();
  }
};

// Test de connexion
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL réussie');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  createTables,
  testConnection
};
