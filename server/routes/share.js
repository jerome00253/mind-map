const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');

// POST /api/mindmaps/:uuid/share - Générer un lien de partage
router.post('/:uuid/share', authenticate, async (req, res) => {
  try {
    const { isPublic = true } = req.body;

    // Vérifier que la carte appartient à l'utilisateur
    const [mindmaps] = await pool.execute(
      'SELECT id FROM mindmaps WHERE uuid = ? AND user_id = ?',
      [req.params.uuid, req.user.id]
    );

    if (mindmaps.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carte non trouvée'
      });
    }

    // Générer un token de partage unique
    const shareToken = crypto.randomBytes(32).toString('hex');

    // Mettre à jour la carte
    await pool.execute(
      'UPDATE mindmaps SET is_public = ?, share_token = ? WHERE uuid = ?',
      [isPublic, shareToken, req.params.uuid]
    );

    res.json({
      success: true,
      message: 'Lien de partage généré',
      data: {
        shareToken,
        shareUrl: `/share/${shareToken}`
      }
    });
  } catch (error) {
    console.error('Erreur partage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du lien de partage'
    });
  }
});

// DELETE /api/mindmaps/:uuid/share - Révoquer le partage
router.delete('/:uuid/share', authenticate, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE mindmaps SET is_public = FALSE, share_token = NULL WHERE uuid = ? AND user_id = ?',
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
      message: 'Partage révoqué'
    });
  } catch (error) {
    console.error('Erreur révocation partage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la révocation du partage'
    });
  }
});

// GET /api/share/:token - Accéder à une carte partagée
router.get('/:token', optionalAuth, async (req, res) => {
  try {
    const [mindmaps] = await pool.execute(
      `SELECT m.uuid, m.title, m.data, m.created_at, m.updated_at, u.username as author
       FROM mindmaps m
       JOIN users u ON m.user_id = u.id
       WHERE m.share_token = ? AND m.is_public = TRUE`,
      [req.params.token]
    );

    if (mindmaps.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carte non trouvée ou non partagée'
      });
    }

    res.json({
      success: true,
      data: {
        mindmap: mindmaps[0],
        isOwner: req.user ? mindmaps[0].user_id === req.user.id : false
      }
    });
  } catch (error) {
    console.error('Erreur accès carte partagée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'accès à la carte partagée'
    });
  }
});

module.exports = router;
