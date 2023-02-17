const isEmpty = require('../validation/is-empty');
const User = require('../models/User');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

var findUserByUserIdMiddleware = function(request, response, next){
    let targetedUserId = '';
    let isUpdatedByByOther = false;

    if(request.params.id) {  // delete, activate, deactivate
        targetedUserId = request.params.id;
        isUpdatedByByOther = true;

    } else {
        // users update their info themselves
        if ((request.method ==="PUT") && (request.url ==="/")) {
            isUpdatedByByOther = false;
            targetedUserId = request.userId; // get from the previous middleware
        }
    }


    if (isEmpty(targetedUserId)) return next();

    console.log(targetedUserId);

    if (!ObjectId.isValid(targetedUserId))return response.status(400).json({msg: 'Data not found'});
    User.findOne({"_id": new ObjectId(targetedUserId)}).exec((err, user)=> {
        if (err) return response.status(500).json({msg: "Server error"});
        if (isEmpty(user)) return response.status(405).json({msg: "Invalid action, user does not exist"});
        if (isUpdatedByByOther && user.created_by !== request.userId) {
            return response.status(405).json({msg: "Invalid action"});
        }
        request.user = user;
        return next();
    });
}







module.exports = findUserByUserIdMiddleware;

