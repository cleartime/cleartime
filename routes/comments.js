/**
 * Created by gxx on 16/6/8.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');
var nodemailer = require("nodemailer");


function sendEmail(nickname, email, content, articleId, fid, femail, fnickname) {
    var toEmail = !!femail ? femail : '562606139@qq.com';
    var title = !!fnickname ? '尊敬的'+fnickname + '您好,您在Cleartime Blog中的评论有回复啦!赶紧过来看看吧!' : '您有新的评论!';
// 开启一个 SMTP 连接池
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "smtp.qq.com", // 主机
        secureConnection: true, // 使用 SSL
        port: 465, // SMTP 端口
        auth: {
            user: "562606139@qq.com", // 账号
            pass: "ouztuqalihmzbbea" // 密码
        }
    });
// 设置邮件内容
    var mailOptions = {
        from: 'Cleartime Blog <562606139@qq.com>', // 发件地址
        to: toEmail, // 收件列表
        subject: title, // 标题
        html: content// html 内容
    }
// 发送邮件
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
        smtpTransport.close(); // 如果没用，关闭连接池
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
router.post('/query', function (req, res, next) {
    var cql = 'select * from Comments where  articleId="' + req.body.objectId + '"';
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

