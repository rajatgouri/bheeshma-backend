const router = require('express').Router();
const cartController = require('../../controllers/cart');
const passport = require('passport');

router.post('/add-to-cart', passport.authenticate('jwt', {session: false})  ,cartController.addToCart);

router.post('/get-cart', passport.authenticate('jwt', {session: false}), cartController.getCart);

router.post('/remove-product', passport.authenticate('jwt', {session: false}), cartController.removeProduct);

router.post('/update-product-details', passport.authenticate('jwt', {session: false}), cartController.updateProductDetails);

module.exports = {
  router: router,
  basePath: '/'
};
