'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');

// 用户列表 Todo 项目
router.get('/users', function (req, res, next) {
    //var query = new AV.Query(AV.User);
    //query.equalTo('gender', 'female');  // find all the women
    //query.find().then(function(womenList) {
    //    console.log(womenList);
    //});
});


// 新增 Todo 项目
router.get('/', function(req, res, next) {
    res.render('reg');
});



// 新增 Todo 项目
router.post('/', function(req, res, next) {
    var user = new AV.User();
    user.set('username', req.body.username);
    user.set('password', req.body.password);
    user.signUp().then(function(user) {
        json.code = 200;
        json.msg = '新增成功';
        res.send(json);
        // 注册成功，可以使用了
    }, function(error) {
        json.code = error.code;
        json.msg = error.message;
        res.send(json);
    });
});


module.exports = router;

