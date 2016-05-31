'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');
var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.express());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 未处理异常捕获 middleware
app.use(function (req, res, next) {
    var d = null;
    if (process.domain) {
        d = process.domain;
    } else {
        d = domain.create();
    }
    d.add(req);
    d.add(res);
    d.on('error', function (err) {
        console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
        if (!res.finished) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json; charset=UTF-8');
            res.end('uncaughtException');
        }
    });
    d.run(next);
});

var routerArr = ['login', 'reg', 'todos'];
routerArr.forEach(function (item) {
    var route = require('./routes/' + item);
    app.use('/' + item, route);
});

app.get('/', function (req, res) {
    res.render('index', {currentTime: new Date()});
});

app.use(function (req, res, next) {
    // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
    if (!res.headersSent) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) { // jshint ignore:line
        var statusCode = err.status || 500;
        if (statusCode === 500) {
            console.error(err.stack || err);
        }
        res.status(statusCode);
        res.render('error', {
            message: err.message || err,
            error: err
        });
    });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function (err, req, res, next) { // jshint ignore:line
    res.status(err.status || 500);
    res.render('error', {
        message: err.message || err,
        error: {}
    });
});

module.exports = app;
