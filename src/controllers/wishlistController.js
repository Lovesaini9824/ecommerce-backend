const Wishlist = require('../models/Wishlist');

/* ADD / REMOVE */
// const toggleWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId } = req.body;

//     const exists = await Wishlist.findOne({ userId, productId });

//     if (exists) {
//       await Wishlist.deleteOne({ _id: exists._id });
//       return res.json({ message: 'Removed from wishlist', wished: false });
//     }

//     await Wishlist.create({ userId, productId });
//     res.json({ message: 'Added to wishlist', wished: true });
//   } catch (err) {
//     res.status(500).json({ message: 'Wishlist error' });
//   }
// };

const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({ userId, productId });

    if (exists) {
      await Wishlist.deleteOne({ _id: exists._id });
      return res.json({ wished: false });
    }

    await Wishlist.create({ userId, productId });
    res.json({ wished: true });

  } catch (err) {
    if (err.code === 11000) {
      // duplicate insert safety
      return res.json({ wished: true });
    }
    res.status(500).json({ message: 'Wishlist error' });
  }
};


/* GET USER WISHLIST */
const getWishlist = async (req, res) => {
  try {
    const list = await Wishlist.find({ userId: req.user._id })
      .populate('productId');

    res.json({ success: true, wishlist: list });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
};

module.exports = { toggleWishlist, getWishlist };
