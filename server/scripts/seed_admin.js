const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const seedAdmin = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Check if user exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['jerome0025@gmail.com']
    );

    if (existing.length > 0) {
      console.log('🔄 Updating existing user to admin...');
      await connection.execute(
        'UPDATE users SET role = "admin" WHERE email = ?',
        ['jerome0025@gmail.com']
      );
      console.log('✅ User updated to admin');
    } else {
      console.log('➕ Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('pass123', salt);

      await connection.execute(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['jerome', 'jerome0025@gmail.com', passwordHash, 'admin']
      );
      console.log('✅ Admin user created');
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
