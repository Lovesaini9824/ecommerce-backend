# TODO: Fix Add to Cart and Buy Now Functionality

## Steps to Complete

- [x] Update src/controllers/cartController.js: Add product existence check in addToCart function to ensure the product exists before adding to cart.
- [x] Update src/controllers/orderController.js: Add getPaymentMethods function to return available payment options (e.g., ['cod', 'online']).
- [x] Update src/routes/orders.js: Add route for getPaymentMethods (GET /api/orders/payment-methods).
- [ ] Test add to cart functionality: Verify items appear in cart and MongoDB.
- [ ] Test buy now functionality: Verify order screen appears with payment options.
