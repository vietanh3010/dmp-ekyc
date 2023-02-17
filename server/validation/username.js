const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateUserName(username) {
    //isEmpty is own function to check for null, undefined, empty object
    // due to Validate validate based on string so we need this extra step.
    username = !isEmpty(username) ? username : '';
    if (Validator.isEmpty(username)) return ' User name field is required.';
    if (!Validator.isLength(username, { min: 2, max: 30 })) return  ' User name must be between 2 and 30 characters.';
    return '';
};







