// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const app = express();
// const path = require("path");


// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('E-commerce API is running');
// });
// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api', require('./routes/address'));
// ///users/update-profile
// //images
// app.use("/images", express.static(path.join(__dirname, "assests")));

// // DB connect
// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connected');
//     // Seed products
//     const seedProducts = require('./seedProducts');
//     await seedProducts();
//   } catch (e) {
//     console.error('MongoDB error:', e);
//     process.exit(1);
//   }
// })();

// // 404
// app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");

const app = express();

/* 🔹 MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* 🔹 ROOT + HEALTH CHECK */
app.get('/', (req, res) => {
  res.status(200).send('E-commerce API is running 🚀');
});

/* 🔹 ROUTES */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api', require('./routes/address'));

/* 🔹 STATIC IMAGES */
app.use("/images", express.static(path.join(__dirname, "assests")));

/* 🔹 DATABASE */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });

/* 🔹 404 (KEEP THIS LAST) */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* 🔹 START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
