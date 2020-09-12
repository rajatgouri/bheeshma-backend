const router = require('express').Router();
const orderController = require('../../controllers/order');
const passport = require('passport');
const admin = require('../../middleware/admin')

router.post('/create-order', passport.authenticate('jwt', {session: false})  ,orderController.createOrder);

router.post('/get-order', passport.authenticate('jwt', {session: false})  ,orderController.getOrder);

router.post('/get-order-details', passport.authenticate('jwt', {session: false})  ,orderController.getOrderDetails);

module.exports = {
  router: router,
  basePath: '/'
};
