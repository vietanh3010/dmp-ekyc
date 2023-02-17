var express = require('express');
var router = express.Router();
var ProjectManagement = require('../../models/ProjectManagement');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.fpt.com.vn',
    port: 587,
    secure: false,
    auth: {
        user: 'sangkien@fpt.com.vn',
        pass: 'inno@BCN1'
    }
});

var mailOptionsPass = {
    from: 'sangkien@fpt.com.vn',
    to: 'longtd9@fpt.com.vn',
    subject: 'Sáng kiến FPT',
};

var mailOptionsFail = {
    from: 'sangkien@fpt.com.vn',
    to: 'longtd9@fpt.com.vn',
    subject: 'Sáng kiến FPT',
};

var mailOptionsRegisterAuthor = {
    from: 'sangkien@fpt.com.vn',
    to: 'longtd9@fpt.com.vn',
    subject: 'Sáng kiến FPT',
};

var mailOptionsRegisterExaminer = {
    from: 'sangkien@fpt.com.vn',
    to: 'longtd9@fpt.com.vn',
    subject: 'Sáng kiến FPT',
};

var mailOptionsRegisterNot = {
    from: 'sangkien@fpt.com.vn',
    to: 'longtd9@fpt.com.vn',
    subject: 'Sáng kiến FPT',
};

var mailOptionsRegisterFull = {
    from: 'sangkien@fpt.com.vn',
    to: 'longtd9@fpt.com.vn',
    subject: 'Sáng kiến FPT',
};

const emailList = [
    // // {value: 1, label: 'HoaTD@fsoft.com.vn'},
    // {value: 1, label: 'KhacDV@fsoft.com.vn'},
    // {value: 1, label: 'yenctb@fsoft.com.vn'},
    // {value: 1, label: 'Ngant6@fsoft.com.vn'},
    // {value: 1, label: 'ViPTQ@fsoft.com.vn'},
    // // {value: 1, label: 'duonghtt3@fsoft.com.vn'},
    // {value: 1, label: 'chungph1@fsoft.com.vn'},
    // // {value: 2, label: 'VietNX@fpt.com.vn'},
    // {value: 2, label: 'LoanPT@fpt.com.vn'},
    // {value: 3, label: 'TuVA@fpt.com.vn'},
    // {value: 4, label: 'HienNM@fpt.com.vn'},
    // {value: 4, label: 'VuongNM@fpt.com.vn'},
    // {value: 4, label: 'ThuyTHD@fpt.com.vn'},
    // // {value: 5, label: 'Thanhha@fpt.com.vn'},
    // {value: 5, label: 'ThiHTC@fpt.com.vn'},
    // {value: 5, label: 'TuanLH@fpt.com.vn'},
    // {value: 5, label: 'HuyenVTT8@fpt.com.vn'},
    // // {value: 6, label: 'VuNL@fpt.com.vn'},
    // {value: 6, label: 'Bichlien@vnexpress.net'},
    // {value: 7, label: 'CuongTT@fe.edu.vn'},
    // {value: 8, label: 'PhuongNK@fpt.com.vn'},
    // {value: 8, label: 'HuyCQ@fpt.com.vn'},
    // {value: 1, label: 'ngocnb9@fpt.com.vn'},
    // {value: 1, label: 'longtd9@fpt.com.vn'},
    // {value: 1, label: 'bangnbx@fpt.com.vn'},
];


router.get('/', function (req, res, next) {
    let cttv = null;
    for (let item of emailList) {
        if (req.upn.toLowerCase() === item.label.toLowerCase()) {
            cttv = item.value
        }
    }
    if (cttv) {
        ProjectManagement.find({
            cttv: cttv,
            status: {$ne: 10}
        }).sort({updated_date: -1}).exec(function (err, products) {
            if (err) return next(err);
            res.json(products);
        });
    } else if (req.upn.toLowerCase() === 'thephuong@fpt.com.vn' ||
        req.upn.toLowerCase() === 'phuongnk@fpt.com.vn' || req.upn.toLowerCase() === 'huycq@fpt.com.vn' || req.upn.toLowerCase() === 'chaubnp@fpt.com.vn' ||
        req.upn.toLowerCase() === 'longtd9@fpt.com.vn' || req.upn.toLowerCase() === 'vietlh@fpt.com.vn' || req.upn.toLowerCase() === 'thaottl@fpt.com.vn' ||
        req.upn.toLowerCase() === 'yenvh2@fpt.com.vn' || req.upn.toLowerCase() === 'trangnm15@fpt.com.vn') {
        ProjectManagement.find().sort({updated_date: -1}).exec(function (err, products) {
            if (err) return next(err);
            res.json(products);
        });
    } else {
        ProjectManagement.find({upn: req.upn}).sort({updated_date: -1}).exec(function (err, products) {
            if (err) return next(err);
            res.json(products);
        });
    }

});

