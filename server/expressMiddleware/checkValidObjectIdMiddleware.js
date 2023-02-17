const isEmpty = require('../validation/is-empty');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

var checkValidObjectIdMiddleware = function (request, response, next) {
    if (isEmpty(request.params.id)) return response.status(400).json({msg: 'Data not found'});
    if(!ObjectId.isValid(request.params.id)) return response.status(400).json({msg: 'Data not found'});
    return next();
};

module.exports = checkValidObjectIdMiddleware;
