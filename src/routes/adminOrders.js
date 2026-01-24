const express = require('express');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const {
  getAllOrdersAdmin,
  updateOrderStatus,
} = require('../controllers/adminOrderController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/all-orders', getAllOrdersAdmin);
router.put('/update-status', updateOrderStatus);

module.exports = router;
