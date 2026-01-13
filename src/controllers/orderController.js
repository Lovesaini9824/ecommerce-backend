// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// /* =========================
//    BUY NOW
// ========================= */
// const buyNow = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId, qty = 1, payment_type = 'COD', address } = req.body;

//     if (!productId)
//       return res.status(400).json({ message: 'Product ID required' });

//     if (
//       !address?.name ||
//       !address?.phone ||
//       !address?.street ||
//       !address?.city ||
//       !address?.state ||
//       !address?.zip
//     ) {
//       return res.status(400).json({ message: 'Complete address is required' });
//     }

//     const product = await Product.findById(productId);
//     if (!product)
//       return res.status(404).json({ message: 'Product not found' });

//     const safeQty = Math.max(Number(qty), 1);

//     const order = await Order.create({
//       userId,
//       items: [
//         {
//           productId: product._id,
//           title: product.title,
//           image: product.image,
//           qty: safeQty,
//           price: product.price,
//         },
//       ],
//       total: product.price * safeQty,
//       address,
//       payment_type,
//       status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       orderId: order._id,
//     });
//   } catch (error) {
//     console.error('BUY NOW ERROR:', error);
//     res.status(500).json({ message: 'Buy now failed' });
//   }
// };

// /* =========================
//    GET MY ORDERS
// ========================= */
// // =======
// // >>>>>>> 3f38929 (Added invoice PDF generation feature)
// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const orders = await Order.find({ userId })
//       .populate('items.productId', 'title price image')
//       .sort({ createdAt: -1 });

//     const formattedOrders = orders.map(order => ({
//       orderId: order._id.toString(),
//       total: Number(order.total) || 0,
//       status: order.status || 'Pending',
//       payment_type: order.payment_type || 'COD',
//       address: order.address,
//       createdAt: order.createdAt,

//       items: order.items.map(item => ({
//         productId: item.productId?._id,
//         title: item.productId?.title,
//         price: Number(item.productId?.price ?? 0),
//         qty: Number(item.qty ?? 1),
//         image: item.productId?.image
//           ? `${process.env.BASE_URL}${item.productId.image.startsWith('/') ? '' : '/'}${item.productId.image}`
//           : null,
//       })),
//     }));

//     res.json({
//       success: true,
//       orders: formattedOrders,
//     });
//   } catch (error) {
//     console.error('Get orders error:', error);
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// };

// /* =========================
//    PLACE ORDER (FROM CART)
// ========================= */
// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { payment_type = 'COD', address } = req.body;

//     if (!address)
//       return res.status(400).json({ message: 'Delivery address required' });

//     const cart = await Cart.findOne({ userId }).populate('items.productId');

//     if (!cart || cart.items.length === 0)
//       return res.status(400).json({ message: 'Your cart is empty' });

//     const items = cart.items.map(item => ({
//       productId: item.productId._id,
//       title: item.productId.title,
//       image: item.productId.image,
//       qty: item.qty,
//       price: item.productId.price,
//     }));

//     const total = cart.items.reduce(
//       (sum, item) => sum + item.qty * item.productId.price,
//       0
//     );

//     const order = await Order.create({
//       userId,
//       items,
//       total,
//       address,
//       payment_type,
//       status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
//     });

//     cart.items = [];
//     await cart.save();

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       orderId: order._id,
//     });
//   } catch (error) {
//     console.error('Order error:', error);
//     res.status(500).json({ message: 'Order failed' });
//   }
// };

// module.exports = {
//   buyNow,
//   getMyOrders,
//   placeOrder,
// };
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;

//     const allowed = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
//     if (!allowed.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.json({
//       success: true,
//       message: 'Order status updated',
//       status: order.status,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update status' });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('userId', 'name email')
//       .populate('items.productId', 'title image')
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// };

// // const cancelOrder = async (req, res) => {
// //   const { orderId, reason } = req.body;

// //   const order = await Order.findById(orderId);
// //   if (!order) return res.status(404).json({ message: 'Order not found' });

