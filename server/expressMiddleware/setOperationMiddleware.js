// Have two level of middleware
// Types are classified by
//  --- its general level
//  --- need params or not
//  --- whether or not need to check permissions

// Type one: very general - before the Express mapping route and handler happens
// Type two: need to apply after the Express mapping route and handler happens
// @Reason: due to need to access query.params.id

const isEmpty = require('../validation/is-empty');
const url = require('url');

//@Type middleware: level one
var setOperationMiddleware = function(request, response, next){
    request.action = getAction(request);
    request.resource = getResource(request);
    request.operation = getOperation(request);
    return next();
}

function getOperation (req) {
    return getAction(req) + ":" + getResource(req);}

function getAction(req) {
    const query = url.parse(req.url, true).query;
    // the order does matter - don't change until you have the reason to do so
    if (req.method === "GET" && req.url === "/") return "list";
    if (req.method === "GET") return "view";
    if (req.method === "PATCH" && !isEmpty(query) && query.act === "activate") return "activate";
    if (req.method === "PATCH" && !isEmpty(query) && query.act === "reset")  return "reset";
    if (req.method === "PATCH" && !isEmpty(query) && query.act === "deactivate")  return "deactivate";
    if (req.method === "POST") return "create";
    if (req.method === "PUT" && req.url === "/") return "change"; //change own info
    if (req.method === "PUT")  return "update";
    if (req.method === "DELETE") return "delete";
    return "undefined";
}

function getResource(req) {
    const path = (req.url === "/") ? req.originalUrl : req.originalUrl.trim().split(req.url)[0];
    if (isEmpty(path)) return "undefined";
    const parts =  path.trim().split("/");
    const index = parts.length - 1;
    return parts[index].trim().toLowerCase();
}

module.exports = setOperationMiddleware;


















