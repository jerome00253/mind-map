const { pool } = require('../config/database');

const debugDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('--- SCHEMA ---');
    const [columns] = await connection.execute('DESCRIBE users');
    console.table(columns);

    console.log('\n--- DATA ---');
    const [users] = await connection.execute('SELECT * FROM users');
    console.table(users);

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugDb();
