// Have two level of middleware
// Types are classified by
//  --- its general level
//  --- need params or not
//  --- whether or not need to check permissions

// Type one: very general - before the Express mapping route and handler happens
// Type two: need to apply after the Express mapping route and handler happens
// @Reason: due to need to access query.params.id

const isEmpty = require('../validation/is-empty');
const jwt = require('./jwt');
// const redis = require('./redis');
const url = require('url');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;


//@Type: middleware level one
var checkPermissionMiddleware = async function (request, response, next) {
    const token = request.headers['authorization'];
    if (isEmpty(token)) return response.status(401).send({auth:false, msg:'No token provided, you should log in first'});

    const decoded = jwt.decode(token);
    if (isEmpty(decoded)) return response.status(404).json({msg:'Token is invalid,you should log in first'});

    request.userId = decoded.payload.id;
    if (!ObjectId.isValid(request.userId)) return response(405).json({msg:'Userid is invalid'});

    hasPermission(request).then(result => {
        if (result) {
            console.log("has permission");
            return next(); // go to next middleware
        }

        response.status(401).send({msg: "Unauthorized"});

    }).catch( err =>{
        response.status(500).send({msg:'Server error'});
    });
}

async function hasPermission(req) {
    // let operation = req.operation;
    // if(isEmpty(operation)) return false;
    //
    // const roles = await redis.getFromCache("roles", req.userId);
    // if (isEmpty(roles)) return false;
    //
    // const userRoles = roles.toString().split(";");
    // let finalArray = [];
    // userRoles.forEach((value) =>{
    //     finalArray.push(redis.getFromCache("permissions",value));
    // });
    //
    // let final =[];
    // const resolvedFinalArray = await Promise.all(finalArray);
    // for (let i = 0; i < resolvedFinalArray.length; i++ ) {
    //     if (!isEmpty(resolvedFinalArray[i])){
    //         resolvedFinalArray[i].split(";").forEach(value => final.push(value));
    //     }
    // }
    // const permissions = new Set(final);
    // return permissions.has(operation);
}

module.exports = checkPermissionMiddleware;