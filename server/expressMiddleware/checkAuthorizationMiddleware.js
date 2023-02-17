const isEmpty = require('../validation/is-empty');
const jwt = require('./jwt');
// const redis = require('./redis');
const url = require('url');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;


var checkAuthorizationMiddleware = async function (request, response, next) {
    const token = request.headers['authorization'];
    if (isEmpty(token)) return response.status(401).send({auth:false, msg:'No token provided, you should log in first'});

    const decoded = jwt.decode(token);
    if (isEmpty(decoded)) return response.status(404).json({msg:'Token is invalid,you should log in first'});

    request.userId = decoded.payload.id;
    if (!ObjectId.isValid(request.userId)) return response(405).json({msg:'Userid is invalid'});

    hasPermission(request).then(result => {
        if (result) {
            request.action = getAction(request);
            request.resource = getResource(request);
            return next(); // go to next middleware
        }
        response.status(401).send({msg: "Unauthorized"});
    }).catch((err) =>{
        response.status(500).send({msg:'Server error'});
    });
}


async function hasPermission(req) {
    // const operation = getOperation(req);
    // console.log(operation);
    // if(isEmpty(operation)) return false;
    //
    // const roles = await redis.getFromCache("roles", req.userId);
    // if (isEmpty(roles)) return false;
    //
    // const userRoles = roles.toString().split(";");
    // let finalArray = [];
    // userRoles.forEach((value) =>{
    //     finalArray.push(redis.getFromCache("permissions",value));
    // });
    //
    // let final =[];
    // const resolvedFinalArray = await Promise.all(finalArray);
    // for (let i = 0; i < resolvedFinalArray.length; i++ ) {
    //     if (!isEmpty(resolvedFinalArray[i])){
    //         resolvedFinalArray[i].split(";").forEach(value => final.push(value));
    //     }
    // }
    // const permissions = new Set(final);
    // return permissions.has(operation);
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
    if (req.method === "PUT" && req.url === "/") return "change";
    if (req.method === "PUT")  return "update";
    if (req.method === "DELETE") return "delete";
    return "undefined";
}

function getResource(req) {
    let index = -1;
    let resource = "";

    if (req.url ==="/") {
        parts = req.originalUrl.trim().split("/");
        const i = parts.length - 1;
        resource = parts[i];

    } else {
        const url_parts= req.originalUrl.trim().split(req.url);
        console.log(req.url);
        console.log(req.originalUrl);
        console.log(url_parts[0]);
        if(!isEmpty(url_parts[0])) {
            const resource_parts = url_parts[0].trim().split("/");
            index = resource_parts.length - 1;
            resource = resource_parts[index];
        }
    }

    return resource.trim().toLowerCase();

}
module.exports = checkAuthorizationMiddleware;






