const router = require('express').Router();
const adminController = require('../../controllers/admin');
const passport = require('passport');

router.post('/get-admin-order', adminController.getOrders);



module.exports = {
  router: router,
  basePath: '/'
};
