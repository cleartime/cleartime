/**
 * Created by gxx on 16/6/8.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');
var nodemailer = require("nodemailer");

//发送邮件
function sendEmail(nickname, email, content, articleId, fid, femail, fnickname){
    var toEmail = !!femail ? femail : '562606139@qq.com';
    var title = !!fnickname ? '尊敬的' + fnickname + '您好,您在Cleartime Blog中的评论有回复啦!赶紧过来看看吧!' : '您有新的评论!';
    var content = '<p>' + (!!fnickname ? fnickname : nickname) + '回复了您的评论</p><p>' + content + '</p><p><a href="http://cleartime.leanapp.cn/post/?id=' + articleId + '">点击立即回复</a></p>';
    var user = '562606139@qq.com'
        , pass = 'ouztuqalihmzbbea'
        ;
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "QQ"
        , auth: {
            user: user,
            pass: pass
        }
    });

    smtpTransport.sendMail({
        from    : 'Cleartime Blog <562606139@qq.com>'
        , to      : toEmail
        , subject : title
        , html    : content
    }, function(err, res) {
        console.log(err, res);
    });
}


// 查询所有文章评论
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

// 查询单一文章评论
router.get('/query', function (req, res, next) {
    var cql = 'select * from Comments where  articleId="' + req.query.objectId + '"';
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

// 修改单一文章评论
router.post('/updata', function (req, res, next) {
    var nickname = req.body.nickname;//昵称
    var email = req.body.email;//邮箱
    var content = req.body.content;//评论内容
    var cql = 'update Comments set  nickname=?,email=?,content=? where objectId=?';
    var pvalues = [nickname, email, content, req.body.objectId];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        var results = data.results;
        json.data = results;
        json.msg = '修改成功!';
        res.send(json);
    }, function (error) {
        console.log(error);
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


// 新增单一文章评论
router.post('/', function (req, res, next) {
    var nickname = req.body.nickname;//昵称
    var email = req.body.email;//邮箱
    var content = req.body.content;//评论内容
    var articleId = req.body.articleId;//文章Id
    var fid = req.body.fid;//父Id
    var femail = req.body.femail;//父邮箱
    var fnickname = req.body.fnickname;//父昵称
    if (!!nickname.length && !!email.length && !!content.length) {
        var cql = 'insert into Comments(nickname,email,content,articleId,fid) values(?,?,?,?,?)';
        var pvalues = [nickname, email, content, articleId, fid];
        AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
            sendEmail(nickname, email, content, articleId, fid, femail, fnickname);
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
    } else {
        json.code = 100;
        json.msg = '参数错误';
        res.send(json);
    }

});


// 删除单一文章评论
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

