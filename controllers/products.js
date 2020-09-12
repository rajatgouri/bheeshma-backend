const Product = require('../models/products');
const { validationResult } = require('express-validator');
const products = require('../models/products');


exports.addProduct = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {packets } = req.body;

    if (packets.length <=0) {
        return res.status(400).json({'status': false, error: 'NO_PACKET', 'msg': 'Please add Atleast one Packet in Product'})
    }
 
    const product = new Product(req.body)
    product
        .save()
        .then((response) => {
            return res.status(200).json({'status': true, 'msg': 'product added successfully'});

        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({'status': false, error: 'INTERNAL_SERVER', 'msg': 'Internal Server Error!'});
        })
}


exports.getProductsByCategory = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }


    Product
        .find(req.body)
        .then((response) => {
            return res.status(200).json({'status': true, 'msg': 'products fetched successfully', data: response});
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({'status': false, error: 'INTERNAL_SERVER', 'msg': 'Internal Server Error!'});
        })
}

exports.getProductsById = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id} = req.body;
        
    Product
        .findById(id)
        .then((response) => {
            return res.status(200).json({'status': true, 'msg': 'products fetched successfully', data: response});
        })
        .catch(err => {
            return res.status(400).json({'status': false, error: 'INTERNAL_SERVER', 'msg': 'Internal Server Error!'});
        })
}

exports.updateProduct = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id, product} = req.body;

    Product
        .findByIdAndUpdate(id, product)
        .then((response) => {
            return res.status(200).json({'status': true, 'msg': 'products Updated successfully'});
        })
        .catch(err => {
            return res.status(400).json({'status': false, error: 'INTERNAL_SERVER', 'msg': 'Internal Server Error!'});
        })
}

exports.deleteProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id} = req.body;
    Product
        .findByIdAndDelete(id)
        .then((response) => {

            return res.status(200).json({'status': true, 'msg': 'products Deleted successfully'});
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({'status': false, error: 'INTERNAL_SERVER', 'msg': 'Internal Server Error!'});
        })
}


exports.searchProducts = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const { value } = req.body;
    
    if (!value) {
        return res.status(200).send({'msg': 'products fetched successfuly!', products: []})

    }

    Product
        .find({
            $or: [{ name: new RegExp(value, 'i') }, { subCategory : new RegExp(value, 'i')  }, { category: new RegExp(value, 'i')  } , {productCategory: new RegExp(value, 'i') }]
        })
        .then((products) => {
            // console.log(products)
            return res.status(200).send({'msg': 'products fetched successfuly!', products: products})
        })
        .catch(err => {
            console.log(err)
        })
}