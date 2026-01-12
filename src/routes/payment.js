const express = require("express");
const crypto = require("crypto");
const razorpay = require("../utils/razorpay");

const router = express.Router();

/**
 * CREATE RAZORPAY ORDER
 */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

/**
 * VERIFY PAYMENT SIGNATURE  ✅ ADD YOUR CODE HERE
 */
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false });
  }
});

module.exports = router;
