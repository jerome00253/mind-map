const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// GET /api/mindmaps - Liste des cartes (Propres + Partagées)
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const [mindmaps] = await pool.execute(
      `SELECT m.uuid, m.title, m.is_public, m.share_token, m.created_at, m.updated_at, 
              'owner' as role, u.username as owner_username
       FROM mindmaps m
       JOIN users u ON m.user_id = u.id
       WHERE m.user_id = ?
       
       UNION
       
       SELECT m.uuid, m.title, m.is_public, m.share_token, m.created_at, m.updated_at, 
              sp.permission as role, u.username as owner_username
       FROM mindmaps m
       JOIN share_permissions sp ON m.id = sp.mindmap_id
       JOIN users u ON m.user_id = u.id
       WHERE sp.user_id = ?
       
       ORDER BY updated_at DESC`,
      [userId, userId]
    );

    res.json({
      success: true,
      data: { mindmaps }
    });
  } catch (error) {
    console.error('Erreur liste mindmaps:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cartes'
    });
  }
});

// GET /api/mindmaps/:uuid - Détails d'une carte (Check permissions)
router.get('/:uuid', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const uuid = req.params.uuid;

    const [mindmaps] = await pool.execute(
      `SELECT m.*, 
              CASE 
                WHEN m.user_id = ? THEN 'owner'
                ELSE sp.permission 
              END as current_user_role
       FROM mindmaps m
       LEFT JOIN share_permissions sp ON m.id = sp.mindmap_id AND sp.user_id = ?
       WHERE m.uuid = ?`,
      [userId, userId, uuid]
    );

    if (mindmaps.length === 0) {
      return res.status(404).json({ success: false, message: 'Carte non trouvée' });
    }

    const mindmap = mindmaps[0];

    // Vérification des droits d'accès
    if (mindmap.user_id !== userId && !mindmap.current_user_role && !mindmap.is_public) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    res.json({
      success: true,
      data: { mindmap }
    });
  } catch (error) {
    console.error('Erreur récupération mindmap:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/mindmaps - Créer une carte
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, data } = req.body;
    const uuid = uuidv4();

    if (!data) {
      return res.status(400).json({ success: false, message: 'Données requises' });
    }

    const [result] = await pool.execute(
      `INSERT INTO mindmaps (uuid, user_id, title, data) VALUES (?, ?, ?, ?)`,
      [uuid, req.user.id, title || 'Carte sans titre', JSON.stringify(data)]
    );

    res.status(201).json({
      success: true,
      message: 'Carte créée',
      data: {
        mindmap: {
          id: result.insertId,
          uuid,
          title: title || 'Carte sans titre'
        }
      }
    });
  } catch (error) {
    console.error('Erreur création:', error);
    res.status(500).json({ success: false, message: 'Erreur création' });
  }
});

// PUT /api/mindmaps/:uuid - Mise à jour (Check permissions 'edit' or 'owner')
router.put('/:uuid', authenticate, async (req, res) => {
  try {
    const { title, data } = req.body;
    const userId = req.user.id;
    const uuid = req.params.uuid;

    // Vérifier droits
    const [access] = await pool.execute(
      `SELECT m.id, m.user_id, sp.permission 
       FROM mindmaps m
       LEFT JOIN share_permissions sp ON m.id = sp.mindmap_id AND sp.user_id = ?
       WHERE m.uuid = ?`,
      [userId, uuid]
    );

    if (access.length === 0) return res.status(404).json({ success: false, message: 'Carte introuvable' });
    
    const map = access[0];
    const canEdit = map.user_id === userId || map.permission === 'edit';

    if (!canEdit) {
      return res.status(403).json({ success: false, message: 'Lecture seule' });
    }

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (data !== undefined) {
      updates.push('data = ?');
      values.push(JSON.stringify(data));
    }

    if (updates.length > 0) {
      values.push(uuid);
      await pool.execute(
        `UPDATE mindmaps SET ${updates.join(', ')} WHERE uuid = ?`,
        values
      );
    }

    res.json({ success: true, message: 'Mise à jour réussie' });
  } catch (error) {
    console.error('Erreur update:', error);
    res.status(500).json({ success: false, message: 'Erreur mise à jour' });
  }
});

// DELETE /api/mindmaps/:uuid - Supprimer (Owner only)
router.delete('/:uuid', authenticate, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM mindmaps WHERE uuid = ? AND user_id = ?',
      [req.params.uuid, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ success: false, message: 'Impossible de supprimer (Non propriétaire ou introuvable)' });
    }

    res.json({ success: true, message: 'Supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression' });
  }
});

// --- GESTION DES PERMISSIONS ---

