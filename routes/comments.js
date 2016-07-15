/**
 * Created by gxx on 16/6/8.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

// 查询留言板
router.get('/', function (req, res, next) {
    var cql = 'select * from Comments';
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


// 新增留言板
router.post('/', function (req, res, next) {
    var content = req.body.content;//头像
    AV.Query.doCloudQuery('insert into Comments(content) values("' + content + '"")').then(function (data) {
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


// 删除留言板
router.post('/del', function (req, res, next) {
    var objectId = req.body.objectId;
    AV.Query.doCloudQuery('delete from Comments where objectId="' + objectId + '"').then(function (data) {
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

