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

### 🔮 Objectifs futurs

Ce fork a pour objectif de développer des fonctionnalités supplémentaires :

- [ ] **Authentification utilisateur** - Système de login/password avec MySQL
- [ ] **Sauvegarde en base de données** - Stockage des cartes mentales dans MySQL
- [ ] **Partage de cartes** - URLs de partage avec permissions (public/privé)
- [ ] **Collaboration** - Édition collaborative en temps réel

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

### Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/jerome00253/mind-map.git
cd mind-map

# Installer les dépendances de la bibliothèque
cd simple-mind-map
npm install

# Installer les dépendances de l'application web
cd ../web
npm install

# Installer le lien vers la bibliothèque locale
npm install ../simple-mind-map

# Lancer le serveur de développement
npm run serve
```

L'application sera accessible à `http://localhost:8081`

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