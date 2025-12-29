const { pool } = require('../config/database');

const migrate = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('🔄 Checking if role column exists...');

    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM users LIKE 'role'
    `);

    if (columns.length === 0) {
      console.log('➕ Adding role column to users table...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password_hash
      `);
      console.log('✅ Role column added successfully');
    } else {
      console.log('ℹ️ Role column already exists');
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
