const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const orderController = require('../controllers/orderController');

// 🔒 admin vê todos os pedidos
router.get('/', authMiddleware, adminMiddleware, orderController.listAll);

// 🔓 cliente cria pedido
router.post('/', orderController.create);

// 🔒 admin atualiza status
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateStatus);

module.exports = router;
