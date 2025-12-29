<h1 align="center">🧠 Simple Mind Map - Version Française</h1>

<p align="center">
  <strong>Fork français de la bibliothèque de cartes mentales web Simple Mind Map</strong>
</p>

<p align="center">
  <a href="https://github.com/wanglin2/mind-map">📌 Projet Original</a> •
  <a href="#fonctionnalités">✨ Fonctionnalités</a> •
  <a href="#installation">🚀 Installation</a> •
  <a href="#objectifs-du-fork">🎯 Objectifs</a>
</p>

---

## 📖 À propos

Ce projet est un **fork** de [Simple Mind Map](https://github.com/wanglin2/mind-map) créé par **[@wanglin2](https://github.com/wanglin2)**.

Simple Mind Map est une bibliothèque JavaScript puissante et flexible pour créer des cartes mentales (mind maps) dans le navigateur. Elle ne dépend d'aucun framework et peut être utilisée pour développer rapidement des applications de cartographie mentale.

### 🙏 Crédits

- **Auteur original** : [wanglin2](https://github.com/wanglin2)
- **Projet original** : [https://github.com/wanglin2/mind-map](https://github.com/wanglin2/mind-map)
- **Documentation** : [https://wanglin2.github.io/mind-map-docs/](https://wanglin2.github.io/mind-map-docs/)
- **Démo en ligne** : [https://wanglin2.github.io/mind-map/](https://wanglin2.github.io/mind-map/)
- **Licence** : MIT

---

## 🇫🇷 Ce que propose ce fork

### ✅ Version française complète

Ce fork propose une **traduction intégrale de l'interface en français** :

- Interface utilisateur entièrement traduite
- Menus, dialogues et messages en français
- Textes par défaut des nœuds en français
- Français défini comme langue par défaut
- Sélecteur de langue simplifié (Français / English)

### 🎯 Fonctionnalités supplémentaires implémentées

Ce fork enrichit le projet original avec un système complet de gestion multi-utilisateurs :

#### ✅ Authentification et gestion des utilisateurs

- **Système de connexion sécurisé** - Authentification JWT avec MySQL
- **Gestion des rôles** - Système admin/utilisateur avec interface dédiée
- **Inscription contrôlée** - Seuls les administrateurs peuvent créer des comptes
- **Compte admin par défaut** : `admin@test.fr` / `pass123`

#### ✅ Sauvegarde et persistance

- **Base de données MySQL** - Stockage persistant de toutes les cartes mentales
- **Sauvegarde automatique** - Synchronisation instantanée (debounce 1s)
- **Tableau de bord "Mes Cartes"** - Interface de gestion centralisée
- **Mode hybride** - Compatible avec le mode local (localStorage)

#### ✅ Partage et collaboration

- **Partage interne sécurisé** - Recherche d'utilisateurs par nom ou email
- **Gestion des permissions** - Niveaux lecture/modification/propriétaire
- **Interface intuitive** - Liste déroulante avec suggestions utilisateurs
- **Badges de statut** - Identification visuelle des cartes partagées

#### ✅ Sécurité et navigation

- **Routes protégées** - Redirection automatique vers login si non connecté
- **Navigation optimisée** - Flux `/my-maps` → `/edit?uuid=...`
- **Gestion d'erreurs robuste** - Redirection intelligente sur 404
- **Mode lecture seule** - Désactivation automatique de la sauvegarde pour les droits en lecture

#### 🔮 Développements futurs

- [ ] **Collaboration temps réel** - Édition collaborative via WebSocket
- [ ] **Dossiers** - Organisation hiérarchique des cartes
- [ ] **Historique de versions** - Suivi des modifications

### 🏗️ Architecture technique ajoutée

**Backend (Node.js/Express)**

- API RESTful sur port 3000
- MySQL avec gestion de schéma automatique
- Middleware JWT pour l'authentification
- Routes sécurisées avec contrôle d'accès

**Frontend (améliorations)**

- Vuex pour la gestion d'état auth
- Router guards pour la sécurité
- Intégration Element UI (locale FR)
- API client centralisé

---

## ✨ Fonctionnalités

Toutes les fonctionnalités du projet original sont conservées :

| Fonctionnalité | Description |
|----------------|-------------|
| 🏗️ **Architecture modulaire** | Plugins pour étendre les fonctionnalités |
| 📐 **Multiples structures** | Logique, organigramme, chronologie, arête de poisson... |
| 🎨 **Thèmes personnalisables** | Nombreux thèmes intégrés + personnalisation |
| 📝 **Texte enrichi** | Support du texte riche dans les nœuds |
| 🖼️ **Médias** | Images, icônes, hyperliens, notes, tags |
| 📤 **Export** | JSON, PNG, SVG, PDF, Markdown, XMind |
| 📥 **Import** | JSON, XMind, Markdown |
| ⌨️ **Raccourcis clavier** | Navigation et édition rapides |
| 🔍 **Recherche** | Rechercher et remplacer dans les nœuds |
| 🤝 **Collaboration** | Support de l'édition collaborative |
| 🎭 **Mode présentation** | Pour les présentations |

---

## 🚀 Installation

### Prérequis

- Node.js (v16 ou supérieur recommandé)
- npm
- MySQL (v8 ou supérieur)

### Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/jerome00253/mind-map.git
cd mind-map

# 1. Configurer la base de données
# Créer une base MySQL et noter les identifiants

# 2. Installer le backend
cd server
npm install

# Créer le fichier .env avec vos identifiants MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=votre_mot_de_passe
# DB_NAME=mindmap
# JWT_SECRET=votre_secret_jwt

# Démarrer le serveur backend (port 3000)
npm run dev

# 3. Dans un autre terminal, installer le frontend
cd ../web
npm install

# Lancer le serveur de développement (port 8080/8081/8082)
npm run serve
```

L'application sera accessible à `http://localhost:8081`

**Connexion administrateur par défaut** :
- Email : `admin@test.fr`
- Mot de passe : `pass123`

### Compilation pour la production

```bash
cd web
npm run build
```

---

## 🛠️ Stack technique

### Bibliothèque (simple-mind-map)
- JavaScript pur (framework-agnostic)
- SVG.js pour le rendu graphique
- Quill pour l'édition de texte riche

### Application Web
- Vue.js 2
- Element UI
- Vue Router
- Vuex
- Vue-i18n (internationalisation)

---

## 📝 Licence

Ce projet est sous licence [MIT](./LICENSE).

Conformément à la licence du projet original, veuillez conserver les mentions de copyright de `simple-mind-map` et indiquer la source dans vos projets.

---

## 🔗 Liens utiles

- [Projet original](https://github.com/wanglin2/mind-map)
- [Documentation officielle](https://wanglin2.github.io/mind-map-docs/)
- [Démo en ligne](https://wanglin2.github.io/mind-map/)

---

<p align="center">
  <sub>Fork maintenu par <a href="https://github.com/jerome00253">@jerome00253</a></sub>
</p>