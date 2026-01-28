const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      title: String,
      image: String,
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true, min: 0 },
  address: {
    name: String, phone: String, street: String, city: String, state: String, zip: String
  },
  payment_type: { type: String, enum: ['COD', 'Online', 'UPI', 'Card'], default: 'COD' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled','Return Requested','Returned'], default: 'Pending' },
  returnReason: { type: String },
  returnRequestedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
