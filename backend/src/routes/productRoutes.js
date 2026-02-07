const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');

// 🔒 ROTAS PROTEGIDAS
router.post('/', authMiddleware, productController.create);
router.put('/:id', authMiddleware, productController.update);
router.delete('/:id', authMiddleware, productController.delete);
// 🔥 ROTAS DROPI
router.post('/import-dropi', authMiddleware, productController.importFromDropi);
router.get('/test-dropi', productController.testDropiConnection);
router.get('/dropi-products', productController.listDropiProducts);
// 🔥 ROTA DROPI
router.post('/import-dropi', authMiddleware, productController.importFromDropi);

// 🔓 ROTA PÚBLICA
router.get('/', productController.list);

module.exports = router;
