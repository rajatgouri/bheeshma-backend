const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const emailExistence = require('email-existence');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const config = require('../server-config');
const user = require('../models/user');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.gmail,
        pass: config.gmailPassword
    }
});

function createToken(user) {
    return {
        token: generateAccessToken(user),
        refreshToken: jwt.sign({ "id": user.id, "email": user.emal }, config.jwt_secret_key), 
    }
}

function generateAccessToken(user) {
    return jwt.sign({ "id": user.id, "email": user.emal }, config.jwt_secret_key, { expiresIn: config.jwt_ExpiresIn })
}


async function mailer(recipient) {

    
    const buffer = await crypto.randomBytes(3)

    const token = buffer.toString('hex');

        const user = await User.findById({ _id: recipient })

        if (!user) {
            return res.status(400).json({ "msg": "Please enter Registered Email with us!", "status": false });
        }


        user.resetToken = token;
        user.resetTokenExpiration = new Date(Date.now() + config.resetTokenExpiration);

        const saved = await user.save();

        if (!saved) {
            return res.status(400).json({ "msg": "Server Error Please Try again Later!", "status": false });
        }

        var mailOptions = {
            from: config.gmail,
            to: user.email,
            subject: 'Reset Password Bheeshma Grocery',
            text: `Your password reset code is ${token}`
        };

        return transporter.sendMail(mailOptions)

}


exports.Signup = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const { firstName, lastName, email, password, phone, houseNumber, street, city, pincode, role } = req.body;

    emailExistence.check(email, function (err, response) {
        if (err) return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Error in Validate Email", "status": false })
        if (response === false) {
            return res.status(400).json({"error": "INVALID_EMAIL", "msg": "Please enter a valid Email address", "status": false })
        }


        User.findOne({$or: [
            {email: email},
            {phone: phone}
        ]})
            .then(user => {
                if (user) {
                    return res.status(400).json({ "error": "USER_EXISTS", "msg": "User Already Exists!", "status": false })
                }

                bcrypt
                    .hash(password, 12)
                    .then(hashedPassword => {

                        const newUser = new User({
                            firstName,
                            lastName,
                            email,
                            password: hashedPassword,
                            phone,
                            houseNumber,
                            street,
                            city,
                            pincode,
                            role: role,
                            cart: { items: [] }
                        })


                        newUser.save()
                            .then(() => {
                                return res.status(200).json({ "msg": "User is registered successfully!", "status": true });
                            })
                            .catch(err => {
                                console.log(err)
                                return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Error in Saving User", "status": false });
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(400).json({"error": "INTERNAL_SERVER", "msg": err, "status": false });
                    })

            })
            .catch(err => {
                console.log(err);
                return res.status(400).json({ "msg": err, "status": false })
            })

    });





}

exports.Signin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }


    const { email, password } = req.body;
    let user;
    var userDetails = {};

    const re = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])+"
    );

    if (re.test(email)) {
        user = await User.findOne({ email });
    } else {
        user = await User.findOne({ phone: +email });
    }

    if (!user) {
        return res.status(401).json({ "error": "INVALID_USER", "msg": "User not found!", 'status' : false })
    }

    user.comparePassword(password, async (err, isMatch) => {
        if (err) {
            return res.status(400).json({"error":"INTERNAL_SERVER", "msg": err, status: false })
        }

        if (!isMatch) {
            return res.status(400).json({ "error": "INVALID_PASSWORD", "msg": "User Password Do Not Matched!", "status": false })
        }

        let tokenDetails = await createToken(user);

        let accessToken = tokenDetails.token;
        let refreshToken = tokenDetails.refreshToken
        user.refreshToken  = refreshToken;
        user.save();

        return res.status(200).json({ "msg": "User loggedin successfully!", "user": user,  accessToken,  refreshToken , "status": true })

    })


    
}


exports.resetPasswordToken = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const { email } = req.body;
    let user;

    const re = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])+"
    );


    if (re.test(email)) {
        user = await User.findOne({ email });
    } else {
        user = await User.findOne({ phone: +email });
    }

    if (!user) {
        return res.status(401).json({ "error": "INVALID_USER", "msg": "User not found!", 'status' : false })
    }

    
    mailer(user._id)
        .then(() => {
            return res.status(200).json({ "msg": "Token sent to gmail successfully!", 'id': user._id, "status": true })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({"error": 'INTERNAL_SERVER',  "msg": "Internal Server error" ,  "status": false });
        })
}


exports.resetPassword = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {userId, password , code } = req.body;

    const user = await User.findOne({_id: userId, resetToken: code, resetTokenExpiration: { $gt: Date.now() }});

    const newPassword = await bcrypt.hash(password, 12);

    if(!user) {
        return res.status(400).json({ 'error': 'TOKEN_EXPIRES', "msg": "Token Expired please try again!", "status": false });
    }

    user.password = newPassword;
    user.save()
        .then(() => {
            return res.status(200).json({ "msg": "Password Reset successfully!", "status": true });
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({ "error": 'INTERNAL_SERVER', "msg": 'INTERNAL_SERVER', "status": false });
        });

}


exports.refreshToken = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id, refreshToken} = req.body;

    const user = await User.findOne({_id: id, refreshToken})
    
    if( !user) {
        return res.status(400).json({ 'error': 'TOKEN_ERROR', "msg": "Unfortunately we dont found user with this refresh token", "status": false });    
    }

    jwt.verify(refreshToken, config.jwt_secret_key, async (err, response) => {
        
        if(err) return res.status(400).json({ "msg": err, "status": false });    
        
        const accessToken = await generateAccessToken(user);
        const refreshToken = user.refreshToken;

        return res.status(200).json({ "msg": "User loggedin successfully!", "user": user,  accessToken,  refreshToken , "status": true })

    })
}
