const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Middleware pour toutes les routes : Authentification requise
router.use(authenticate);

// GET /api/users/search - Rechercher des utilisateurs (Accessible à tous les connectés)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    let query = 'SELECT id, username, email FROM users';
    let params = [];
    
    // Only filter if q is provided and at least 1 char
    if (q && q.length > 0) {
      query += ' WHERE username LIKE ? OR email LIKE ?';
      params = [`%${q}%`, `%${q}%`];
    }
    
    query += ' LIMIT 20';

    const [users] = await pool.execute(query, params);

    // Filter out current user
    const filtered = users.filter(u => u.id !== req.user.id);

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error('Erreur recherche users:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/users - Liste tous les utilisateurs (Admin seulement)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at, updated_at FROM users'
    );
    res.json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/users - Créer un utilisateur
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Champs manquants' });
    }

    // Vérifier si existant
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Utilisateur déjà existant' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userRole = role === 'admin' ? 'admin' : 'user';

    await pool.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, userRole]
    );

    res.status(201).json({ success: true, message: 'Utilisateur créé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/users/:id - Modifier un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const userId = req.params.id;

    // Constuire la requête dynamique
    let updates = [];
    let values = [];

    if (username) { updates.push('username = ?'); values.push(username); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (role) { updates.push('role = ?'); values.push(role); }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      updates.push('password_hash = ?'); 
      values.push(passwordHash);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucune modification' });
    }

    values.push(userId);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true, message: 'Utilisateur mis à jour' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
