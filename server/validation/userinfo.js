const Validator = require('validator');
const isEmpty = require('./is-empty');
const validateEmail = require('./email');
const validatePhone = require('./phone');
const validatePassword = require('./password');
const validateUserName = require('./username');


module.exports = function validateUserInfo(data) {
    let errorMessage = '';
    errorMessage += validateUserName(data);
    errorMessage += validatePhone(data);
    errorMessage += validateEmail(data);
    errorMessage += validatePassword(data);
    return errorMessage;
};

