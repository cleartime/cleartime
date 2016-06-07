'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

// 新增 Todo 项目
router.get('/', function (req, res, next) {
    var query = new AV.Query('_User');
    //query.equalTo('priority', 0);
    //query.find().then(function (results) {
    //    console.log(results);
    //    json.data = results;
    //    res.send(json);
    //}, function (error) {
    //    json.code = error.code;
    //    json.msg = error.message;
    //    res.send(json);
    //});
    query.get('575684ce530fd30068161608').then(function (data) {
        console.log(data);
        // 成功获得实例
        // data 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
    }, function (error) {
        // 失败了
    });
});


// 新增 Todo 项目
router.post('/', function (req, res, next) {
    var user = new AV.User();
    user.set('username', req.body.username);
    user.set('password', req.body.password);
    user.signUp().then(function (user) {
        json.code = 200;
        json.msg = '新增成功';
        res.send(json);
        // 注册成功，可以使用了
    }, function (error) {
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


module.exports = router;

