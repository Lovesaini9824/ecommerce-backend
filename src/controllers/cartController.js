const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getCart = async (req, res) => {
  try {
    if (!req.user) {
      // For unauthenticated users, return empty cart
      return res.json({ items: [] });
    }
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) cart = await Cart.create({ userId, items: [] });
    return res.json(cart);
  } catch (err) {
    console.error('Get Cart Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ message: 'Invalid product ID' });

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });
  
    console.log(cart);

    const existing = cart.items.find((i) => i.productId.toString() === productId);

    if (existing) existing.qty += qty;
    else cart.items.push({ productId, qty });

    await cart.save();
    await cart.populate('items.productId');

    return res.json(cart);
  } catch (err) {
    console.error('Add To Cart Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ message: 'Invalid product ID' });

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const before = cart.items.length;
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    if (cart.items.length === before) return res.status(404).json({ message: 'Item not found in cart' });

    await cart.save();
    await cart.populate('items.productId');

    return res.json({ message: 'Item removed', cart });
  } catch (err) {
    console.error('Remove Item Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

//new changes...................................
const increaseQuantity = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: 'Invalid product ID' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: 'Item not in cart' });

    // ✅ fetch product to check stock
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // ✅ prevent over-increase
    if (cart.items[itemIndex].qty >= product.stock) {
      return res.status(400).json({ message: 'Stock limit reached' });
    }

    cart.items[itemIndex].qty += 1;

    await cart.save();
    await cart.populate('items.productId');

    return res.json({
      message: 'Quantity increased',
      cart,
    });
  } catch (err) {
    console.error('Increase Quantity Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


const reduceQuantity = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: 'Invalid product ID' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: 'Item not found in cart' });

    if (cart.items[itemIndex].qty > 1) {
      cart.items[itemIndex].qty -= 1;
    } else {
      // remove item if qty == 1
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    await cart.populate('items.productId');

    return res.json({
      message: 'Quantity updated',
      cart,
    });
  } catch (err) {
    console.error('Reduce Quantity Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { getCart, addToCart, increaseQuantity, reduceQuantity, removeItemFromCart };
