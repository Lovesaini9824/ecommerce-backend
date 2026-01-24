const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth');
const {
  toggleWishlist,
  getWishlist,
} = require('../controllers/wishlistController');

router.post('/toggle', protect, toggleWishlist);
router.get('/get-wishlist', protect, getWishlist);
 
module.exports = router;
