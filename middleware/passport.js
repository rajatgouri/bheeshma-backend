const User = require('../models/user');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '123456'
}

module.exports = new jwtStrategy(opts, function(jwt_payload, done) {

    User.findById(jwt_payload.id)
        .then(user => {
            if(!user) {
                return done(null, false);
            }

            return done(null, user);
        })
        .catch(err => {
            return done(err, false);
        })
})