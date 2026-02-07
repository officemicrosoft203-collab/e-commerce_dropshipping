const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const orderController = require('../controllers/orderController');

// 🔒 somente admin vê pedidos
router.get('/', authMiddleware, adminMiddleware, orderController.getOrders);

module.exports = router;
