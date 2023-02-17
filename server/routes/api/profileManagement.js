var express = require('express');
var router = express.Router();
var ProfileManagement = require('../../models/ProfileManagement');
var User = require('../../models/User');

router.get('/', function (req, res, next) {
    // if(err) throw next(err);
    var limit = req.query.max_row * 1;
    var skip = (req.query.page - 1) * req.query.max_row;
    // .filter((data, index) => (index < ( req.query.page * req.query.max_row)) && (index >= (req.query.page * req.query.max_row) - req.query.max_row)
    ProfileManagement.find({}).sort({updated_time: 'desc'}).limit(limit).skip(skip).exec(function (err, products) {
        if (err) return next(err);
        ProfileManagement.find({}).count(function (err1, count) {
            if (err1) {
                console.log(err1)
            }
            ProfileManagement.find({
                similarity: {$gt: 80}
            }).count(function (err2, count_pos) {
                if (err2) {
                    console.log(err2)
                }
                ProfileManagement.find(
                    {$or: [{similarity: {$lt: 80}}, {similarity: null}]}
                ).count(function (err3, count_neg) {
                    if (err3) {
                        console.log(err3)
                    }
                    res.json({count: count, data: products, count_pos: count_pos, count_neg: count_neg});
                });
            });

        });
    });

});

router.get('/:id', function (req, res, next) {
    ProfileManagement.findOne({
        $and: [
            {'_id': req.params.id}
        ]
    }).exec((err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/', function (req, res, next) {
    ProfileManagement.findOne({name: req.body.name}, (err, data) => {
        // if(err) throw next(err);
        if (!data) {
            ProfileManagement.create(req.body, function (err, post) {
                if (err) throw next(err);
                res.json({message: "OK", data: post});
            });
        } else {
            res.json({message: "BAD", data: []});
        }
    })
});

router.put('/:id', function (req, res, next) {
    ProfileManagement.findByIdAndUpdate({_id: req.params.id}, req.body, function (err) {
        if (err) throw next(err);
        res.json({message: "OK"});
    });

});

router.delete('/:id', function (req, res, next) {
    ProfileManagement.findOne({_id: req.params.id}).remove(function (err, data) {
        //updateRedis(req.query.user_id, res, next);
        if (err) throw next(err);
        res.json(data);
    });
});

module.exports = router;