/**
 * Created by gxx on 16/6/8.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

var Todo = AV.Object.extend('Linkfriend');// 个人信息

// 查询友情链接
router.get('/', function (req, res, next) {
    var cql = 'select * from Linkfriend';
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


// 新增友情链接
router.post('/', function (req, res, next) {
    var title = req.body.title;//头像
    var url = req.body.url;//个性签名
    var sort = req.body.sort;//微博地址
    // 执行 CQL 语句实现新增一个 Information 对象
    AV.Query.doCloudQuery('insert into Linkfriend(title, url,sort) values("' + title + '","' + url + '","' + sort + '")').then(function (data) {
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

// 修改友情链接
router.post('/updata', function (req, res, next) {
    var title = req.body.title;//头像
    var url = req.body.url;//个性签名
    var sort = req.body.sort;//微博地址
    AV.Query.doCloudQuery('update Linkfriend set  title="' + title + '", url="' + url + '",sort="' + sort + '" where objectId="' + req.body.objectId + '"').then(function (data) {
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

// 删除友情链接
router.post('/del', function (req, res, next) {
    var objectId = req.body.objectId;
    AV.Query.doCloudQuery('delete from Linkfriend where objectId="' + objectId + '"').then(function (data) {
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


module.exports = router;