router.get('/:id', function (req, res, next) {
    ProjectManagement.findOne({
        $and: [
            {'_id': req.params.id}
        ]
    }).exec((err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/', function (req, res, next) {
    ProjectManagement.findOne({name: req.body.name}, (err, data) => {
        // if(err) throw next(err);
        if (data) {
            res.json({message: "BAD", data: []});
        } else {
            ProjectManagement.count({}, function (err, count) {
                req.body.upn = req.upn;
                req.body.id = '2020' + count;
                ProjectManagement.create(req.body, function (err, post) {
                    if (req.body.status !== 10) {
                        mailOptionsRegisterAuthor.to = post.upn;
                        mailOptionsRegisterAuthor.html = '<h4>Dear anh/chị,</h4><br/><p>Anh/Chị đã đăng ký sáng kiến thành công, click vào <a href="https://sangkien.fpt.com.vn">đây</a> để biết thêm chi tiết!</p><br/><p>Trân trọng cảm ơn!</p>';
                        transporter.sendMail(mailOptionsRegisterAuthor, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        let cttv = [];
                        for (let item of emailList) {
                            if (req.body.cttv === item.value) {
                                cttv.push(item);
                            }
                        }
                        if (cttv !== []) {
                            cttv.forEach(function (item) {
                                mailOptionsRegisterExaminer.to = item.label;
                                mailOptionsRegisterExaminer.html = '<h4>Dear anh/chị,</h4><br/><p>Đã có sáng kiến mới đc đăng ký, click vào <a href="https://sangkien.fpt.com.vn">đây</a> để biết thêm chi tiết!</p><br/><p>Trân trọng cảm ơn!</p>';
                                transporter.sendMail(mailOptionsRegisterExaminer, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                            })

                        }
                    }
                    if (err) throw next(err);
                    res.json({message: "OK", data: post});
                });
            })
        }
    })
});

router.put('/:id', function (req, res, next) {
    ProjectManagement.findByIdAndUpdate({_id: req.params.id}, req.body, function (err, post) {
        if (req.body.status && req.body.status === 1) {
            mailOptionsRegisterNot.to = post.upn;
            mailOptionsRegisterNot.html = '<h4>Dear anh/chị,</h4><br/><p>Hồ sơ đăng ký sáng kiến FPT của anh/chị đang thiếu thông tin.</p><br/><p>Vui lòng click vào <a href="https://sangkien.fpt.com.vn">link</a> này và bổ sung thông tin theo yêu cầu để đủ điều kiện xét duyệt nhé.</p><br/><p>Trân trọng cảm ơn!</p>';
            transporter.sendMail(mailOptionsRegisterNot, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        if (req.body.status && req.body.status === 2) {
            mailOptionsRegisterFull.to = post.upn;
            mailOptionsRegisterFull.html = '<h4>Dear anh/chị,</h4><br/><p>Sáng kiến của anh/chị đang chờ phê duyệt cấp cttv, click vào <a href="https://sangkien.fpt.com.vn">đây</a> để biết thêm chi tiết!</p>';
            transporter.sendMail(mailOptionsRegisterFull, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        if (req.body.status && req.body.bonus_value && req.body.status === 3 && req.body.bonus_value !== '0') {
            mailOptionsPass.to = post.upn;
            mailOptionsPass.html = '<h4>Dear anh/chị,</h4><br/><p>Giải pháp của bạn đã được công nhận là sáng kiến FPT và được mời tham gia giải thưởng iKhiến 2020.</p><br/><p>Vui lòng đợi thông báo của BTC trong email kế tiếp.</p><br/><p>Trân trọng cảm ơn!</p>';
            transporter.sendMail(mailOptionsPass, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        if (req.body.status && req.body.bonus_value && req.body.status === 3 && req.body.bonus_value === '0') {
            mailOptionsFail.to = post.upn;
            mailOptionsFail.html = '<h4>Dear anh/chị,</h4><br/><p>Rất tiếc hồ sơ của bạn đã không đủ điều kiện để xét duyệt công nhận sáng kiến FPT.</p><br/><p>Hãy tiếp tục sáng tạo, chúng tôi mong sẽ nhận được hồ sơ đăng ký của bạn trong những lần sau.</p><br/><p>Trân trọng cảm ơn!</p>';
            transporter.sendMail(mailOptionsFail, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }

        if (err) throw next(err);
        res.json({message: "OK"});
    });

});

router.delete('/:id', function (req, res, next) {
    ProjectManagement.findOne({_id: req.params.id}).remove(function (err, data) {
        //updateRedis(req.query.user_id, res, next);
        if (err) throw next(err);
        res.json(data);
    });
});

module.exports = router;