// GET /api/mindmaps/:uuid/permissions - Liste des collaborateurs
router.get('/:uuid/permissions', authenticate, async (req, res) => {
  try {
    // Vérifier ownership
    const [map] = await pool.execute(
      'SELECT id, user_id FROM mindmaps WHERE uuid = ?', 
      [req.params.uuid]
    );
    
    if (map.length === 0) return res.status(404).json({message: 'Carte introuvable'});
    if (map[0].user_id !== req.user.id) return res.status(403).json({message: 'Non autorisé'});

    const [permissions] = await pool.execute(
      `SELECT u.id, u.username, u.email, sp.permission, sp.created_at
       FROM share_permissions sp
       JOIN users u ON sp.user_id = u.id
       WHERE sp.mindmap_id = ?`,
      [map[0].id]
    );

    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/mindmaps/:uuid/permissions - Ajouter un collaborateur
router.post('/:uuid/permissions', authenticate, async (req, res) => {
  try {
    const { username, permission } = req.body; // permission: 'view' | 'edit'
    
    // 1. Check Owner
    const [map] = await pool.execute(
      'SELECT id, user_id FROM mindmaps WHERE uuid = ?', 
      [req.params.uuid]
    );
    if (map.length === 0) return res.status(404).json({message: 'Carte introuvable'});
    if (map[0].user_id !== req.user.id) return res.status(403).json({message: 'Seul le propriétaire peut partager'});

    // 2. Find User
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE username = ?', 
      [username]
    );
    if (users.length === 0) return res.status(404).json({message: 'Utilisateur introuvable'});
    
    const targetUserId = users[0].id;
    if (targetUserId === req.user.id) return res.status(400).json({message: 'Vous êtes déjà le propriétaire'});

    // 3. Insert/Update Permission
    await pool.execute(
      `INSERT INTO share_permissions (mindmap_id, user_id, permission) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE permission = ?`,
      [map[0].id, targetUserId, permission || 'view', permission || 'view']
    );

    res.json({ success: true, message: 'Utilisateur ajouté' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors du partage' });
  }
});

// DELETE /api/mindmaps/:uuid/permissions/:userId - Révoquer l'accès
router.delete('/:uuid/permissions/:userId', authenticate, async (req, res) => {
  try {
    // 1. Check Owner
    const [map] = await pool.execute(
      'SELECT id, user_id FROM mindmaps WHERE uuid = ?', 
      [req.params.uuid]
    );
    if (map.length === 0) return res.status(404).json({message: 'Carte introuvable'});
    if (map[0].user_id !== req.user.id) return res.status(403).json({message: 'Non autorisé'});

    await pool.execute(
      'DELETE FROM share_permissions WHERE mindmap_id = ? AND user_id = ?',
      [map[0].id, req.params.userId]
    );

    res.json({ success: true, message: 'Accès révoqué' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// --- PARTAGE PUBLIC ---

// POST /api/mindmaps/:uuid/share - Activer le partage public
router.post('/:uuid/share', authenticate, async (req, res) => {
  try {
    const { isPublic } = req.body;
    const token = uuidv4(); // Generate new token if needed

    // Check owner
    const [map] = await pool.execute(
      'SELECT id, user_id FROM mindmaps WHERE uuid = ?', 
      [req.params.uuid]
    );
    if (map.length === 0) return res.status(404).json({message: 'Carte introuvable'});
    if (map[0].user_id !== req.user.id) return res.status(403).json({message: 'Non autorisé'});

    await pool.execute(
      `UPDATE mindmaps 
       SET is_public = ?, share_token = COALESCE(share_token, ?) 
       WHERE id = ?`,
      [isPublic, token, map[0].id]
    );

    // Fetch updated to return the token
    const [updated] = await pool.execute(
      'SELECT share_token FROM mindmaps WHERE id = ?',
      [map[0].id]
    );

    res.json({
      success: true,
      data: {
        shareToken: updated[0].share_token,
        shareUrl: `${process.env.VUE_APP_URL || 'http://localhost:8080'}/share/${updated[0].share_token}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /api/mindmaps/:uuid/share - Désactiver le partage public
router.delete('/:uuid/share', authenticate, async (req, res) => {
  try {
    // Check owner
    const [map] = await pool.execute(
      'SELECT id, user_id FROM mindmaps WHERE uuid = ?', 
      [req.params.uuid]
    );
    if (map.length === 0) return res.status(404).json({message: 'Carte introuvable'});
    if (map[0].user_id !== req.user.id) return res.status(403).json({message: 'Non autorisé'});

    await pool.execute(
      'UPDATE mindmaps SET is_public = FALSE WHERE id = ?',
      [map[0].id]
    );

    res.json({ success: true, message: 'Partage désactivé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
