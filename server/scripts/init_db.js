const { createTables } = require('../config/database');

async function initDatabase() {
  try {
    console.log('🗄️ Initialisation des tables...');
    await createTables();
    console.log('✅ Tables initialisées');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initDatabase();
