/**
 * Created by gxx on 16/6/12.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

var Todo = AV.Object.extend('Information');// 个人信息

// 查询网站信息
router.get('/', function (req, res, next) {
    var currentUser = AV.User.current();
    var cql = 'select * from Webinfo';
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


// 新增网站信息
router.post('/', function (req, res, next) {
    var title = req.body.title;//网站标题
    var describe = req.body.describe;//网站描述
    var keyword = req.body.keyword;//关键词

    AV.Query.doCloudQuery('insert into Webinfo(title, describe,keyword) values("' + title + '","' + describe + '","' + keyword + '")').then(function (data) {
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

//修改网站信息
router.post('/updata', function (req, res, next) {
    var title = req.body.title;//网站标题
    var describe = req.body.describe;//网站描述
    var keyword = req.body.keyword;//关键词
    AV.Query.doCloudQuery('update Webinfo set  title="' + title + '", describe="' + describe + '",keyword="' + keyword + '" where objectId="' + req.body.objectId + '"').then(function (data) {
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

