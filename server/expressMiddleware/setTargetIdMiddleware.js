// Target: system resources (users, superusers,profiles, passwords, projects, keywords)
const isEmpty = require('../validation/is-empty');

var setTargetIdMiddleware = function (request, response, next) {
    if (isEmpty(request.params.id)) return next();
    request.targetId = request.params.id;
    return next();
};
module.exports = setTargetIdMiddleware;





