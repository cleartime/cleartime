'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');
// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象

// 新增 Todo 项目
router.get('/', function (req, res, next) {
    //res.redirect('/todos');
    console.log('-------');
    //res.send('yes');
    //res.status(200).send('Bad Request');
    //res.end()
    //console.log(req,res,next)
    //var user = new AV.User();
    //user.set('username', 'hjiang');
    //user.set('password', 'f32@ds*@&dsa');
    //user.signUp().then(function(user) {
    //    // 注册成功，可以使用了
    //    console.log(user);
    //}, function(error) {
    //    // 失败了
    //    console.log('Error: ' + error.code + ' ' + error.message);
    //});
});
router.post('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    AV.User.logIn(req.body.username, req.body.password).then(function () {
        console.log('-------yes');
        res.send('yes');
        //res.render('/login', {title: '用户登录'});
    }, function () {
        // 失败了
        console.log('-------no')
    });
});

module.exports = router;

