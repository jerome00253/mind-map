FROM ubuntu:22.04

# Éviter les prompts interactifs
ENV DEBIAN_FRONTEND=noninteractive

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    nginx \
    mysql-server \
    nodejs \
    npm \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Créer les répertoires nécessaires
RUN mkdir -p /app/backend /app/frontend /var/log/supervisor

# Copier et construire la bibliothèque simple-mind-map d'abord
COPY simple-mind-map /app/simple-mind-map
WORKDIR /app/simple-mind-map
RUN npm install && npm run build

# Copier le code backend
COPY server /app/backend
WORKDIR /app/backend
RUN npm install --production

# Copier le frontend et installer avec lien vers simple-mind-map
COPY web /app/frontend-src
WORKDIR /app/frontend-src
RUN npm install ../simple-mind-map && npm install && npm run build

# Déplacer les fichiers compilés
RUN mkdir -p /app/frontend && \
    cp -r /app/frontend-src/dist/* /app/frontend/ && \
    rm -rf /app/frontend-src /app/simple-mind-map

# Copier la configuration nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Copier la configuration supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copier le script d'entrée
COPY docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Créer le fichier .env pour le backend
COPY docker/.env.docker /app/backend/.env

# Exposer les ports
EXPOSE 80

# Volume pour la persistance MySQL
VOLUME ["/var/lib/mysql"]

# Définir le répertoire de travail
WORKDIR /app/backend

# Point d'entrée
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]