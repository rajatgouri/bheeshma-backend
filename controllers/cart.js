const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.addToCart = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id, weight, quantity, price} = req.body 
    
    const product = {
        id: id,
        weight: weight,
        quantity: quantity,
        price: price
    }
    req.user
        .addToCart(product)
        .then((response) => {
            return res.status(200).json({'msg': 'Product Added to cart', status: true})
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Error in Saving Product to Cart", "status": false })
        });
}


exports.getCart = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const id = req.user._id;
    // console.log(id);

    User
        .findById(id)
        .populate('cart.items.productId')
        .then((user) => {
            return res.status(200).json({'msg': 'User Cart', 'cart': user.cart, status: true})
        })
        .catch(error => {
            console.log(error)
            return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Error in getting user Cart", "status": false })

        })

}


exports.removeProduct = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id} = req.body;

    req.user.
        removeFromCart(id)
        .then((response) => {
            return res.status(200).json({'msg': 'Product removed from Cart', status: true})

        })  
        .catch(err => {
            return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Error in removing Product from Cart", "status": false })
        })
}



exports.updateProductDetails = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }
    
    const {id, weight, quantity, price} = req.body;
        
    const product = {
        id: id,
        weight: weight,
        quantity: quantity,
        price: price
    }
    req.user
        .updateFromCart(product)
        .then((response) => {
            return res.status(200).json({'msg': 'Product Update from cart', status: true})
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Error in Updating Product to Cart", "status": false })
        });

}