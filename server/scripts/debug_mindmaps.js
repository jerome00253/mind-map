const { pool } = require('../config/database');

const debugMindMaps = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('--- MINDMAPS DATA ---');
    const [rows] = await connection.execute('SELECT id, title, data FROM mindmaps ORDER BY id DESC LIMIT 1');
    
    if (rows.length > 0) {
      const map = rows[0];
      console.log('ID:', map.id);
      console.log('Title:', map.title);
      console.log('Data Type:', typeof map.data);
      console.log('Data Value (first 200 chars):', JSON.stringify(map.data).substring(0, 200));
      
      if (typeof map.data === 'string') {
          console.log('Data is string, attempting parse...');
          try {
              const parsed = JSON.parse(map.data);
              console.log('Parsed Root:', !!parsed.root);
              console.log('Parsed Theme:', !!parsed.theme);
          } catch(e) {
              console.log('Parse failed:', e.message);
          }
      } else {
           console.log('Data is object.');
           console.log('Root exists:', !!map.data.root);
           console.log('Theme exists:', !!map.data.theme);
      }
    } else {
        console.log('No mindmaps found.');
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugMindMaps();
