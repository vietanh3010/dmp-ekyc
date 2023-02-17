const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validatePhoneNumber(phone) {
    //isEmpty is own function to check for null, undefined, empty object
    // due to Validate validate based on string so we need this extra step.
    phone = !isEmpty(phone) ? phone : '';
    if(isEmpty(phone)) return ' Phone is required.';

    // check phone format
    const pattern = /^[0,84][1-9][0-9]{8}$/;
    const result = phone.match(pattern);
    if (!result) return ' Phone number is invalid.';

    // valid
    return '';
};


















