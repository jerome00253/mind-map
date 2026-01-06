require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection, createTables } = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const mindmapsRoutes = require('./routes/mindmaps');
const shareRoutes = require('./routes/share');
const uploadRoutes = require('./routes/upload');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true, // Accepter toutes les origines pour le dev (ou spécifier ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'])
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mindmaps', mindmapsRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/upload', uploadRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mind Map API Server',
    version: '1.0.0'
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Démarrage du serveur
const startServer = async () => {
  console.log('🚀 Démarrage du serveur Mind Map...\n');

  // Tester la connexion à la base de données
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('\n❌ Impossible de démarrer le serveur sans connexion à la base de données');
    console.log('\n💡 Assurez-vous que MySQL est démarré dans Laragon');
    console.log('💡 Créez la base de données "mindmap" si elle n\'existe pas');
    process.exit(1);
  }

  // Créer les tables si nécessaire
  try {
    await createTables();
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error.message);
    process.exit(1);
  }

  // Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`\n🌐 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
    console.log('\nRoutes disponibles:');
    console.log('  POST   /api/auth/register  - Inscription');
    console.log('  POST   /api/auth/login     - Connexion');
    console.log('  GET    /api/auth/me        - Utilisateur courant');
    console.log('  GET    /api/mindmaps       - Liste des cartes');
    console.log('  GET    /api/mindmaps/:uuid - Détails d\'une carte');
    console.log('  POST   /api/mindmaps       - Créer une carte');
    console.log('  PUT    /api/mindmaps/:uuid - Mettre à jour');
    console.log('  DELETE /api/mindmaps/:uuid - Supprimer');
    console.log('  POST   /api/mindmaps/:uuid/share - Partager');
    console.log('  GET    /api/share/:token   - Accéder à une carte partagée');
  });
};

startServer();
