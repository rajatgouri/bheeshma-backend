const User = require('../models/user');
const Products = require('../models/products');
const Orders = require('../models/order');

exports.getOrders = (req,res,next) => {
    const {status} = req.body;

    Orders
        .find({status})
        .sort([['createdAt', 1]] )
        .then((orders) => {
            // console.log(orders)

            return res.status(200).json({'msg': 'order fetched successfully!', orders: orders});
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({'error': 'INTERNAL_SERVER', 'msg': 'Error in fetching Orders!'})

        })
}