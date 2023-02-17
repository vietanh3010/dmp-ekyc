var express = require('express');
var router = express.Router();
var UserSmartDoorManagement = require('../../models/UserSmartDoor');
const fetch = require('node-fetch');
var fs = require('fs');
var FormData = require('form-data');
const db = require('./../../config/dev');
const collectionName = require('./../../config/keys').facesearchCollection;
// var User = require('../../models/User');

router.get('/', function (req, res, next) {
    UserSmartDoorManagement.find({
        // $and: [
        //     {'user_id': req.user._id},
        // ]
    }).sort({updated_time: 'desc'}).exec((err, post) => {
        if (post) {
            // VideoTaggingManagement.findByIdAndUpdate({_id: post.id}, {
            //     is_processing: true,
            //     updated_date: Date.now()
            // }, function (err) {
            //     if (err) throw next(err);
            //     res.json(post);
            // });
            res.json(post);
        } else {
            res.json({});
        }

    });
});

router.get('/:id', function (req, res, next) {
    UserSmartDoorManagement.findOne({
        $and: [
            {'_id': req.params.id}
        ]
    }).exec((err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/', function (req, res, next) {
    UserSmartDoorManagement.findOne({id: req.body.id}, (err, data) => {
        // if(err) throw next(err);
        if (!data) {
            let data_create = new FormData();
            data_create.append('id', req.body.id);
            data_create.append('name', req.body.name);
            data_create.append('collection', collectionName);
            console.log(db.fsCreateURI);
            fetch(db.fsCreateURI, {
                method: 'POST',
                headers: {
                    // 'Authorization': `bearer ${token}`,
                    'api_key': db.fsApi_key,
                    // 'content-type': 'application/x-www-form-urlencoded'
                    // 'postman-token': '8ac67b85-83e6-7591-4d2b-b4afa03a4688'
                },
                body: data_create
            })
                .then(response => response.json())
                .then(resData => {
                    // console.log(456);
                    console.log(resData);
                    if (resData.code === '200') {
                        // console.log(456);
                        console.log(req.body.id)
                        console.log(req.body.filename)
                        console.log(db.fsAddURI)
                        let data_add = new FormData();
                        data_add.append('id', req.body.id);
                        data_add.append('name', req.body.name);
                        data_add.append('collection', collectionName);
                        data_add.append('file', fs.createReadStream("./public/" + req.body.filename));
                        // console.log(data_add)
                        fetch(db.fsAddURI, {
                            method: 'POST',
                            headers: {
                                // 'Authorization': `bearer ${token}`,
                                'api_key': db.fsApi_key,
                                // 'postman-token': '8ac67b85-83e6-7591-4d2b-b4afa03a4688'
                            },
                            body: data_add
                        })
                            .then(response => response.json())
                            .then(resDataAdd => {
                                // console.log(678);
                                console.log(resDataAdd);
                                if (resDataAdd.code === '200') {
                                    UserSmartDoorManagement.create(req.body, function (err, post) {
                                        if (err) throw next(err);
                                        res.json({message: "OK", data: post});
                                    });
                                } else {
                                    res.json({message: resDataAdd.data});
                                }
                            })
                            .catch((error) => {
                                res.json({message: error});
                            });

                    } else {
                        res.json({message: resData.data});
                    }
                })
                .catch((error) => {
                    res.json({message: error});
                });

        } else {
            res.json({message: "BAD", data: []});
        }
    })
});

router.put('/:id', function (req, res, next) {
    console.log(req.body);
    var file_name = "";
    if (!req.body.filename) {
        file_name = req.body.image_link.split('/public/')[1];
        console.log(file_name);
    } else {
        file_name = req.body.filename;
    }

    console.log(req.params.id);
    let data_delete = new FormData();
    data_delete.append('id', req.params.id);
    data_delete.append('collection', collectionName);
    fetch(db.fsDeleteURI, {
        method: 'DELETE',
        headers: {
            // 'Authorization': `bearer ${token}`,
            'api_key': db.fsApi_key,
            // 'content-type': 'application/x-www-form-urlencoded'
            // 'postman-token': '8ac67b85-83e6-7591-4d2b-b4afa03a4688'
        },
        body: data_delete
    })
        .then(response => response.json())
        .then(resData => {
            // console.log(456);
            console.log(resData);
            if (resData.code === '200') {
                let data_create = new FormData();
                data_create.append('id', req.body.id);
                data_create.append('name', req.body.name);
                data_create.append('collection', collectionName);
                console.log(db.fsCreateURI);
                fetch(db.fsCreateURI, {
                    method: 'POST',
                    headers: {
                        // 'Authorization': `bearer ${token}`,
                        'api_key': db.fsApi_key,
                        // 'content-type': 'application/x-www-form-urlencoded'
                        // 'postman-token': '8ac67b85-83e6-7591-4d2b-b4afa03a4688'
                    },
                    body: data_create
                })
                    .then(response => response.json())
                    .then(resData => {
                        // console.log(456);
                        console.log(resData);
                        if (resData.code === '200') {
                            // console.log(456);
                            let data_add = new FormData();
                            data_add.append('id', req.body.id);
                            data_add.append('name', req.body.name);
                            data_add.append('collection', collectionName);
                            data_add.append('file', fs.createReadStream("./public/" + file_name));
                            fetch(db.fsAddURI, {
                                method: 'POST',
                                headers: {
                                    // 'Authorization': `bearer ${token}`,
                                    'api_key': db.fsApi_key,
                                    // 'postman-token': '8ac67b85-83e6-7591-4d2b-b4afa03a4688'
                                },
                                body: data_add
                            })
                                .then(response => response.json())
                                .then(resDataAdd => {
                                    // console.log(678);
                                    console.log(resDataAdd);
                                    if (resDataAdd.code === '200') {
                                        UserSmartDoorManagement.findOneAndUpdate({id: req.params.id}, req.body, function (err) {
                                            if (err) throw next(err);
                                            res.json({message: "OK"});
                                        });

                                    } else {
                                        res.json({message: resDataAdd.data});
                                    }
                                })
                                .catch((error) => {
                                    res.json({message: error});
                                });

                        } else {
                            res.json({message: resData.data});
                        }
                    })
                    .catch((error) => {
                        res.json({message: error});
                    });


            } else {
                res.json({message: resData.data});
            }
        })
        .catch((error) => {
            res.json({message: error});
        });


});

router.delete('/:id', function (req, res, next) {
    let data_delete = new FormData();
    data_delete.append('id', req.params.id);
    UserSmartDoorManagement.findOne({id: req.params.id}, (err, data) => {
        // if(err) throw next(err);
        if (data) {
            // console.log(data);
            console.log(data.department);
            data_delete.append('collection', collectionName);
            // console.log(data_delete);
            fetch(db.fsDeleteURI, {
                method: 'DELETE',
                headers: {
                    // 'Authorization': `bearer ${token}`,
                    'api_key': db.fsApi_key,
                    // 'content-type': 'application/x-www-form-urlencoded'
                    // 'postman-token': '8ac67b85-83e6-7591-4d2b-b4afa03a4688'
                },
                body: data_delete
            })
                .then(response => response.json())
                .then(resData => {
                    // console.log(456);
                    console.log(resData);
                    if (resData.code === '200') {
                        UserSmartDoorManagement.findOne({id: req.params.id}).remove(function (err, data) {
                            //updateRedis(req.query.user_id, res, next);
                            if (err) throw next(err);
                            res.json(data);
                        });

                    } else {
                        res.json({message: resData.data});
                    }
                })
                .catch((error) => {
                    res.json({message: error});
                });
        } else {
            res.json({message: "BAD", data: []});
        }
    })
});

module.exports = router;
