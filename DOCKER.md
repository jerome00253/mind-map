# 🐳 Déploiement Docker

Ce document explique comment déployer l'application Mind Map avec Docker.

## Architecture du Conteneur

Le conteneur Docker unique contient :
- **Nginx** : Serveur web pour le frontend et reverse proxy pour l'API
- **MySQL** : Base de données
- **Node.js Backend** : API Express
- **Frontend** : Application Vue.js compilée

## Prérequis

- Docker installé (version 20.10+)
- 2 GB de RAM minimum
- 5 GB d'espace disque

## Démarrage Rapide avec Docker Compose

**La méthode la plus simple** :

```bash
# Cloner le projet
git clone https://github.com/jerome00253/mind-map.git
cd mind-map

# Lancer l'application
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

L'application sera accessible sur `http://localhost`.

**Données persistées** : Les données MySQL sont automatiquement sauvegardées dans le répertoire `./data` à côté du fichier `docker-compose.yml`.

**Arrêter l'application** :
```bash
docker-compose down
```

**Redémarrer** :
```bash
docker-compose restart
```

---

## Déploiement Docker Manuel

### Construction de l'Image

```bash
docker build -t mindmap:latest .
```

## Démarrage du Conteneur

### Démarrage simple

```bash
docker run -d \
  -p 80:80 \
  -v mindmap-data:/var/lib/mysql \
  --name mindmap \
  mindmap:latest
```

### Avec variables d'environnement personnalisées

```bash
docker run -d \
  -p 80:80 \
  -v mindmap-data:/var/lib/mysql \
  -e JWT_SECRET=votre_secret_jwt_securise \
  --name mindmap \
  mindmap:latest
```

## Accès à l'Application

Une fois le conteneur démarré, accédez à l'application :
- **URL** : `http://localhost`
- **Email admin** : `admin@test.fr`
- **Mot de passe** : `pass123`

## Gestion du Conteneur

### Voir les logs

```bash
# Tous les logs
docker logs mindmap

# Logs en temps réel
docker logs -f mindmap
```

### Arrêter le conteneur

```bash
docker stop mindmap
```

### Redémarrer le conteneur

```bash
docker restart mindmap
```

### Supprimer le conteneur

```bash
docker stop mindmap
docker rm mindmap
```

## Persistance des Données

Les données MySQL sont stockées dans un volume Docker nommé `mindmap-data`.

### Sauvegarder les données

```bash
# Créer une sauvegarde
docker exec mindmap mysqldump -u mindmap -pmindmap_password mindmap > backup.sql

# Ou sauvegarder le volume
docker run --rm \
  -v mindmap-data:/data \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/mindmap-backup.tar.gz /data
```

### Restaurer les données

```bash
# Restaurer depuis un dump SQL
docker exec -i mindmap mysql -u mindmap -pmindmap_password mindmap < backup.sql

# Ou restaurer le volume
docker run --rm \
  -v mindmap-data:/data \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/mindmap-backup.tar.gz -C /
```

## Variables d'Environnement

Vous pouvez personnaliser le comportement du conteneur avec ces variables :

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_USER` | Utilisateur MySQL | `mindmap` |
| `DB_PASSWORD` | Mot de passe MySQL | `mindmap_password` |
| `DB_NAME` | Nom de la base | `mindmap` |
| `JWT_SECRET` | Secret JWT | *Généré automatiquement* |

**Note** : Le `JWT_SECRET` est généré automatiquement au premier démarrage du conteneur s'il n'est pas fourni. Il est ensuite sauvegardé dans le fichier `.env` du backend pour être réutilisé lors des redémarrages.

## Dépannage

### Le conteneur ne démarre pas

```bash
# Vérifier les logs
docker logs mindmap

# Vérifier que le port 80 n'est pas déjà utilisé
netstat -tuln | grep :80
```

### Réinitialiser complètement

```bash
# Supprimer le conteneur et le volume
docker stop mindmap
docker rm mindmap
docker volume rm mindmap-data

# Reconstruire et redémarrer
docker build -t mindmap:latest .
docker run -d -p 80:80 -v mindmap-data:/var/lib/mysql --name mindmap mindmap:latest
```

## Production

Pour un déploiement en production :

1. **Le JWT_SECRET est généré automatiquement** au premier démarrage (sécurisé par défaut)

2. **Utilisez HTTPS** : Placez un reverse proxy (Traefik, Nginx) devant le conteneur

3. **Sauvegardez régulièrement** : Configurez des sauvegardes automatiques du volume

4. **Changez le mot de passe admin** après la première connexion

5. **Optionnel - Fournir votre propre JWT_SECRET** :
   ```bash
   docker run -d \
     -p 80:80 \
     -v mindmap-data:/var/lib/mysql \
     -e JWT_SECRET=$(openssl rand -base64 32) \
     --name mindmap \
     mindmap:latest
   ```
