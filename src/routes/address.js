const express = require('express');
const { protect } = require('../middleware/auth');
const { saveAddress, getAddresses, updateAddress, deleteAddress} = require('../controllers/addressController');
const router = express.Router();

router.use(protect);
router.post('/address', protect, saveAddress);
router.get('/address',protect, getAddresses);
router.put('/address/:addressId',protect, updateAddress);       // Update address by ID
router.delete('/address/:addressId',protect, deleteAddress);
module.exports = router;
