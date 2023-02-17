const isEmpty = require('../validation/is-empty');
const User = require('../models/User');

var checkUsernameExistMiddleware = function(request, response, next){
    let username =request.body.username;
    console.log(username);
    if (isEmpty(username)) return response.status(400).json({msg:"Username is invalid"});
    User.findOne({'local.username': username.toLowerCase()},(err, user) => {
        if (err) return response.status(500).json({msg: 'Server error'});
        if (user) return response.status(400).json({msg: 'User name already exist, username is case-insensitve, please choose another one'});
        return next();
    });
}
module.exports = checkUsernameExistMiddleware;








