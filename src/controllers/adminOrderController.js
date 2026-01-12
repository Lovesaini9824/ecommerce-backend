const Order = require('../models/Order');

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'title image')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

module.exports = { getAllOrdersAdmin, updateOrderStatus };
