const express = require('express');
const app = express();

// middlewares globais
app.use(express.json());

// rotas
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// rota teste
app.get('/', (req, res) => {
  res.json({ message: 'API rodando 🚀' });
});

module.exports = app;
