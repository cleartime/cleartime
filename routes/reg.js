'use strict';
var router = require('express').Router();
var AV = require('leanengine');


// 新增 Todo 项目
router.get('/', function(req, res, next) {
    //res.render('reg');
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



// 新增 Todo 项目
router.post('/', function(req, res, next) {
    var user = new AV.User();
    user.set('username', req.body.username);
    user.set('password', req.body.password);
    user.signUp().then(function(user) {
        res.json(user);
        // 注册成功，可以使用了
    }, function(error) {
        // 失败了
        console.log('Error: ' + error.code + ' ' + error.message);
    });
});


module.exports = router;

