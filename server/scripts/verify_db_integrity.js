const { pool } = require('../config/database');

const verifyData = async () => {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute('SELECT * FROM users');
    
    console.log('--- RAW ROW DATA (JSON) ---');
    console.log(JSON.stringify(rows, null, 2));
    
    console.log('\n--- TYPE CHECKS ---');
    if (rows.length > 0) {
      const user = rows[0];
      console.log('Role value:', user.role);
      console.log('CreatedAt value:', user.created_at);
      console.log('Is "role" column actually holding the role?', user.role === 'admin' || user.role === 'user');
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

verifyData();
