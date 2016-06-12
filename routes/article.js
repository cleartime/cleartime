/**
 * Created by gxx on 16/6/12.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

var Article = AV.Object.extend('Article');// 网站信息


// 查询单个文章
router.post('/query', function (req, res, next) {
    var currentUser = AV.User.current();
    var cql = 'select * from Article where objectId="' + req.body.objectId + '"';
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


// 查询所有文章
router.get('/', function (req, res, next) {
    var currentUser = AV.User.current();
    var cql = 'select * from Article';
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

// 新增文章
router.post('/', function (req, res, next) {
    var title = req.body.title;//文章标题
    var category = req.body.category;//文章栏目
    var recommend = req.body.recommend;//文章推荐位
    var tag = req.body.tag;//文章标签
    var description = req.body.description;//文章描述
    var content = req.body.content;//文章内容

    AV.Query.doCloudQuery('insert into Article(title,tag,description,content,recommend,category) values("' + title + '","' + tag + '","' + description + '","' + content + '","' + recommend + '","' + category + '")').then(function (data) {
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


// 修改单个文章
router.post('/update', function (req, res, next) {
    var title = req.body.title;//文章标题
    var category = req.body.category;//文章栏目
    var recommend = req.body.recommend;//文章推荐位
    var tag = req.body.tag;//文章标签
    var description = req.body.description;//文章描述
    var content = req.body.content;//文章内容

    AV.Query.doCloudQuery('update Article set title="' + title + '",tag="' + tag + '",description="' + description + '",content="' + content + '",recommend="' + recommend + '",category="' + category + '" where objectId="' + req.body.objectId + '"').then(function (data) {
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


// 删除单个文章
router.post('/del', function (req, res, next) {
    AV.Query.doCloudQuery('delete from Article where objectId="' + req.body.objectId + '"').then(function (data) {
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

