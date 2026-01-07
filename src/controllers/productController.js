const Product = require("../models/Product");

const getALlproduct = async (req, res) => {
  try {
    const products = await Product.find();  
    console.log("product",products )
    return res.status(200).json({
      success: true,
      message: "product data fetched",
      data: products,
    });
  } catch (error) {
    console.log("Backend Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getALlproduct, getProductById };
