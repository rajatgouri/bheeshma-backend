
const Order = require('../models/order');
const User = require('../models/user');
const { validationResult } = require('express-validator');



exports.createOrder = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {status, total } = req.body;
    const id = req.user._id;

    User
        .findById(id)
        .populate('cart.items.productId')
        .then((user) => {
            return user.cart.items.map(i => {
                return { quantity: i.quantity,  weight: i.weight, price: i.price, product: { ...i.productId._doc } };
            });
        })
        .then((products) => {

            const order = new Order({
                user: req.user._id,
                status: status,
                total: total,
                products: products
              });
              return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
            
        })
        .then(() => {
            return res.status(200).json({'msg': 'order placed successully!'})
        })  
        .catch(err => {
            console.log(err)
        })
}

exports.getOrder = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    let id = req.user._id;

    Order
        .find({user: id})
        .limit(20)
        .sort([['createdAt', -1]] )
        .exec()
        .then((orders) => {
            return res.status(200).json({'msg': 'order fetched successfully!', 'orders': orders})
        })
        .catch(err => {
            return res.status(500).json({'error': 'INTERNAL_SERVER', 'msg': 'Error in fetching Orders!'})
        })
}

exports.getOrderDetails = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id} = req.body;
    Order
        .findById(id)
        .then((order) => {
            return res.status(200).json({'msg': 'order fetched successfully!', 'order': order})
        })
        .catch(err => {
            return res.status(500).json({'error': 'INTERNAL_SERVER', 'msg': 'Error in fetching Order Details!'})
        })   
}

