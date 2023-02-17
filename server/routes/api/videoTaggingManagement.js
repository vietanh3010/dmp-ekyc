var express = require('express');
var router = express.Router();
var VideoTaggingManagement = require('../../models/VideoTagging');
var User = require('../../models/User');

router.get('/', function (req, res, next) {
    VideoTaggingManagement.findOne({
        $or: [{
            $and: [
                {'is_processing': {$ne: true}},
                {'is_processed': {$ne: true}}
            ]
        },
            {
                $and: [
                    {'is_processing': {$exists: false}},
                    {'is_processed': {$exists: false}}
                ]
            }
        ]

    }).exec((err, post) => {
        if (post) {
            VideoTaggingManagement.findByIdAndUpdate({_id: post.id}, {
                is_processing: true,
                updated_date: Date.now()
            }, function (err) {
                if (err) throw next(err);
                res.json(post);
            });
            // res.json(post);
        } else {
            res.json({});
        }

    });
});

router.get('/:id', function (req, res, next) {
    VideoTaggingManagement.findOne({
        $and: [
            {'_id': req.params.id}
        ]
    }).exec((err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

// router.post('/', function (req, res, next) {
//     VideoTaggingManagement.findOne({name: req.body.name}, (err, data) => {
//         // if(err) throw next(err);
//         if (!data) {
//             ProfileManagement.create(req.body, function (err, post) {
//                 if (err) throw next(err);
//                 res.json({message: "OK", data: post});
//             });
//         } else {
//             res.json({message: "BAD", data: []});
//         }
//     })
// });

router.put('/:id', function (req, res, next) {
    VideoTaggingManagement.findByIdAndUpdate({_id: req.params.id}, req.body, function (err) {
        if (err) throw next(err);
        res.json({message: "OK"});
    });

});

// router.delete('/:id', function (req, res, next) {
//     VideoTaggingManagement.findOne({_id: req.params.id}).remove(function (err, data) {
//         //updateRedis(req.query.user_id, res, next);
//         if (err) throw next(err);
//         res.json(data);
//     });
// });

module.exports = router;