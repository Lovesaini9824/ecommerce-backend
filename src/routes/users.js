// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {updateProfile} = require('../controllers/userController');
// Update user profile

router.use(protect);
router.put('/update-profile', updateProfile);
module.exports = router;
