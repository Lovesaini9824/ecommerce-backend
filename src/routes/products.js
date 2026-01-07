const express = require('express');
const { getALlproduct, getProductById} = require('../controllers/productController');
const router = express.Router();

router.get('/get-products', getALlproduct);
router.get('/:id', getProductById);
module.exports = router;
