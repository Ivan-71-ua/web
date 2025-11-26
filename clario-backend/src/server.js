require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const goalsRoutes = require('./routes/goals.routes');
const reportRoutes = require('./routes/report.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/goals', goalsRoutes);
app.use('/report', reportRoutes);



app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
