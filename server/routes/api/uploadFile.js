let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuidv4 = require('uuid/v4'),
    router = express.Router();

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
        // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        //     cb(null, true);
        // } else {
        //     cb(null, false);
        //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        // }
    }
});

// User model
let User = require('../../models/Storage');

router.post('/', upload.array('imgCollection', 6), (req, res, next) => {
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host');
    console.log(req.files[0].filename);
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + '/public/' + req.files[i].filename)
    }
    res.json({message: "OK", data: {link: reqFiles[0], filename: req.files[0].filename}});
});

router.get("/", (req, res, next) => {
    User.find().then(data => {
        res.status(200).json({
            message: "User list retrieved successfully!",
            users: data
        });
    });
});

module.exports = router;