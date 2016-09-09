/**
 * Created by gxx on 16/6/12.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

var Article = AV.Object.extend('Article');// 网站信息

// 根据栏目查询单个文章
router.get('/queryCategory', function (req, res, next) {
    var cql = 'select * from Article where category=' + req.query.categoryId + ' order by -updatedAt ';
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


// 根据推荐位查询单个文章
router.get('/queryRecommend', function (req, res, next) {
    var cql = 'select * from Article where recommend="' + req.query.recommend + '" order by -updatedAt ';
    var pvalues = [0];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        var results = data.results;
        json.data = results;
        json.msg = '获取成功!';
        res.send(json);
    }, function (error) {
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


// 查询单个文章
router.get('/query', function (req, res, next) {
    var cql = 'select * from Article where objectId="' + req.query.objectId + '"';
    var pvalues = [0];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        var results = data.results;
        json.data = results[0];
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
    var cql = 'select * from Article order by -updatedAt';
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
    var content = encodeURIComponent(req.body.content);//文章内容
    var fileId = req.body.fileId;//图片id
    var cql = 'insert into Article(title,tag,description,content,recommend,category,fileId) values(?,?,?,?,?,?,?)';
    var pvalues = [title, tag, description, content, recommend, parseInt(category), fileId];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
        var results = data.results;
        json.data = results;
        json.msg = '设置成功!';
        res.send(json);
    }, function (error) {
        //查询失败，查看 error
        json.data = [];
        json.code = 0;
        json.msg = '设置失败!';
        res.send(json)
    });
});


// 修改单个文章
router.post('/update', function (req, res, next) {
    var title = req.body.title;//文章标题
    var category = parseInt(req.body.category);//文章栏目
    var recommend = req.body.recommend;//文章推荐位
    var tag = req.body.tag;//文章标签
    var description = req.body.description;//文章描述
    var content = encodeURIComponent(req.body.content);//文章内容
    var fileId = req.body.fileId;//图片id
    var cql = 'update Article set  title=?,tag=?,description=?,content=?,recommend=?,category=?,fileId=? where objectId=?';
    var pvalues = [title, tag, description, content, recommend, parseInt(category), fileId , req.body.objectId];
    AV.Query.doCloudQuery(cql,pvalues).then(function (data) {
        // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
        var results = data.results;
        json.data = results;
        json.msg = '修改成功!';
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


// 搜索文章
router.post('/search', function (req, res, next) {
    var sql = 'select * from Article where title like "%'+req.body.title+'%"';
    AV.Query.doCloudQuery(sql).then(function (data) {
        // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
        var results = data.results;
        json.data = results;
        json.msg = '搜索成功!';
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

