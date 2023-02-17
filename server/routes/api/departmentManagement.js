var express = require('express');
var router = express.Router();
var DepartmentManagement = require('../../models/DepartmentManagement');
// var User = require('../../models/User');

router.get('/', function (req, res, next) {
    DepartmentManagement.find({}).exec((err, post) => {
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
    DepartmentManagement.find({
        $and: [
            {'user_id': req.params.id}
        ]
    }).exec((err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/', function (req, res, next) {

    DepartmentManagement.findOne({name: req.body.name}, (err, data) => {
        // if(err) throw next(err);
        if (!data) {
            DepartmentManagement.create(req.body, function (err, post) {
                if (err) throw next(err);
                res.json({message: "OK", data: post});
            });
        } else {
            res.json({message: "Department duplicate!", data: []});
        }
    });
});
//
// router.put('/:id', function (req, res, next) {
//     VideoTaggingManagement.findByIdAndUpdate({_id: req.params.id}, req.body, function (err) {
//         if (err) throw next(err);
//         res.json({message: "OK"});
//     });
//
// });

router.delete('/:id', function (req, res, next) {
    DepartmentManagement.findOne({_id: req.params.id}).remove(function (err, data) {
        //updateRedis(req.query.user_id, res, next);
        if (err) throw next(err);
        res.json(data);
    });
});

module.exports = router;