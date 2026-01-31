// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// // ====================== BUY NOW ======================
// const buyNow = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { items, payment_type = 'COD', address } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: 'No product provided' });
//     }

//     const { product_id, qty = 1 } = items[0];

//     const product = await Product.findById(product_id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const order = await Order.create({
//       userId,
//       items: [
//         {
//           productId: product._id,
//           title: product.title,
//           image: product.image,
//           qty,
//           price: product.price,
//         },
//       ],
//       total: product.price * qty,
//       address,
//       payment_type,
//       status: payment_type === 'ONLINE' ? 'Confirmed' : 'Pending',
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Buy now order placed',
//       orderId: order._id,
//     });
//   } catch (err) {
//     console.error('BUY NOW ERROR:', err);
//     res.status(500).json({ message: 'Buy now failed' });
//   }
// };


// // ====================== PLACE ORDER FROM CART ======================
// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { payment_type = 'COD', address } = req.body;

//     if (!address)
//       return res.status(400).json({ message: 'Delivery address required' });

//     const cart = await Cart.findOne({ userId }).populate('items.productId');

//     if (!cart || cart.items.length === 0)
//       return res.status(400).json({ message: 'Your cart is empty' });

//     const items = cart.items.map(i => ({
//       productId: i.productId._id,
//       title: i.productId.title,
//       image: i.productId.image,
//       qty: i.qty,
//       price: i.productId.price,
//     }));

//     const total = cart.items.reduce((sum, i) => sum + i.qty * i.productId.price, 0);

//     const order = await Order.create({
//       userId,
//       items,
//       total,
//       address,
//       payment_type,
//       status: payment_type === 'Online' ? 'Confirmed' : 'Pending', // COD = pending
//     });

//     // Clear cart
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       orderId: order._id,
//     });
//   } catch (error) {
//     console.error('PLACE ORDER ERROR:', error);
//     res.status(500).json({ message: 'Order failed' });
//   }
// };

// // ====================== GET USER ORDERS ======================

// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user._id })
//       .populate('items.productId', 'title price image')
//       .sort({ createdAt: -1 });

//     const data = orders.map(o => ({
//       _id: o._id.toString(),          // 🔥 match Flutter
//       total: Number(o.total) || 0,
//       status: o.status ?? 'Pending',
//       payment_type: o.payment_type ?? 'COD',
//       createdAt: o.createdAt,
//       address: o.address ?? {},       // ✅ VERY IMPORTANT
//       items: o.items.map(i => ({
//         title: i.productId?.title ?? '',
//         price: Number(i.productId?.price ?? 0),
//         qty: Number(i.qty ?? 1),
//         image: i.productId?.image ?? null,
//       })),
//       image: o.items[0]?.productId?.image ?? null,
//     }));

//     res.json({ data });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Fetch orders failed' });
//   }
// };

// // ====================== CANCEL ORDER ======================
// const cancelOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { orderId } = req.params;

