const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// GET /api/mindmaps - Liste des cartes de l'utilisateur
router.get('/', authenticate, async (req, res) => {
  try {
    const [mindmaps] = await pool.execute(
      `SELECT uuid, title, is_public, share_token, created_at, updated_at 
       FROM mindmaps 
       WHERE user_id = ? 
       ORDER BY updated_at DESC`,
      [req.user.id]
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

// GET /api/mindmaps/:uuid - Détails d'une carte
router.get('/:uuid', authenticate, async (req, res) => {
  try {
    const [mindmaps] = await pool.execute(
      `SELECT * FROM mindmaps WHERE uuid = ? AND user_id = ?`,
      [req.params.uuid, req.user.id]
    );

    if (mindmaps.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carte non trouvée'
      });
    }

    res.json({
      success: true,
      data: { mindmap: mindmaps[0] }
    });
  } catch (error) {
    console.error('Erreur récupération mindmap:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la carte'
    });
  }
});

// POST /api/mindmaps - Créer une carte
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, data } = req.body;
    const uuid = uuidv4();

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Les données de la carte sont requises'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO mindmaps (uuid, user_id, title, data) VALUES (?, ?, ?, ?)`,
      [uuid, req.user.id, title || 'Carte sans titre', JSON.stringify(data)]
    );

    res.status(201).json({
      success: true,
      message: 'Carte créée avec succès',
      data: {
        mindmap: {
          id: result.insertId,
          uuid,
          title: title || 'Carte sans titre'
        }
      }
    });
  } catch (error) {
    console.error('Erreur création mindmap:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la carte'
    });
  }
});

// PUT /api/mindmaps/:uuid - Mettre à jour une carte
router.put('/:uuid', authenticate, async (req, res) => {
  try {
    const { title, data } = req.body;

    // Vérifier que la carte appartient à l'utilisateur
    const [existing] = await pool.execute(
      'SELECT id FROM mindmaps WHERE uuid = ? AND user_id = ?',
      [req.params.uuid, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carte non trouvée'
      });
    }

    // Construire la requête de mise à jour
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

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }

    values.push(req.params.uuid, req.user.id);

    await pool.execute(
      `UPDATE mindmaps SET ${updates.join(', ')} WHERE uuid = ? AND user_id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Carte mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour mindmap:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la carte'
    });
  }
});

// DELETE /api/mindmaps/:uuid - Supprimer une carte
router.delete('/:uuid', authenticate, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM mindmaps WHERE uuid = ? AND user_id = ?',
      [req.params.uuid, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carte non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Carte supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression mindmap:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la carte'
    });
  }
});

module.exports = router;
