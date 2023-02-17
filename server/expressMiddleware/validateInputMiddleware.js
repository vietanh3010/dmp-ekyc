// Have two level of middleware
// Types are classified by
//  --- its general level
//  --- need params or not
//  --- whether or not need to check permissions

// Type one: very general - before the Express mapping route and handler happens
// Type two: need to apply after the Express mapping route and handler happens
// @Reason: due to need to access query.params.id

//@Type : middleware level one
const url = require('url');
const isEmpty = require('../validation/is-empty');
const validateEmail = require('../validation/email');
const validatePassword = require('../validation/password');
const validatePhone = require('../validation/phone');
const validateUserName = require('../validation/username');
const validateUnitName = require('../validation/unitname');
const validateClass = require('../validation/userclass');

var validateInputMiddleware = function(request, response, next) {
    if (!isInputValidationNeeded(request)) return next();
    const errorMessage = getValidationMessage(request);
    if (isEmpty(errorMessage)) return next();
    response.status(400).json({msg: errorMessage.trim()});
}



function isInputValidationNeeded (request) {
    const query = url.parse(request.url, true).query;
    if (request.method === "PUT") return true;
    if (request.method === "POST") return true;
    if (request.method === "PATCH" && !isEmpty(query)  && query.act === "reset") return true;
    return false;
}

function getValidationMessage (request) {
    if (request.resource === "profiles") return validateProfiles(request.body);
    if (request.resource === "users") return validateUser(request.body);
    if (request.resource === "superusers") return validateSuperUser(request.body);
    if (request.resource === "passwords") return validatePasswordResource(request);
}

function validateProfiles(data) {
    let errorMessage = '';
    errorMessage += validateEmail(data.email);
    errorMessage += validatePhone(data.phone);
    return errorMessage.trim();
}

function validateUser(data) {
    let errorMessage = '';
    errorMessage += validateEmail(data.email);
    errorMessage += validateUserName(data.username);
    errorMessage += validatePhone(data.phone);
    errorMessage += validatePassword(data.password);
    errorMessage += validateUnitName(data.unit);
    return errorMessage.trim();
}


function validateSuperUser(data) {
    let errorMessage = '';
    errorMessage += validateEmail(data.email);
    errorMessage += validateUserName(data.username);
    errorMessage += validatePhone(data.phone);
    errorMessage += validatePassword(data.password);
    errorMessage += validateClass(data.usertype);
    return errorMessage.trim();
}

function validatePasswordResource(request) {
    let errorMessage = '';
    errorMessage += validatePassword(request.body.password);
    if (request.action === "change"
        && !isEmpty(validatePassword(request.body.oldPassword))) {
        errorMessage += " Old password is invalid.";
    }
    return errorMessage.trim();
}

module.exports = validateInputMiddleware;

