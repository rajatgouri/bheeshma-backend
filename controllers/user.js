const User = require('../models/user');
const { validationResult } = require('express-validator');
const emailExistence = require('email-existence');


exports.getUser = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }

    const {id} = req.body;

    User
        .findById(id)
        .then((user) => {
            if(!user) {
                return res.status(401).json({ "error": "INVALID_USER", "msg": "User not found!", 'status' : false })
            }


            return res.status(200).json({'msg': 'user Details', 'user': user})
        }).catch(err => {
            return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Internal Server eror in fetching user", "status": false })

        })
}


exports.updateUser = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        error.status = false;
        error.param = undefined;
        error.location = undefined;
        return res.send(error);
    }
    
    const {user} = req.body;
    // console.log(user)

    emailExistence.check(user.email, function (err, response) {
        if (err) return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Error in Validate Email", "status": false })
        if (response === false) {
            return res.status(400).json({"error": "INVALID_EMAIL", "msg": "Please enter a valid Email address", "status": false })
        }


        let userId = req.user._id

        User
            .findByIdAndUpdate(userId, user)
            .then((user) => {
                return res.status(200).json({'msg': 'user Updated Successfully', 'user': user})
            })
            .catch(err => {
                return res.status(400).json({"error": "INTERNAL_SERVER", "msg": "Internal Server eror in Updating user", "status": false })
            })
            

    })
}