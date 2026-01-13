// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       title: String,
//       image: String,
//       qty: { type: Number, required: true, min: 1 },
//       price: { type: Number, required: true },
//     },
//   ],
//   total: { type: Number, required: true, min: 0 },
//   address: {
//     name: String, phone: String, street: String, city: String, state: String, zip: String
//   },
//   payment_type: { type: String, enum: ['COD', 'Online', 'UPI', 'Card'], default: 'COD' },
//   status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: String,
        image: String,
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // ✅ MATCHES FLUTTER CHECKOUT
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      pincode: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      addressLine: { type: String, required: true },
      landmark: { type: String },
    },

    payment_type: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'COD',
    },

    // ✅ PAYMENT TRACKING
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    cancelReason: String,

    shippedAt: Date,
    deliveredAt: Date,
  },
<<<<<<< HEAD
  { timestamps: true }
);
=======
  payment_type: { type: String, enum: ['COD', 'Online', 'UPI', 'Card'], default: 'COD' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled','Return Requested','Returned'], default: 'Pending' },
  returnReason: { type: String },
  returnRequestedAt: { type: Date },
}, { timestamps: true });
>>>>>>> 3f38929 (Added invoice PDF generation feature)

module.exports = mongoose.model('Order', orderSchema);
