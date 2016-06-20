/**
 * Created by gxx on 16/6/12.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

var Recommend = AV.Object.extend('recommend');// 网站信息


// 查询推荐位
router.get('/', function (req, res, next) {
    var currentUser = AV.User.current();
    var cql = 'select * from recommend';
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


// 新增推荐位
router.post('/', function (req, res, next) {
    var name = req.body.name;//推荐位名
    var nickname = req.body.nickname;//推荐位昵称
    AV.Query.doCloudQuery('insert into recommend (name,nickname) values("' + name + '","' + nickname + '")').then(function (data) {
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

//修改推荐位
router.post('/updata', function (req, res, next) {
    var name = req.body.name;//推荐位名
    var nickname = req.body.nickname;//推荐位昵称
    AV.Query.doCloudQuery('update recommend set  name="' + name + '" nickname="' + nickname + '"  where objectId="' + req.body.objectId + '"').then(function (data) {
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



//删除推荐位
router.post('/del', function (req, res, next) {
    AV.Query.doCloudQuery('delete from recommend where objectId="' + req.body.objectId + '"').then(function (data) {
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

