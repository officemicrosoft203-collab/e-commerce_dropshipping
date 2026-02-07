const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const productController = require('../controllers/productController');

// 🔓 ROTA PÚBLICA
router.get('/', productController.list);

// 🔒 ROTAS ADMIN
router.post('/', authMiddleware, adminMiddleware, productController.create);
router.put('/:id', authMiddleware, adminMiddleware, productController.update);
router.delete('/:id', authMiddleware, adminMiddleware, productController.delete);

// 🔥 DROPI (somente admin)
router.post(
  '/import-dropi',
  authMiddleware,
  adminMiddleware,
  productController.importFromDropi
);

router.get('/test-dropi', authMiddleware, adminMiddleware, productController.testDropiConnection);
router.get('/dropi-products', authMiddleware, adminMiddleware, productController.listDropiProducts);

module.exports = router;
