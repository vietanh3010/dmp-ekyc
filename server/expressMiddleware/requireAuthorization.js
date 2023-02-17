const isEmpty = require('../validation/is-empty');
const jwt = require('./jwt');
// const redis = require('./redis');
const url = require('url');


requireAuthorization = async function(req, res, next) {
    //verify valid token first
    //https://stackoverflow.com/questions/13147693/how-to-extract-request-http-headers-from-a-request-using-nodejs-connect
    // const token = req.headers['x-access-token'];\
    const token = req.headers['authorization'];
    if (isEmpty(token)){
        return res.status(401).send({auth:false, msg:'No token provided'});
        //res.send(boom.unauthorized('No token provided'));
    } else {
        decoded = jwt.verify(token);
        if(!isEmpty(decoded.id)) {
            req.userId = decoded.id;
            hasPermission(req).then(result => {
                if (result) {
                    next();
                } else {
                    res.status(401).send({msg: "Unauthorized"});
                    //boom.unauthorized('Unauthorized');
                }
            }).catch((err) =>{
                res.status(401).send({msg:'Unauthorized test'});
            })
        } else {
            res.status(401).send({msg:'Unauthorized test'});
        }
    }
};

async function hasPermission(req) {
      // const operation = getOperation(req);
      // const roles = await redis.getFromCache("roles", req.userId);
      //
      //
      // if (isEmpty(roles)) return false;
      // const userRoles = roles.toString().split(";");
      //
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


 function getAction(req) {
     const query = url.parse(req.url, true).query;
     if(!isEmpty(query)) {
         return "search";
     }

     if(req.params.id && req.method === "GET"){
         return "view";
     }
     if ((!req.params.id) && (req.method ==="GET")){
         return "list";
     }
     if (req.method ==="POST") {
         return "create";
     }
     if(req.method ==="PUT") {
         return "update";
     }
     if(req.method === "DELETE") {
         return "delete";
     }
 }

 function getResource(req) {
     const urlParts = req.path.toString().split("/");
     let index = -1;
     if (req.params.id) {
         index = urlParts.length -2;
     } else {
         index = urlParts.length - 1;
     }
     if (index < 0) {
         return "";
     } else {
         return urlParts[index].trim().toLowerCase();
     }
 }
 function getOperation (req) {
    return getAction(req) + ":" + getResource(req);
 }


 module.exports = requireAuthorization;








