const { createTables, pool } = require('../config/database');

async function initSchema() {
  try {
    await createTables();
    console.log('✅ Schema initialized successfully.');
    pool.end();
  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
    pool.end();
    process.exit(1);
  }
}

initSchema();
