const Address = require('../models/Address');

// Get all addresses for a user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.json({ data: addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save a new address
  const saveAddress = async (req, res) => {
    try {
      const { fullName, phone, pincode, city, state, addressLine, landmark, isDefault = false} = req.body;

      const newAddress = new Address({
        userId: req.user._id,
        fullName,
        phone,
        pincode,
        city,
        state,
        addressLine,
        landmark,
        isDefault: req.body.isDefault || false,
      });

      // If this address is marked default, remove default from other addresses
      if (newAddress.isDefault) {
        await Address.updateMany(
          { userId: req.user._id, isDefault: true },
          { $set: { isDefault: false } }
        );
      }

      await newAddress.save();
      res.json({ message: 'Address saved', data: newAddress });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Update an existing address by ID
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, pincode, city, state, addressLine, landmark, isDefault } = req.body;

    const address = await Address.findOne({ _id: addressId, userId: req.user._id });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    // Update fields
    address.set({ fullName, phone, pincode, city, state, addressLine, landmark, isDefault });

    // If set as default, unset default from other addresses
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user._id, _id: { $ne: addressId }, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    await address.save();
    res.json({ message: 'Address updated', data: address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an address by ID
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findOneAndDelete({ _id: addressId, userId: req.user._id });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAddresses, saveAddress, updateAddress, deleteAddress };
