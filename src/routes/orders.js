// backend/src/routes/orders.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { placeOrder, getMyOrders, buyNow} = require('../controllers/orderController');
const router = express.Router();
const auth= require('../middleware/auth')

router.use(protect);
router.post('/create-order', placeOrder);
router.get('/get-order', getMyOrders);
router.post('/buy-now', buyNow);        
module.exports = router;