const JwtStrategy = require("passport").Strategy;
const ExtractJwt = require("passport").ExtractJwt;

const Client = require('../models/user.model.js');

const keys = "secret";
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys
module.exports = clientPassport => {
  clientPassport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        Client.findById(jwt_payload.id)
        .then(client => {
          if (client) {
            return done(null, client);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};