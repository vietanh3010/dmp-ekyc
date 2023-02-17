const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const configAuth = require('./auth');
const User = require('../models/User');


// This module use for generate token for next request
    // passport session setup - required for persistent login
    // passport needs ability to serialize and deserialize users out of session
    // session: true (default)

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGN UP -------------------------
    // using named strategies since we have one for login and one for sign-up
//https://scotch.io/tutorials/easy-node-authentication-setup-and-local

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
        // asynchronous
        process.nextTick(function(){
            User.findOne({'local.email' :  email}, function (err, done) {
                if (err) {
                    return done(err)
                }
                if (user){
                    // User already exist with that email
                    return done(null, false, )
                } else {
                    // email not registered yet, create new user
                        const newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.is_active = false;
                        newUser.save().then((user) =>{
                            return done(null, user);
                        });
                }
            });
        });
    }));





    // FACEBOOK -------------------------------------------------

    passport.use( new FacebookStrategy({
            clientID: configAuth.facebook.clientID,
            clientSecret:  configAuth.facebook.clientSecret,
            callbackURL:  configAuth.facebook.callbackURL,
            profileFields: ["id", "emails", "name"],
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        // verify function required by passport
        // Due to passReqToCallback = true we have five parameters
    function(req, token, refreshToken, profile, done) {
        //asynchronous
        process.nextTick(function(){
            const query = {'facebook.id': profile.id};
            const update = {
                $set: {
                    'facebook.id': profile.id,
                    'facebook.name': profile.name.familyName + " " + profile.name.givenName,
                    'facebook.email': profile.emails[0].value,
                    'facebook.token' : token
                }
            };
            const options = {setDefaultsOnInsert: true, new: true, upsert: true};
            User.findOneAndUpdate(query, update, options, (err, user) => {
                return done(err, user);
            });
        });
    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
            clientID        : configAuth.google.clientID,
            clientSecret    : configAuth.google.clientSecret,
            callbackURL     : configAuth.google.callbackURL,
            scope:['email'],
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function() {
                const query = {'google.id': profile.id};
                const update = {
                    $set: {
                        'google.id ': profile.id,
                        'google.name': profile.displayName,
                        'google.email': profile.emails[0].value,
                        'google.token' : token
                    }
                };
                const options = {setDefaultsOnInsert: true, new: true, upsert: true};
                User.findOneAndUpdate(query, update, options, (err, user) => {
                    return done(err, user);
                });
            });
        }));

    //verify is a function with the parameters verify(jwt_payload, done)
    // jwt_payload is an object literal containing the decoded JWT payload.
    // done is a passport error first callback accepting arguments done(error, user, info)
    // If use JWT for stateless: set session: false
// https://github.com/themikenicholson/passport-jwt
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = configAuth.jwtTokenSecret;

    passport.use(new JwtStrategy(
        opts,
        function (jwt_payload, done ){
            let user = new User({
                name: jwt_payload.name
            });
            return done(null, user);
        }
    ));
module.exports = passport;


