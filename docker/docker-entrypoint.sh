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

# Attendre que MySQL soit prêt
echo "⏳ Attente de MySQL..."
until nc -z -v -w30 $DB_HOST 3306; do
    echo "En attente de MySQL sur $DB_HOST:3306..."
    sleep 2
done

echo "✅ MySQL est accessible"

# Créer les tables et l'utilisateur admin
echo "👤 Création de l'utilisateur admin..."
cd /app/backend
node scripts/seed_admin.js || echo "⚠️ Seed admin déjà exécuté ou erreur"

echo "✅ Configuration terminée"

# Démarrer tous les services via supervisord
echo "🎯 Démarrage des services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
