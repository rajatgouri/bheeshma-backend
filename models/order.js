const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
      weight: {type: Number, required: true},
      price: {type: Number, required: true},

    }
  ],
  status: {
    type: String,
    required: true,
    trim:true
  },
  total: {
    type: Number,
    required: true,
    trim:true
  },
  user: {
    
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
}, { timestamps: true, versionKey: false });


module.exports = mongoose.model('Order', orderSchema);
