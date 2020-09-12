const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        trim:true
    },
    lastName: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    houseNumber: {
        type: Number,
        required: true,
        trim:true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: Number,
        required: true,
        trim: true
    },
    role: {
        type:String,
        required: true,
        trim: true
    },
    cart: {
        items: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: 'Products',
              required: true
            },
            weight: { type: Number, required: true },
            price: {type: Number, required: true},
            quantity: { type: Number, required: true }
          }
        ]
    },
    refreshToken: String,
    resetToken: String,
    resetTokenExpiration: Date 

    
}, { timestamps: true, versionKey: false });

userSchema.methods.comparePassword = function (candidatePassword, cb)  {
    
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        // console.log(isMatch)
        cb(null, isMatch);
    })
}


userSchema.methods.addToCart = function(product) {
    console.log(product);

    const cartItems = [...this.cart.items];
    cartItems.push({
        productId: product.id,
        weight: product.weight,
        quantity: product.quantity,
        price: product.price
    })
    const updatedCart = {
        items: cartItems 
    };


    this.cart = updatedCart;
    return this.save();


    
}

userSchema.methods.removeFromCart = function(productId) {
    console.log(productId);
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
    
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.updateFromCart = function(product) {

    console.log(product)
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product.id.toString();
    });


    const updatedCartItems = [...this.cart.items];


    updatedCartItems[cartProductIndex].quantity = product.quantity;
    updatedCartItems[cartProductIndex].weight = product.weight;
    updatedCartItems[cartProductIndex].price = product.price;


    const updatedCart = {
        items: updatedCartItems
    };

    console.log(updatedCart);

    this.cart = updatedCart;
    return this.save();

};
  
  userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };

module.exports = mongoose.model('User', userSchema, 'user');

