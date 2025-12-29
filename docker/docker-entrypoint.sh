#!/bin/bash
set -e

echo "🚀 Démarrage du conteneur Mind Map..."

# Générer JWT_SECRET si non défini
if [ -z "$JWT_SECRET" ]; then
    echo "🔐 Génération d'un JWT_SECRET aléatoire..."
    export JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=$JWT_SECRET" >> /app/backend/.env
    echo "✅ JWT_SECRET généré et sauvegardé"
fi

# Démarrer MySQL en arrière-plan
echo "📦 Démarrage de MySQL..."
service mysql start

# Attendre que MySQL soit prêt
echo "⏳ Attente de MySQL..."
until mysqladmin ping -h localhost --silent; do
    echo "En attente de MySQL..."
    sleep 2
done

echo "✅ MySQL est prêt"

# Créer la base de données et l'utilisateur
echo "🗄️ Configuration de la base de données..."
mysql -u root <<-EOSQL
    CREATE DATABASE IF NOT EXISTS mindmap;
    CREATE USER IF NOT EXISTS 'mindmap'@'localhost' IDENTIFIED BY 'mindmap_password';
    GRANT ALL PRIVILEGES ON mindmap.* TO 'mindmap'@'localhost';
    FLUSH PRIVILEGES;
EOSQL

echo "✅ Base de données configurée"

# Créer les tables et l'utilisateur admin
echo "👤 Création de l'utilisateur admin..."
cd /app/backend
node scripts/seed_admin.js || echo "⚠️ Seed admin déjà exécuté ou erreur"

echo "✅ Configuration terminée"

# Démarrer tous les services via supervisord
echo "🎯 Démarrage des services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
