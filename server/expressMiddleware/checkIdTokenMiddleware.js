const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;
const jwt = require('jsonwebtoken');
const isEmpty = require('../validation/is-empty');
const User = require('../models/User');

//@Type: middleware level one
var checkIdTokenMiddleware = async function (request, response, next) {
    //const token = request.headers['authorization'];
    //console.log(token);
    const id_token = request.headers['authorization'];
    console.log(id_token);
    if (isEmpty(id_token)) return response.status(401).send({auth:false, msg:'No token provided, you should log in first'});
    const id_token_decoded = jwt.decode(id_token);
    console.log(id_token_decoded);
    if (isEmpty(id_token_decoded)) return response.status(405).json({msg: "Authorization required,you don't have right to access, please check with your admin "});
    const email = id_token_decoded.email;

      // User.findOne call async
    User.findOne({"local.email": email.toLowerCase()})
        .then(user => {
            if (isEmpty(user)) return response.status(405).json({msg: "Authorization required,you don't have right to access, please check with your admin "});
            request.user = user;
            return next();

            //if (request.user.created_by === request.userId) return next();
            //response.status(405).json({msg: "Invalid action, you dont have owner right to take this action"});

        }).catch(err => {
            response.status(500).json({msg: "Server error"});
        });
}


module.exports = checkIdTokenMiddleware;
