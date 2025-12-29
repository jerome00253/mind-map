const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const seedAdmin = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Vérifier si le compte existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@test.fr']
    );

    if (existing.length > 0) {
      console.log('✓ Compte admin existe déjà');
      connection.release();
      return;
    }

    // Créer le compte admin
    const passwordHash = await bcrypt.hash('pass123', 10);
    await connection.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@test.fr', passwordHash, 'admin']
      );
      console.log('✅ Admin user created');

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
