const router = require('express').Router();
const genaralController = require('../../general');

router.post('/get-categories', (req,res,next) => {
    return res.status(200).json({'msg': 'categories fetched successfully!' ,'categories': genaralController.categories})
});

router.post('/get-cities', (req,res,next) => {
    return res.status(200).json({'msg': 'cities fetched successfully!' ,'cities': genaralController.cities})
});

module.exports = {
  router: router,
  basePath: '/'
};
