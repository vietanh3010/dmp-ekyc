const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePassword(password) {
    //isEmpty is own function to check for null, undefined, empty object
    // due to Validate validate based on string so we need this extra step.
    password = !isEmpty(password) ? password : '';
    if (isEmpty(password))  return ' Password is required.';
    if (!Validator.isLength(password, { min: 6, max: 30 })) return  ' Password must be at least 6 characters.';
    return '';
};







