const Product = require('./models/Product');

const products = [
  {
    title: "Nike Air Max Shoes",
    price: 4499,
    image: "https://m.media-amazon.com/images/I/61Z8eSmM03L._AC_UL640_FMwebp_QL65_.jpg",
    colors: ["Red", "Black", "White"],
    highlights: [
      "Breathable mesh",
      "Lightweight sole",
      "Comfort fit"
    ],  
    description: "Comfortable stylish running shoes.",
    rating: 4.5,
    category: "Shoes",
    stock: 10
  },
  {
    title: "Mi Smart Band 5",
    price: 1999,
    image: "https://m.media-amazon.com/images/I/51sRG9RoizL._AC_UY436_FMwebp_QL65_.jpg",
    description: "Fitness tracker with heart rate monitor.",
  },
  {
    title: "Boat Airdopes 141",
    price: 1299,
    image: "https://m.media-amazon.com/images/I/61KNJav3S9L._SL1500_.jpg",
    description: "Wireless earbuds with 42-hour playback.",
  },
  {
    title: "Puma Sports T-Shirt",
    price: 799,
    image: "https://m.media-amazon.com/images/I/51dNJKqwj1L._SX679_.jpg",
    description: "Breathable sports dry-fit t-shirt.",
  },
  {
    title: "Samsung 500GB SSD",
    price: 3999,
    image: "https://m.media-amazon.com/images/I/41obSnkSzbL._AC_UY436_FMwebp_QL65_.jpg",
    description: "Ultra-fast portable SSD.",
  },
  {
    title: "Gaming Keyboard RGB",
    price: 1499,
    image: "https://m.media-amazon.com/images/I/71iaE9KC9FL._AC_SR230,210_CB1169409_QL70_.jpg",
    description: "Mechanical RGB keyboard for gaming.",
  },
  {
    title: "Sony Headphones WH-CH520",
    price: 2999,
    image: "https://m.media-amazon.com/images/I/41lArSiD5hL._AC_UY436_FMwebp_QL65_.jpg",
    description: "Bluetooth headphones with deep bass.",
  },
  {
    title: "Apple iPhone Charger",
    price: 1499,
    image: "https://m.media-amazon.com/images/I/51+KFUOerAL._AC_UY436_FMwebp_QL65_.jpg",
    description: "20W fast charger USB-C.",
  },
  {
    title: "Allen Solly Men's Jeans",
    price: 1899,
    image: "https://m.media-amazon.com/images/I/61yO5ukcEiL._AC_UL640_FMwebp_QL65_.jpg",
    description: "Slim fit stretchable denim.",
  },
  {
    title: "Study Table Lamp LED",
    price: 499,
    image: "https://m.media-amazon.com/images/I/617jZZZhr3S._AC_UL640_FMwebp_QL65_.jpg",
    description: "LED lamp with 3 brightness modes.",
  }
];

const seedProducts = async () => {
  try {
    const existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      await Product.insertMany(products);
      console.log('Products seeded successfully');
    } else {
      console.log('Products already exist, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = seedProducts;