// //   if (order.status !== 'Pending') {
// //     return res.status(400).json({ message: 'Cannot cancel now' });
// //   }

// //   order.status = 'Cancelled';
// //   order.cancelReason = reason;
// //   await order.save();

// //   res.json({ success: true, message: 'Order cancelled' });
// // };


// const cancelOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { orderId } = req.params;

//     const order = await Order.findOne({ _id: orderId, userId });

//     if (!order)
//       return res.status(404).json({ message: 'Order not found' });

//     if (['Shipped', 'Delivered'].includes(order.status)) {
//       return res.status(400).json({ message: 'Order cannot be cancelled' });
//     }

//     order.status = 'Cancelled';
//     await order.save();

//     res.json({ success: true, message: 'Order cancelled successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Cancel failed' });
//   }
// };


// const requestReturn = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { orderId } = req.params;
//     const { reason } = req.body;

//     const order = await Order.findOne({ _id: orderId, userId });

//     if (!order)
//       return res.status(404).json({ message: 'Order not found' });

//     if (order.status !== 'Delivered') {
//       return res.status(400).json({ message: 'Return allowed only after delivery' });
//     }

//     order.status = 'Return Requested';
//     order.returnReason = reason;
//     order.returnRequestedAt = new Date();

//     await order.save();

//     res.json({ success: true, message: 'Return requested' });
//   } catch (err) {
//     res.status(500).json({ message: 'Return failed' });
//   }
// };



// module.exports = { placeOrder, getMyOrders, buyNow, updateOrderStatus, getAllOrders, cancelOrder, requestReturn };


const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/* =========================
   BUY NOW
========================= */
const buyNow = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;
    const { productId, qty = 1, payment_type = 'COD', address } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    if (
      !address?.name ||
      !address?.phone ||
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.zip
    ) {
      return res.status(400).json({ message: 'Complete address is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const safeQty = Math.max(Number(qty), 1);

    const order = await Order.create({
      userId,
      items: [{
        productId: product._id,
        title: product.title,
        image: product.image,
        qty: safeQty,
        price: product.price,
      }],
      total: product.price * safeQty,
      address,
      payment_type,
      status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
    });

  } catch (error) {
    console.error('BUY NOW ERROR ❌', error);
    res.status(500).json({ message: 'Buy now failed', error: error.message });
  }
};

/* =========================
   GET MY ORDERS
========================= */
const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate('items.productId', 'title price image')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    console.error('GET ORDERS ERROR ❌', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/* =========================
   PLACE ORDER FROM CART
========================= */
const placeOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;
    const { payment_type = 'COD', address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Delivery address required' });
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const items = cart.items.map(item => ({
      productId: item.productId._id,
      title: item.productId.title,
      image: item.productId.image,
      qty: item.qty,
      price: item.productId.price,
    }));

    const total = cart.items.reduce(
      (sum, item) => sum + item.qty * item.productId.price,
      0
    );

    const order = await Order.create({
      userId,
      items,
      total,
      address,
      payment_type,
      status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
    });

  } catch (error) {
    console.error('PLACE ORDER ERROR ❌', error);
    res.status(500).json({ message: 'Order failed', error: error.message });
  }
};

/* =========================
   UPDATE ORDER STATUS (ADMIN)
========================= */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, status: order.status });

  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'title image')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/* =========================
   CANCEL ORDER
========================= */
const cancelOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Cancel failed' });
  }
};

/* =========================
   REQUEST RETURN
========================= */
const requestReturn = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Return allowed only after delivery' });
    }

    order.status = 'Return Requested';
    order.returnReason = reason;
    order.returnRequestedAt = new Date();
    await order.save();

    res.json({ success: true, message: 'Return requested' });

  } catch (error) {
    res.status(500).json({ message: 'Return failed' });
  }
};

/* =========================
   EXPORTS (ONLY ONCE)
========================= */
module.exports = {
  buyNow,
  getMyOrders,
  placeOrder,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  requestReturn,
};
