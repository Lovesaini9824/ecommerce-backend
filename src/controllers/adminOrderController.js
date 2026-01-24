const Order = require('../models/Order');

// GET ALL ORDERS FOR ADMIN
const getAllOrdersAdmin = async (req, res) => {
  try {
    // ✅ Use case-insensitive status filter for pending/approved
    const orders = await Order.find({ status: { $in: ['pending', 'Pending', 'approved', 'Approved'] } })
    .populate('userId', 'name email') // ✅ ensure this exists
    .populate('items.productId', 'title image')
    .sort({ createdAt: -1 });

// Make sure every order has user info
    const safeOrders = orders.map(o => ({
      ...o.toObject(),
      userId: o.userId || { name: 'Deleted User', email: 'N/A' },
    }));


    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// UPDATE ORDER STATUS (ADMIN)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.status(400).json({ message: 'orderId and status required' });

    const allowed = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status.charAt(0).toUpperCase() + status.slice(1).toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ success: true, message: 'Order status updated', status: order.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

module.exports = { getAllOrdersAdmin, updateOrderStatus };
