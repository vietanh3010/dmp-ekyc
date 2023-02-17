const express = require('express');
const router = express.Router();
const isEmpty = require('../../validation/is-empty');
const User = require('../../models/User');
// const Project = require('../../models/Project');
const passwordUtil = require('../../expressMiddleware/hash');
const NORMAL_USER_ROLE_ID = "100";
const checkActiveUserSlot = require('../../expressMiddleware/checkActiveUserSlotMiddleware');
const checkUsernameExist = require('../../expressMiddleware/checkUsernameExist');
const checkOwnerRightOnTarget = require('../../expressMiddleware/checkOwnerRightOnTargetMiddleware');
const checkValidObjectId = require('../../expressMiddleware/checkValidObjectIdMiddleware');
const cus_name_collection = require('../../config/keys').cus_name_collection;


// view a normal user and its projects
// @Routes GET /api/users/:id
// @Permission: view:users
// @Access: private

router.get('/:id', checkValidObjectId, (request, response) => {
    // let query = {$and: [{"_id": request.params.id}, {is_deleted: false}]};
    // let usersProjection = {
    //     "_id": 1,
    //     "local.username": 1,
    //     "local.email": 1,
    //     "local.phone": 1,
    //     "local.unit_name": 1,
    //     "is_active": 1
    // };
    // User.findOne(query, usersProjection, function (err, user) {
    //     if (err) return next(err);
    //     Project.find({user_id: user._id}, function (error, products) {
    //         if (error) return next(error);
    //         console.log({user, projects: products})
    //         return response.status(200).json({user, projects: products});
    //     });
    // });
});


// view a normal user
// @Routes GET /api/users/:id
// @Permission: view:users
// @Access: private
/*
router.get('/:id',checkValidObjectId, (request, response)=>{
    let query ={$and:[{"_id": request.params.id},{is_deleted:false}]};
    let usersProjection = {
        "_id": 1,
        "local.username": 1,
        "local.email":1,
        "local.phone":1,
        "local.unit_name": 1,
        "is_active":1,
    };

    User.findOne(query, usersProjection, function(err,user){
        if (err) return  response.status(500).json({msg:"server error"});
        return response.status(200).json(user);
    });
});
*/

// Create a normal user
// @Routes POST /api/users
// @Role: Super Users
// @Permission: create:users
// @Access: private

// router.post('/', checkActiveUserSlot, checkUsernameExist, (request, response) => {
//
//     const newUser = new User({
//         'local.username': request.body.username.toLowerCase(),
//         'local.email': request.body.email,
//         'local.password': request.body.password,
//         'local.phone': request.body.phone,
//         'local.unit_name': request.body.unit,
//         created_by: request.userId,  //get from the authorization middleware
//         roles: NORMAL_USER_ROLE_ID
//     });
//
//     passwordUtil.generateHash(request.body.password).then(hash => {
//         newUser.local.password = hash;
//         newUser.save().then((user) => {
//             response.status(200).json({msg: 'Successfully create new user'});
//         }).catch((err) => {
//             response.status(500).json({msg: "Server error, sorry for your inconvenience"});
//         });
//     }).catch(error => {
//         response.status(500).json({msg: "Server error, sorry for your inconvenience"});
//     });
//
// });


// List all users
// @route GET api/users
// @Permission: list:users
// @Extra requirement: only get all users that created by login user id
// @Access: private
router.get('/', (request, response) => {
    User.find({roles: {$ne: 1}}).sort({created: 'asc'}).exec(function (err, users) {
        if (err) return next(err);
        response.status(200).json(users);
    });
});

router.put('/:id', function (req, res, next) {
    console.log(req.user.roles);
    if (req.user.roles === '1') {
        User.findByIdAndUpdate({_id: req.params.id}, req.body, function (err) {
            if (err) throw next(err);
            res.json({message: "OK"});
        });
    }
});


// Delete a user
// @Route DELETE  /api/users/:id
// @Permission: delete:users
// @Extra requirement: only soft delete user that created by login user id
// @Access: private

// router.delete('/:id', checkOwnerRightOnTarget, (request, response) => {
//     request.user.is_deleted = true;
//     request.user.updated_by = request.userId;
//     request.user.save().then(result => {
//         response.status(204).json({msg: "Delete user successfully"});
//     }).catch(err => {
//         response.status(500).json({msg: "Server error, sorry for your inconvenience"});
//     });
// });

// Active/ Deactivate user
// @Routes PATCH api/users/:id?act=activate
// @Routes PATCH api/users/:id?act=deactivate
// @Permission: activate:users, deactivate:users
// @Access: private
// @Precondition: need to check active slot in case of activate users
// @Need:findUserByUserIdMiddleware: to check that login user can update on specific users

// router.patch('/:id', checkOwnerRightOnTarget, checkActiveUserSlot, (request, response) => {
//     if (isEmpty(getActiveState(request))) return response.status(405).json({msg: "Invalid action"});
//     const isActive = getActiveState(request);
//
//     let criteria = {_id: request.params.id};
//     let updatedFields = {
//         is_active: isActive,
//         updated_by: request.userId
//     };
//
//     User.update(criteria, {"$set": updatedFields}).then(result => {
//         const message = isActive ? "Activate successfully" : "Deactivate successfully";
//         response.status(200).json({msg: message});
//     }).catch(err => {
//         response.status(500).json({msg: "Server error, sorry for your inconvenience"});
//     });
//
// });

function getActiveState(request) {
    if (request.action === "deactivate") return false;
    if (request.action === "activate") return true;
}


module.exports = router;






