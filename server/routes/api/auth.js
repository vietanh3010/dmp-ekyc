const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const jwt = require('../../expressMiddleware/jwt');
const requiredAuthorization = require('../../expressMiddleware/requireAuthorization');
const User = require('../../models/User');
const validateRegisterInput = require('../../validation/register');
const validateEmailInput = require('../../validation/email');
const validateLoginInput = require('../../validation/login');
const isEmpty = require('../../validation/is-empty');
const bcrypt = require('bcryptjs');
const email = require('../../expressMiddleware/email');
const url = require('url');
const baseUrl = "http://localhost:5000";
//https://hackernoon.com/m-e-r-n-stack-application-using-passport-for-authentication-920b1140a134

// Normal routes
// HOME PAGE (will also have our login links)
router.get('/', (req, res) => {
    //TODO: show homepage -index.html
});

// LOGOUT ---------------------------
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// PROFILE SECTION ---------------------
router.get('/profile', requiredAuthorization, (req, res) => {
    // TODO  render user profile from req.user
});


// Verify Email
// https://stackoverflow.com/questions/39092822/how-to-do-confirm-email-address-with-express-node

// @route POST auth/login {email, password}
// @desc  Login user  Returning JWT token
// @access Public

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if (!isValid) {
        const errorMessage = (errors.email.toString() + ' ' + errors.password.toString()).trim();
        return res.status(400).json({msg: errorMessage});
    }

    User.findOne({'local.email': req.body.email}, (err, user) => {
        if (err) return res.status(500).send({msg: 'Error on server, please try to log in later'});
        if (isEmpty(user)) return res.status(404).send({msg: 'Email or password is incorrect'});
        if (!user.email_activated) return res.status(422).send({msg: 'Hãy liên hệ với admin để active tài khoản của bạn'});

        //Check password
        bcrypt.compare(req.body.password, user.local.password)
            .then(isValid => {
                if (!isValid) {
                    res.status(401).send({msg: 'Email or password is incorrect'});
                } else {
                    const token = jwt.sign({id: user._id, email: user.local.email, role: user.roles});
                    res.status(200).send({'access_token': token});
                }
            })
            .catch((err) => {
                res.status(401).send({msg: err.toLocaleString()});
            })
    })
});


router.get('/verify', (req, res) => {
    //Check if domain is matched. Information is from authentic email
    if (baseUrl === (req.protocol + "://" + req.get('host'))) {
        console.log("Domain is matched. Information is from Authentic email");
        const query = url.parse(req.url, true).query;
        if (isEmpty(query) || isEmpty(query.email) || isEmpty(query.rand)) {
            res.end("<h1> Invalid request </h1>");
        }
        User.findOne({'local.email': query.email}).then((user) => {
            if (!isEmpty(user)) {
                if (user.email_activated || isEmpty(user.rand)) {
                    res.status(200).send({msg: 'Your account has already confirmed. Please log in'});
                }
                // User not activated yet email_activated =false  && user.rand
                if (user.rand === req.query.rand) {
                    user.email_activated = true;
                    user.save();
                    res.status(200).send({msg: 'Successfully activate your account'});
                } else {
                    res.end("<h1> Invalid request </h1>");
                }
            } else {
                res.status(400).send({msg: 'Your email is not found, please register'})
            }
        }).catch((err) => {
            res.status(500).send({msg: 'Server error'});
        });

    } else {
        res.end("<h1>Request is from unknown source </h1>");
    }
});

// /auth/reset-password?token=...  temporary token just valid for 30min
router.get('/reset-password', (req, res) => {

});

router.post('/forgotpassword', (req, res) => {
    const {errors, isValid} = validateEmailInput(req.body);
    //Check validation
    if (!isValid) {
        res.status(400).json(errors);
    }
    // Generate an email with valid token to change password
});

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    //Check validation
    if (!isValid) {
        const errorMessage = (errors.name.toString + ' ' + errors.email.toString() + ' ' + errors.password.toString() + ' ' + errors.confirmed_password.toString()).trim();
        res.status(400).json({msg: errorMessage});
    }

    User.findOne({
        $or: [
            {'local.email': req.body.email},
            {'facebook.email': req.body.email},
            {'google.email': req.body.email}
        ]
    }).exec((err, user) => {
        if (user) {
            errors.email = 'Email already exists';
            return res.status(400).json({msg: 'Email already exists'});
        } //user already exists with email AND/OR phone.
        else {
            const newUser = new User({
                'local.name': req.body.name,
                'local.email': req.body.email,
                'local.password': req.body.password,
                email_activated: false,
                rand: randomFixedInteger(12),
            });

            bcrypt.hash(newUser.local.password, 8, function (err, hash) {
                if (hash) {
                    newUser.local.password = hash;
                    newUser.save().then((user) => {
                        req.user = user;
                        // email.sendVerifyEmail(req, res);
                        res.status(200).json({msg: `Welcome ${req.body.name}! Đăng ký thành công! Hãy liên hệ với admin để active tài khoản của bạn!`});
                    }).catch((err) => {
                        res.status(500).json({msg: "Server error, sorry for your inconvenience"});
                    })
                } else {
                    res.status(500).json({msg: "Server error, sorry for your inconvenience"});
                }
            });
        }

    });
});


router.get('/refresh', (req, res) => {
    const token = req.headers['authorization'];
    jwt.verify(token, (err, result) => {

    });


});

// facebook -------------------
// @route GET /auth/facebook
// @desc  User login via facebook account
//      failure: redirect /signup page
//      success: return a JWT token for stateless authentication for next request
// @access Public
//send to facebook to do the authentication
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

// handle the callback after facebook has authenticated the user
//@route auth/facebook/callback
router.get('/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/#/login', session: false}),
    function (req, res) {
        const token = jwt.sign({id: req.user._id});
        res.redirect("http://localhost:3000/#/saveToken?token=" + token);
    });

//http://www.passportjs.org/packages/passport-google-oauth20/
// @route GET /auth/google
// @desc  User login via google account
//      failure: redirect /signup page
//      success: return a JWT token for stateless authentication for next request
// @access Public
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// This is where users point their browsers to get logged in
// This is also where Google send back information to our app once a user authenticate with user
// @Route: /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/signup', session: false}),
    (req, res) => {
        const token = jwt.sign({id: req.user._id});
        res.redirect("http://localhost:3000/#/saveToken?token=" + token);
    });

//https://github.com/Tetsuya3850/React-Express-Examples/blob/master/auth/server/authController.js
//http://gregtrowbridge.com/node-authentication-with-google-oauth-part1-sessions/
const randomFixedInteger = (length) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
};

module.exports = router;
