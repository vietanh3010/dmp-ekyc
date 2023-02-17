// const redis = require('redis');
// const redisUrl =  require('../config/keys').redisUrl;
// const client = redis.createClient(redisUrl);
// const Role = require('../models/Role');
// const User = require('../models/User');
//
// function deleteRedisKey(redisKey) {
//     return new Promise((resolve, reject) => {
//         client.del(redisKey, (error, result) => {
//             if (error) return reject(error);
//             return resolve(result);
//         });
//     });
// }
//
// function deleteFromCache(key, field) {
//     return new Promise((resolve, reject) => {
//         client.hdel(key, field, (err, result) => {
//             if (err) return reject(err);
//             return resolve(result);
//         });
//     });
// }
//
// function saveToCache(key, field, value) {
//     return new Promise((resolve, reject) => {
//         client.hset(key, field, value, (err,result)=>{
//             if (err) return reject(err);
//             return resolve(result);
//         });
//     });
// }
//
// module.exports ={
//     getFromCache: function(key, field){
//         return new Promise((resolve, reject) => {
//             client.hget(key, field, (err,result)=>{
//                 if (err){
//                     return reject(err);
//                 }
//                 if (result !== null) return resolve(result);
//                 //result null - not found in cache, find in DB and put to cache
//
//                 if(key.toString().toLowerCase() === "permissions"){
//                     Role.getPermissions(field).then(permissions =>{
//                         saveToCache(key, field, permissions);
//                         return resolve(permissions);
//                     });
//                 }
//                 if(key.toString().toLowerCase() === "roles") {
//                     User.getRoles(field).then(roles =>{
//                         saveToCache(key, field, roles);
//                         return resolve(roles);
//                     });
//                 }
//             });
//         });
//     }
// };
//
//
// // export multiple functions
// // https://stackoverflow.com/questions/16631064/declare-multiple-module-exports-in-node-js
//
