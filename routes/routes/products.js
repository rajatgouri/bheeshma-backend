const router = require('express').Router();
const productController = require('../../controllers/products');
const passport = require('passport');

router.post('/add-product', productController.addProduct);

router.post('/get-product', productController.getProductsById);

router.post('/get-products', productController.getProductsByCategory);

router.post('/update-product', productController.updateProduct);

router.post('/delete-product', productController.deleteProduct)

router.post('/search-products', productController.searchProducts)


module.exports = {
  router: router,
  basePath: '/'
};
