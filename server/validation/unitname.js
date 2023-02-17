const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateUnitName(unitname) {
    //isEmpty is own function to check for null, undefined, empty object
    // due to Validate validate based on string so we need this extra step.
    unitname = !isEmpty(unitname) ? unitname : '';
    if (isEmpty(unitname)) return ' Unit name is required.';
    if (!Validator.isLength(unitname, { min: 2, max: 30 }))  return ' Unit name must be between 2 and 30 characters.';
    return '';
};