//     const order = await Order.findOne({ _id: orderId, userId });
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (['Shipped', 'Delivered'].includes(order.status)) {
//       return res.status(400).json({ message: 'Order cannot be cancelled now' });
//     }

//     order.status = 'Cancelled';
//     await order.save();

//     res.json({ success: true, message: 'Order cancelled successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Cancel failed' });
//   }
// };

// // ====================== REQUEST RETURN ======================
// const requestReturn = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { orderId } = req.params;
//     const { reason } = req.body;

//     const order = await Order.findOne({ _id: orderId, userId });
//     if (!order) return res.status(404).json({ message: 'Order not found' });

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

// // ====================== GET ALL ORDERS (ADMIN) ======================
// // GET ALL ORDERS FOR ADMIN
// const getAllOrders = async (req, res) => {
//   try {
//     // Fetch all orders, but only show pending/approved/confirmed
//     const orders = await Order.find({ user: req.user.id })
//       .populate('items.productId', 'title image');

//     res.json(
//       orders.map(order => ({
//         orderId: order._id,
//         createdAt: order.createdAt,
//         status: order.status,
//         paymentType: order.paymentType,
//         total: order.total,
//         items: order.items.map(item => ({
//           productId: item.productId._id,
//           title: item.productId.title,
//           qty: item.qty,
//           price: item.price,
//           image: item.productId.image, // ✅ ADD HERE
//         })),
//       }))
//     );
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ====================== UPDATE ORDER STATUS (ADMIN) ======================
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
//     if (!orderId || !status) return res.status(400).json({ message: 'orderId and status required' });

//     const allowed = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled'];
//     if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

//     const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     res.json({ success: true, message: 'Order status updated', status: order.status });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to update status' });
//   }
// };

// module.exports = {
//   placeOrder,
//   buyNow,
//   getMyOrders,
//   cancelOrder,
//   requestReturn,
//   getAllOrders,
//   updateOrderStatus,
// };


const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


const getFinalPrice = (price, discount = 0) => {
  if (!discount || discount <= 0) return price;
  return price - (price * discount) / 100;
};

// ====================== BUY NOW ======================
// const buyNow = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { items, payment_type = 'COD', address } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: 'No product provided' });
//     }

//     const { product_id, qty = 1 } = items[0];

//     const discount = product.discount || 0;
//     const finalPrice =
//       discount > 0
//         ? product.price - (product.price * discount) / 100
//         : product.price;

//     const product = await Product.findById(product_id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const order = await Order.create({
//       userId,
//       items: [
//         {
//           productId: product._id,
//           title: product.title,
//           image: product.image,
//           qty,
//           price: product.finalPrice,
//         },
//       ],
//       total: finalPrice * qty,
//       address,
//       payment_type,
//       status: payment_type === 'ONLINE' ? 'Confirmed' : 'Pending',
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Buy now order placed',
//       orderId: order._id,
//     });
//   } catch (err) {
//     console.error('BUY NOW ERROR:', err);
//     res.status(500).json({ message: 'Buy now failed' });
//   }
// };


const buyNow = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, payment_type = 'COD', address } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No product provided' });

    const { product_id, qty = 1 } = items[0];

    const product = await Product.findById(product_id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    const finalPrice = getFinalPrice(product.price, product.discount);

    const order = await Order.create({
      userId,
      items: [
        {
          productId: product._id,
          title: product.title,
          image: product.images?.[0] || '',
          qty,
          price: finalPrice, // ✅ DISCOUNTED PRICE
        },
      ],
      total: finalPrice * qty, // ✅ DISCOUNTED TOTAL
      address,
      payment_type,
      status: payment_type === 'ONLINE' ? 'Confirmed' : 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Buy now order placed',
      orderId: order._id,
    });
  } catch (err) {
    console.error('BUY NOW ERROR:', err);
    res.status(500).json({ message: 'Buy now failed' });
  }
};



// ====================== PLACE ORDER FROM CART ======================
// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { payment_type = 'COD', address } = req.body;

//     if (!address)
//       return res.status(400).json({ message: 'Delivery address required' });

//     const cart = await Cart.findOne({ userId }).populate('items.productId');

//     if (!cart || cart.items.length === 0)
//       return res.status(400).json({ message: 'Your cart is empty' });

//     const discount = product.discount || 0;
//     const finalPrice =
//       discount > 0
//         ? product.price - (product.price * discount) / 100
//         : product.price;

//     const items = cart.items.map(i => ({
//       productId: i.productId._id,
//       title: i.productId.title,
//       image: i.productId.image,
//       qty: i.qty,
//       price: i.productId.finalPrice,
//     }));

//     const total = cart.items.reduce((sum, i) => sum + i.qty * i.productId.price, 0);

//     const order = await Order.create({
//       userId,
//       items,
//       total,
//       address,
//       payment_type,
//       status: payment_type === 'Online' ? 'Confirmed' : 'Pending', // COD = pending
//     });

//     // Clear cart
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       orderId: order._id,
//     });
//   } catch (error) {
//     console.error('PLACE ORDER ERROR:', error);
//     res.status(500).json({ message: 'Order failed' });
//   }
// };

