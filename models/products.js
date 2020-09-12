const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productsSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    weight: {
        type: Number,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    mrp: {
        type: Number,
        trim: true,
        required: true
    },
    packets: [
        {
            weight: Number,
            measure: String,
            price: Number,
            mrp: Number
        }
    ],
    measure: {
        type: String,
        trim: true,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    subCategory: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    productCategory: {
        type: String,
        trim: true,
        required: true
    }




}, { timestamps: true, versionKey: false });


module.exports = mongoose.model('Products', productsSchema, 'products');

