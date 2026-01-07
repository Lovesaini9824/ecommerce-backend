const express = require('express');
const { protect } = require('../middleware/auth');
const { saveAddress, getAddresses, updateAddress, deleteAddress} = require('../controllers/addressController');
const router = express.Router();

router.use(protect);
router.post('/address', saveAddress);
router.get('/address', getAddresses);
router.put('/address/:addressId', updateAddress);       // Update address by ID
router.delete('/address/:addressId', deleteAddress);
module.exports = router;