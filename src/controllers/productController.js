// const Product = require("../models/Product");

// const getALlproduct = async (req, res) => {
//   try {
//     const products = await Product.find();  
//     console.log("product",products )
//     return res.status(200).json({
//       success: true,
//       message: "product data fetched",
//       data: products,
//     });
//   } catch (error) {
//     console.log("Backend Product Error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product)
//       return res.status(404).json({ message: "Product not found" });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { getALlproduct, getProductById };


const Product = require("../models/Product");
// const getALlproduct = async (req, res) => {
//   try {
//     const { category, sort, page = 1, limit = 10 } = req.query;

//     let filter = {};
//     let sortOption = {};

//     if (category && category !== "All") {
//       filter.category = category;
//     }

//     if (sort === "price_asc") sortOption.price = 1;
//     else if (sort === "price_desc") sortOption.price = -1;
//     else if (sort === "rating") sortOption.rating = -1;

//     const skip = (page - 1) * limit;

//     const products = await Product.find(filter)
//       .sort(sortOption)
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Product.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       message: "Product data fetched",
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       data: products,
//     });
//   } catch (error) {
//     console.log("Backend Product Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getALlproduct = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    const products = await Product.find(filter);

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
