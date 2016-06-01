'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

router.get('/', function (req, res, next) {
    res.render('login')
});

router.post('/', function (req, res, next) {
    AV.User.logIn(req.body.username, req.body.password).then(function () {
        console.log('-------yes');
        res.send(json);
    }, function () {
        console.log('-------no');
        res.send(json);
    });
});

module.exports = router;

