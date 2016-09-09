/**
 * Created by gxx on 16/6/12.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

var Webinfo = AV.Object.extend('Webinfo');// 网站信息

// 查询单个栏目(根据cod)
router.get('/query', function (req, res) {
    var cql = 'select * from Category where objectId = '+req.query.objectId+'';
    AV.Query.doCloudQuery(cql).then(function (data) {
        json.data = data.results;
        json.code = 200;
        json.msg = '获取成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});

// 查询栏目
router.get('/', function (req, res, next) {
    var cql = 'select * from Category';
    var pvalues = [0];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        var results = data.results;
        json.data = results;
        json.code = 200;
        json.msg = '获取成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


// 新增栏目
router.post('/', function (req, res, next) {
    var name = req.body.name;//头像
    AV.Query.doCloudQuery('insert into Category (name) values("' + name + '")').then(function (data) {
        // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
        var results = data.results;
        json.data = results;
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

//修改栏目
router.post('/updata', function (req, res, next) {
    var name = req.body.name;//头像
    AV.Query.doCloudQuery('update Category set  name="' + name + '" where objectId="' + req.body.objectId + '"').then(function (data) {
        var results = data.results;
        json.data = results;
        json.msg = '设置成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


//删除栏目
router.post('/del', function (req, res, next) {
    AV.Query.doCloudQuery('delete from Category where objectId="' + req.body.objectId + '"').then(function (data) {
        // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
        var results = data.results;
        json.data = results;
        json.msg = '删除成功!';
        res.send(json);
    }, function (error) {
        //查询失败，查看 error
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


module.exports = router;

