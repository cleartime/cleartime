'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', function (req, res, next) {
    AV.User.logIn(req.body.username, req.body.password).then(function (user) {
        json.msg = '登陆成功!';
        json.data = user;
        json.code = 200;
        res.send(json);
    }, function (error) {
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});

module.exports = router;

