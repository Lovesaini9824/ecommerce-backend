const express = require('express');
const { protect } = require('../middleware/auth');
const { getCart, addToCart, removeItemFromCart, reduceQuantity, increaseQuantity } = require('../controllers/cartController');
const router = express.Router();

router.use(protect);

router.get('/get-cart', getCart);
router.post('/add-to-cart', addToCart);
router.post('/remove-item', removeItemFromCart);
router.post('/reduce-item', reduceQuantity);
router.post('/increase-item', increaseQuantity);

module.exports = router;
