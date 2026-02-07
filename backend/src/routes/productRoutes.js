const express = require('express');
const router = express.Router();

// 👉 IMPORTA MIDDLEWARES (vem da pasta middlewares)
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// 👉 IMPORTA CONTROLLER
const productController = require('../controllers/productController');

// 🔓 rota pública
router.get('/', productController.list);

// 🔒 rota protegida (somente admin)
router.post('/', authMiddleware, adminMiddleware, productController.create);

module.exports = router;