const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { payment_type = 'COD', address } = req.body;

    if (!address)
      return res.status(400).json({ message: 'Delivery address required' });

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Your cart is empty' });

    let total = 0;

    const items = cart.items.map(i => {
      const product = i.productId;
      const finalPrice = getFinalPrice(product.price, product.discount);

      total += finalPrice * i.qty;

      return {
        productId: product._id,
        title: product.title,
        image: product.images?.[0] || '',
        qty: i.qty,
        price: finalPrice, // ✅ DISCOUNTED PRICE
      };
    });

    const order = await Order.create({
      userId,
      items,
      total, // ✅ DISCOUNTED TOTAL
      address,
      payment_type,
      status: payment_type === 'ONLINE' ? 'Confirmed' : 'Pending',
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
    });
  } catch (error) {
    console.error('PLACE ORDER ERROR:', error);
    res.status(500).json({ message: 'Order failed' });
  }
};

// ====================== GET USER ORDERS ======================

// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user._id })
//       .populate('items.productId', 'title price image')
//       .sort({ createdAt: -1 });

//     const data = orders.map(o => ({
//       _id: o._id.toString(),          // 🔥 match Flutter
//       total: Number(o.total) || 0,
//       status: o.status ?? 'Pending',
//       payment_type: o.payment_type ?? 'COD',
//       createdAt: o.createdAt,
//       address: o.address ?? {},       // ✅ VERY IMPORTANT
//       items: o.items.map(i => ({
//         title: i.productId?.title ?? '',
//         price: Number(i.productId?.price ?? 0),
//         qty: Number(i.qty ?? 1),
//         image: i.productId?.image ?? null,
//       })),
//       image: o.items[0]?.productId?.image ?? null,
//     }));

//     res.json({ data });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Fetch orders failed' });
//   }
// };


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const data = orders.map(o => ({
      _id: o._id.toString(),
      total: Number(o.total),
      status: o.status,
      payment_type: o.payment_type,
      createdAt: o.createdAt,
      address: o.address,
      items: o.items.map(i => ({
        title: i.title,
        price: i.price, // ✅ STORED DISCOUNTED PRICE
        qty: i.qty,
        image: i.image,
      })),
      image: o.items[0]?.image ?? null,
    }));

    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: 'Fetch orders failed' });
  }
};

// ====================== CANCEL ORDER ======================
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled now' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Cancel failed' });
  }
};

// ====================== REQUEST RETURN ======================
const requestReturn = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Return allowed only after delivery' });
    }

    order.status = 'Return Requested';
    order.returnReason = reason;
    order.returnRequestedAt = new Date();

    await order.save();

    res.json({ success: true, message: 'Return requested' });
  } catch (err) {
    res.status(500).json({ message: 'Return failed' });
  }
};

// ====================== GET ALL ORDERS (ADMIN) ======================
// GET ALL ORDERS FOR ADMIN
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders, but only show pending/approved/confirmed
    const orders = await Order.find({ user: req.user.id })
      .populate('items.productId', 'title image');

    // res.json(
    //   orders.map(order => ({
    //     orderId: order._id,
    //     createdAt: order.createdAt,
    //     status: order.status,
    //     paymentType: order.paymentType,
    //     total: order.total,
    //     items: order.items.map(item => ({
    //       productId: item.productId._id,
    //       title: item.productId.title,
    //       qty: item.qty,
    //       price: item.price,
    //       image: item.productId.image, // ✅ ADD HERE
    //     })),
    //   }))
    // );
    res.json({
      orders: orders.map(order => ({
        _id: order._id,
        createdAt: order.createdAt,
        status: order.status,
        payment_type: order.payment_type,
        total: order.total, // ✅ DISCOUNTED TOTAL
        items: order.items.map(item => ({
          productId: item.productId._id,
          title: item.title,
          qty: item.qty,
          price: item.price, // ✅ STORED DISCOUNT PRICE
          image: item.image,
        })),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== UPDATE ORDER STATUS (ADMIN) ======================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.status(400).json({ message: 'orderId and status required' });

    const allowed = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ success: true, message: 'Order status updated', status: order.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

module.exports = {
  placeOrder,
  buyNow,
  getMyOrders,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
};
