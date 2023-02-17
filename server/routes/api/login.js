var querystring = require('querystring');
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
var FormData = require('form-data');


router.post('/', function (req, res, next) {
    var details = {
        "client_id": "bcnfpt",
        "client_secret": "wyzL_rjzqDK8124A7KpyFlIBXmxzc-7A9VawyEka",
        "grant_type": "authorization_code",
        "code": req.body.hash,
        "redirect_uri": 'http://localhost:3000/oauth/redirect'
        // "redirect_uri": 'https://sangkien.fpt.com.vn/oauth/redirect'
    };
    console.log(details);
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    // let auth_data = querystring.stringify({
    //     "client_id": "bcnfpt",
    //     "client_secret": "wyzL_rjzqDK8124A7KpyFlIBXmxzc-7A9VawyEka",
    //     "grant_type": "authorization_code",
    //     "code": req.body.hash,
    //     "redirect_uri": 'http://localhost:3000/oauth/redirect'
    // });
    console.log(formBody);


    fetch('https://adfs.fpt.com.vn/adfs/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    })
        .then(response => response.json())
        .then(resData => {
            if (resData.id_token) {
                res.json({message: "OK", id_token: resData.id_token});
            } else {
                res.json({message: "BAD"});
            }

        })
        .catch((error) => {
            console.log(error);
            res.json({message: error});
        });
});

module.exports = router;

