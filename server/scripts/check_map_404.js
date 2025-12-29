const { pool } = require('../config/database');

const checkMap = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('--- CHECKING MAPS ---');
    const [rows] = await connection.execute('SELECT id, uuid, title, user_id FROM mindmaps');
    console.table(rows);
    
    const targetUuid = 'ebb68839-54cb-44ea-ae86-c1ccf3359d72';
    const found = rows.find(r => r.uuid === targetUuid);
    
    if (found) {
        console.log(`Target map ${targetUuid} FOUND. User ID: ${found.user_id}`);
    } else {
        console.log(`Target map ${targetUuid} NOT FOUND.`);
    }

    // Check users to verify ID
    const [users] = await connection.execute('SELECT id, email FROM users');
    console.table(users);

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkMap();
