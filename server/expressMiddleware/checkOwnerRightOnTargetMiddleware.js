const isEmpty = require ('../validation/is-empty');
const User = require('../models/User');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

var checkOwnerRightOnTargetMiddleware = function (request, response, next) {
    if (!ObjectId.isValid(request.params.id))return response.status(400).json({msg: 'Data not found'});
    if (request.resource !== "users" && request.resource !=="superusers") return next();

    // User.findOne call async
    User.findOne({"_id": new ObjectId(request.params.id)})
        .then(user => {
            if (isEmpty(user)) return response.status(405).json({msg: "Invalid action, user does not exist"});
            request.user = user;
            if (request.user.created_by === request.userId) return next();
            response.status(405).json({msg: "Invalid action, you dont have owner right to take this action"});

        }).catch(err => {
            response.status(500).json({msg: "Server error"});
        });

};
module.exports = checkOwnerRightOnTargetMiddleware;
