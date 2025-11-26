const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, user_id, goal_id, title, description, type, created_at FROM achievements WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { goalId, title, description, type } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const [result] = await db.query(
      'INSERT INTO achievements (user_id, goal_id, title, description, type) VALUES (?, ?, ?, ?, ?)',
      [req.userId, goalId || null, title, description || null, type || null]
    );

    const [rows] = await db.query(
      'SELECT id, user_id, goal_id, title, description, type, created_at FROM achievements WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating achievement' });
  }
});

module.exports = router;
