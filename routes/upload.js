/**
 * Created by gxx on 16/6/12.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var json = require('./config');


// 上传图片
router.post('/', function (req, res) {
    if (req.busboy) {
        var base64data = [];
        var pubFileName = '';
        var pubMimeType = '';
        req.busboy.on('file', function (fieldname, file, fileName, encoding, mimeType) {
            var buffer = '';
            pubFileName = fileName;
            pubMimeType = mimeType;
            file.setEncoding('base64');
            file.on('data', function (data) {
                buffer += data;
            }).on('end', function () {
                base64data.push(buffer);
            });
        }).on('finish', function () {
            var f = new AV.File(pubFileName, {
                // 仅上传第一个文件（多个文件循环创建）
                base64: base64data[0]
            });
            try {
                f.save().then(function (fileObj) {
                    // 向客户端返回数据
                    res.send({
                        fileId: fileObj.id,
                        fileName: fileObj.name(),
                        mimeType: fileObj.metaData().mime_type,
                        fileUrl: fileObj.url()
                    });
                });
            } catch (error) {
                console.log('uploadFile - ' + error);
                res.status(502);
            }
        })
        req.pipe(req.busboy);
    } else {
        console.log('uploadFile - busboy undefined.');
        res.status(502);
    }
});



// 查询单个图片
router.get('/query', function (req, res) {
    var cql = 'select * from _File where objectId="' + req.query.objectId + '"';
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




// 删除单个图片
router.post('/del', function (req, res) {
    var cql = 'delete from _File where objectId="' + req.body.objectId + '"';
    var pvalues = [0];
    AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
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

