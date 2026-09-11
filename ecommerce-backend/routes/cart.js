const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:productId', cartController.updateCartQuantity);
router.delete('/:productId', cartController.removeFromCart);

module.exports = router;
