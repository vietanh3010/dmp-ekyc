var express = require('express');
var router = express.Router();
var HistoryManagement = require('../../models/HistoryManagement');
// var User = require('../../models/User');

router.get('/', function (req, res, next) {
    if (req.query.type === '1') {
        HistoryManagement.find(
            {
                $and: [
                    {
                        $or: [
                            {'id': "-1"},
                            {'status': 'fake'}
                        ]
                    },
                    {
                        'updated_time':
                            {
                                $gte: (new Date().getTime() - (15 * 24 * 60 * 60 * 1000))// 15 days last
                            }
                    }

                ]
            }).sort({updated_time: -1}).exec((err, post) => {
            if (post) {
                res.json(post);
            } else {
                res.json({});
            }

        });
    } else {
        HistoryManagement.find({
            $and: [
                {'id': {$ne: "-1"}},
                {'status': {$ne: "fake"}},
                {
                    'updated_time':
                        {
                            $gte: (new Date().getTime() - (15 * 24 * 60 * 60 * 1000))// 15 days last
                        }
                }
            ]
        }).sort({updated_time: -1}).exec((err, post) => {
            if (post) {
                res.json(post);
            } else {
                res.json({});
            }

        });
    }

});

router.get('/:id', function (req, res, next) {
    HistoryManagement.find({
        $and: [
            {'user_id': req.params.id}
        ]
    }).exec((err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/', function (req, res, next) {
    // console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.body.id));

    if (req.body.image && req.body.id && req.body.name && req.body.time) {
        var random_num = Math.random() * (100 - 1) + 1;
        var base64DataFile1 = req.body.image.replace(/^data:(.*?);base64,/, "").replace(/ /g, '+');
        // var base64DataFile2 = req.body.cmnd.replace('data:image/jpeg;base64,', "").replace('data:image/png;base64,', "").replace('data:image/jpg;base64,', "");
        var image_path = './public/image' + random_num + '.png';
        var image_name = 'image' + random_num + '.png';
        const url = req.protocol + '://' + req.get('host');
        // var id_path = 'cmnd' + random_num + '.png';
        // let data = new FormData();
        require("fs").writeFile(image_path, base64DataFile1, 'base64', function (err) {
            if (err) console.log('cannot create file!');
            req.body.image_link = url + '/public/' + image_name;
            req.body.updated_time = new Date().getTime();
            HistoryManagement.create(req.body, function (err, post) {
                if (err) res.json({message: "BAD", data: err});
                res.json({message: "OK", data: post});
            });
        });
    } else {
        res.json({message: "Not enough data"});
    }


});
//
// router.put('/:id', function (req, res, next) {
//     VideoTaggingManagement.findByIdAndUpdate({_id: req.params.id}, req.body, function (err) {
//         if (err) throw next(err);
//         res.json({message: "OK"});
//     });
//
// });

// router.delete('/:id', function (req, res, next) {
//     VideoTaggingManagement.findOne({_id: req.params.id}).remove(function (err, data) {
//         //updateRedis(req.query.user_id, res, next);
//         if (err) throw next(err);
//         res.json(data);
//     });
// });

module.exports = router;