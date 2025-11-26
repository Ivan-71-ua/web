const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/expenses', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const [rows] = await db.query(
      'SELECT SUM(amount) AS totalExpenses FROM transactions WHERE user_id = ? AND type = "expense" AND date BETWEEN ? AND ?',
      [req.userId, startDate, endDate]
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching expenses report' });
  }
});

router.get('/income', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const [rows] = await db.query(
      'SELECT SUM(amount) AS totalIncome FROM transactions WHERE user_id = ? AND type = "income" AND date BETWEEN ? AND ?',
      [req.userId, startDate, endDate]
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching income report' });
  }
});

module.exports = router;
