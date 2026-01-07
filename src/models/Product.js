const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: { type: [String], default: []},
  colors: { type: [String], default: []},
  highlights: { type: [String], default: []},
  description: { type: String, default: "" },
  rating: { type: Number, default:4.5 },
  category: { type: String, default: "All" },
  stock: { type: Number},
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
