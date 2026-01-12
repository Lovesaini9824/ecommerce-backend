// backend/src/routes/orders.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { placeOrder, getMyOrders, buyNow, updateOrderStatus, getAllOrders, cancelOrder, requestReturn} = require('../controllers/orderController');
const router = express.Router();
const auth= require('../middleware/auth')

router.use(protect);
router.post('/create-order', placeOrder);
router.get('/get-order', getMyOrders);
router.post('/buy-now', buyNow); 
router.put('/update-status', updateOrderStatus);
router.get('/admin/all-orders', getAllOrders);
router.put('/cancel', cancelOrder);
router.patch('/:orderId/cancel', cancelOrder);
router.patch('/:orderId/return', requestReturn);

module.exports = router;