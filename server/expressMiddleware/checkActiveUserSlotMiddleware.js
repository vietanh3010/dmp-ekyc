const configKeys = require('../config/keys');
const User = require('../models/User');
const isEmpty = require('../validation/is-empty');


var checkActiveUserSlotMiddleware = function (request, response, next) {
    if (isSkipCheckActiveSlot(request)) return next();

    let loginUserId = request.userId;
    let query = { $or : [{$and:[{created_by:loginUserId},{is_deleted:false},{is_active:true}]}, { _id: loginUserId}]};
    let usersProjection = {
        "_id": 1,
        "class":1
    };

    User.find(query, usersProjection, (err, users)=> {
        if (err) response.status(500).json({msg: "Server error"});
        if (isEmpty(users)) response.status(405).json({msg: "Invalid action"});
        if (users) { //include:login superuser and his active users
            let numberOfActiveUser = new Number(users.length-1);
            let configNumber = new Number(getConfigActiveUserNumber(users, loginUserId));
            if (parseInt(numberOfActiveUser) < parseInt(configNumber)){
                return next()
            }
            const errorMessage = "You can not " + request.action +" " + request.resource +". Please contact admin if you need more active users";
            console.log(errorMessage);
            response.status(405).json({msg:errorMessage});
        }
    });
};


function isSkipCheckActiveSlot(request) {
    if (request.action === "activate" && request.resource === "users") return false;
    if (request.action === "create" && request.resource === "users") return false;
    return true;
}

function getConfigActiveUserNumber(users, loginUserId) {
    let userclass = '';

    users.forEach((user) =>{
        if (user._id == loginUserId) {
            userclass = user.class;
        }
    });

    if (userclass === "normal") return configKeys.normal_active_user_number;
    if (userclass === "vip") return configKeys.vip_active_user_number;
    if (isEmpty(userclass)) return -1;

}

module.exports = checkActiveUserSlotMiddleware;









