//http://jasonwatmore.com/post/2018/09/24/nodejs-basic-authentication-tutorial-with-example-api
// https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
// https://stackoverflow.com/questions/46108249/promises-vs-async-with-jsonwebtokens

// jwt default is HMAC- SHA256: symmetric primitive
// Choose to use: RSA-SHA245: asymmetric primitive instead.
// only use synchronous operations on startup phase only
// Rule1. Never mix sync and async in functions.

'use strict';
const util = require('util');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const privatePath = path.join(__dirname, '..', 'config','private.key');
const publicPath = path.join(__dirname, '..', 'config','public.key');
const PRIVATE_KEY  = fs.readFileSync(privatePath, 'utf8');
const PUBLIC_KEY  = fs.readFileSync(publicPath, 'utf8');
// Another solution
// 1. Use passport: authentication engine
// 2. Passport JWT: authentication strategy for Passport
// 3. JWT simple: used as encoder and decoder JSON token
const signOptions = {
    expiresIn: '1d',
    algorithm: 'RS256'
};
const verifyOptions = {
    expiresIn: '1d',
    algorithm: ['RS256']
};

module.exports ={
    sign: function (payload) {
        return jwt.sign(payload, PRIVATE_KEY, signOptions );
    },
    verify: function(token) {
        try {
            return jwt.verify(token, PUBLIC_KEY, verifyOptions);
        } catch (e) {
            return false;
        }
    },
    decode: function(token) {
        return jwt.decode(token,{complete:true});
        //return null if token is invalid
    }
};






