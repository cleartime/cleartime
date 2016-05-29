'use strict';
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象

// 新增 Todo 项目
router.get('/', function(req, res, next) {
    res.render('login');
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
    AV.User.logIn(req.body.username, req.body.password).then(function () {
        // 成功了，现在可以做其他事情了
        console.log('yes')
    }, function () {
        // 失败了
        console.log('no')
    });
});

module.exports = router;

