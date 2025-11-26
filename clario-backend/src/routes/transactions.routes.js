const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

const validExpenseCategories = ['Їжа', 'Житло', 'Транспорт', 'Подарунки', 'Розваги'];

function normalizeDate(input) {
  if (!input) return null;
  const trimmed = String(input).trim();

  const dotMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotMatch) {
    const day = dotMatch[1].padStart(2, '0');
    const month = dotMatch[2].padStart(2, '0');
    const year = dotMatch[3];
    return `${year}-${month}-${day}`;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return trimmed;
  }

  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null;
}

const updateGoalProgress = async (userId, goalId, amount) => {
  const [goal] = await db.query(
    'SELECT current_amount, target_amount FROM goals WHERE user_id = ? AND id = ?',
    [userId, goalId]
  );

  if (goal.length === 0) {
    return;
  }

  const newAmount = goal[0].current_amount + amount;

  await db.query(
    'UPDATE goals SET current_amount = ? WHERE user_id = ? AND id = ?',
    [newAmount, userId, goalId]
  );

  if (newAmount >= goal[0].target_amount) {
    await db.query(
      'INSERT INTO achievements (user_id, goal_id, achievement) VALUES (?, ?, ?)',
      [userId, goalId, 'Ціль виконана']
    );
  }
};

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, user_id, type, amount, category, description, DATE_FORMAT(date, "%Y-%m-%d") AS date, created_at FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC',
      [req.userId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description, date, goalId } = req.body;

    if (!type || !amount || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (type === 'expense') {
      if (!category || !validExpenseCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid expense category' });
      }
    } else if (type === 'income') {
      if (category) {
        return res.status(400).json({ message: 'Income should not have a category' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const [result] = await db.query(
      'INSERT INTO transactions (user_id, type, amount, category, description, date, goal_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, type, amount, category || null, description || null, normalizedDate, goalId || null]
    );

    if (goalId) {
      await updateGoalProgress(req.userId, goalId, amount);
    }

    const [rows] = await db.query(
      'SELECT id, user_id, type, amount, category, description, DATE_FORMAT(date, "%Y-%m-%d") AS date, created_at FROM transactions WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { type, amount, category, description, date } = req.body;

    const [rows] = await db.query(
      'SELECT id, user_id FROM transactions WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || rows[0].user_id !== req.userId) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const fields = [];
    const values = [];

    if (type) {
      if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ message: 'Invalid transaction type' });
      }
      fields.push('type = ?');
      values.push(type);
    }

    if (amount !== undefined) {
      fields.push('amount = ?');
      values.push(amount);
    }

    if (category !== undefined) {
      if (type === 'expense' && !validExpenseCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid expense category' });
      }
      if (type === 'income' && category) {
        return res.status(400).json({ message: 'Income should not have a category' });
      }
      fields.push('category = ?');
      values.push(category || null);
    }

    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description || null);
    }

    if (date !== undefined) {
      const normalizedDate = normalizeDate(date);
      if (!normalizedDate) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      fields.push('date = ?');
      values.push(normalizedDate);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    values.push(id);

    const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);

    const [updated] = await db.query(
      'SELECT id, user_id, type, amount, category, description, DATE_FORMAT(date, "%Y-%m-%d") AS date, created_at FROM transactions WHERE id = ?',
      [id]
    );

    res.json(updated[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error updating transaction' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      'SELECT id, user_id FROM transactions WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || rows[0].user_id !== req.userId) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await db.query('DELETE FROM transactions WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
});

module.exports = router;
