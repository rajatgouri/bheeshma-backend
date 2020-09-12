const router = require('express').Router();
const authController = require('../../controllers/auth');
const passport = require('passport');

router.post('/signup', authController.Signup);

router.post('/signin', authController.Signin);

router.post('/reset-password-token', authController.resetPasswordToken);

router.post('/reset-password', authController.resetPassword);

router.post('/token', authController.refreshToken);



module.exports = {
  router: router,
  basePath: '/'
};
