/**
 * Created by gxx on 16/6/8.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

var Todo = AV.Object.extend('Information');// 个人信息

// 查询个人信息
router.get('/', function (req, res, next) {
    var currentUser = AV.User.current();
    var cql = 'select * from Information';
    var pvalues = [0];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        var results = data.results;
        json.data = results;
        json.msg = '获取成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


// 新增个人信息
router.post('/', function (req, res, next) {
    var introduction = req.body.introduction;//个人简介
    var head = req.body.head;//头像
    var sign = req.body.sign;//个性签名
    var weibo = req.body.weibo;//微博地址
    var github = req.body.github;//github地址
    var email = req.body.email;//邮箱地址
    // 执行 CQL 语句实现新增一个 Information 对象
    AV.Query.doCloudQuery('insert into Information(head, sign,introduction,weibo,github,email) values("' + head + '","' + sign + '","' + introduction + '","' + weibo + '","' + github + '","' + email + '")').then(function (data) {
        // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
        var results = data.results;
        json.data = results[0];
        json.msg = '设置成功!';
        res.send(json);
    }, function (error) {
        //查询失败，查看 error
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});

// 修改个人信息
router.post('/updata', function (req, res, next) {
    var introduction = req.body.introduction;//个人简介
    var head = req.body.head;//头像
    var sign = req.body.sign;//个性签名
    var weibo = req.body.weibo;//微博地址
    var github = req.body.github;//github地址
    var email = req.body.email;//邮箱地址
    AV.Query.doCloudQuery('update Information set  head="' + head + '", sign="' + sign + '",weibo="' + weibo + '",github="' + github + '",email="' + email + '",introduction="' + introduction + '" where objectId="' + req.body.objectId + '"').then(function (data) {
        var results = data.results;
        json.data = results[0];
        json.msg = '设置成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


module.exports = router;

