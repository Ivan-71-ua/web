const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, user_id, name, current_amount, target_amount, color, is_hidden, completed_at, created_at FROM goals WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, currentAmount, targetAmount, color, isHidden } = req.body;

    if (!name || targetAmount === undefined || !color) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const current = currentAmount !== undefined ? currentAmount : 0;
    const hidden = Boolean(isHidden);

    const [result] = await db.query(
      'INSERT INTO goals (user_id, name, current_amount, target_amount, color, is_hidden) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, name, current, targetAmount, color, hidden]
    );

    const [rows] = await db.query(
      'SELECT id, user_id, name, current_amount, target_amount, color, is_hidden, completed_at, created_at FROM goals WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating goal' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, currentAmount, targetAmount, color, isHidden } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM goals WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || rows[0].user_id !== req.userId) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }

    if (currentAmount !== undefined) {
      fields.push('current_amount = ?');
      values.push(currentAmount);
    }

    if (targetAmount !== undefined) {
      fields.push('target_amount = ?');
      values.push(targetAmount);
    }

    if (color !== undefined) {
      fields.push('color = ?');
      values.push(color);
    }

    if (isHidden !== undefined) {
      fields.push('is_hidden = ?');
      values.push(Boolean(isHidden));
    }

    if (currentAmount !== undefined || targetAmount !== undefined) {
      const newCurrent = currentAmount !== undefined ? currentAmount : rows[0].current_amount;
      const newTarget = targetAmount !== undefined ? targetAmount : rows[0].target_amount;
      if (newTarget > 0 && newCurrent >= newTarget && !rows[0].completed_at) {
        fields.push('completed_at = NOW()');
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    values.push(id);

    const sql = `UPDATE goals SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);

    const [updated] = await db.query(
      'SELECT id, user_id, name, current_amount, target_amount, color, is_hidden, completed_at, created_at FROM goals WHERE id = ?',
      [id]
    );

    res.json(updated[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error updating goal' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      'SELECT id, user_id FROM goals WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || rows[0].user_id !== req.userId) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await db.query('DELETE FROM goals WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error deleting goal' });
  }
});

module.exports = router;
