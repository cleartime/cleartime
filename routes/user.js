'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

// 查询管理员
router.get('/', function (req, res, next) {
    var cql = 'select * from _User';
    var pvalues = [0, 1];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        var results = data.results;
        json.data = results;
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


// 新增管理员
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
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


// 删除管理员
router.post('/del', function (req, res, next) {
    var objectId = req.body.objectId;
    AV.Query.doCloudQuery('delete from _User where objectId="' + objectId + '"').then(function (data) {
        var results = data.results;
        json.data = results;
        json.msg = '删除成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


// 修改管理员
router.post('/updata', function (req, res, next) {
    var objectId = req.body.objectId;
    var password = req.body.password;
    AV.Query.doCloudQuery('update _User set password="' + password + '" where objectId="' + objectId + '"').then(function (data) {
        var results = data.results;
        json.msg = '修改成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


module.exports = router;

