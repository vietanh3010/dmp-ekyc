const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEmail(email) {
    //isEmpty is own function to check for null, undefined, empty object
    // due to Validate validate based on string so we need this extra step.
    email = !isEmpty(email) ? email : '';
    if (isEmpty (email)) return " Email is required.";
    if (!Validator.isEmail(email)) return  " Email is invalid.";
    return '';
};






