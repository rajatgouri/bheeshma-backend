const router = require('express').Router();
const userController = require('../../controllers/user');
const passport = require('passport');

router.post('/get-user',passport.authenticate('jwt', {session: false}) ,userController.getUser);

router.post('/update-user',passport.authenticate('jwt', {session: false}) ,userController.updateUser);


module.exports = {
  router: router,
  basePath: '/'
};
