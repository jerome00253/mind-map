FROM ubuntu:22.04

# Éviter les prompts interactifs
ENV DEBIAN_FRONTEND=noninteractive

# Installer les dépendances système et Node.js 16
RUN apt-get update && apt-get install -y \
    nginx \
    mysql-server \
    curl \
    supervisor \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_16.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Créer les répertoires nécessaires
RUN mkdir -p /app/backend /app/frontend /var/log/supervisor

# Configurer MySQL
RUN mkdir -p /var/run/mysqld && \
    chown -R mysql:mysql /var/run/mysqld && \
    chown -R mysql:mysql /var/lib/mysql && \
    usermod -d /var/lib/mysql mysql

# Copier la bibliothèque simple-mind-map (pas de build nécessaire)
COPY simple-mind-map /app/simple-mind-map
WORKDIR /app/simple-mind-map
RUN npm install

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
    cp -r /app/dist/* /app/frontend/ && \
    rm -rf /app/frontend-src /app/simple-mind-map /app/dist

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