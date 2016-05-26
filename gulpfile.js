var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
//var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || 3000);
// Static server
gulp.task('browser-sync', function() {
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js'
    ];
    browserSync.init(files,{
        //更改默认端口weinre
        ui: {
            port: 8080,
        }
    });
});

// Domain server
//gulp.task('browser-sync', function() {
//    browserSync.init({
//        proxy: "yourlocal.dev"
//    });
//});
gulp.task('default',['browser-sync']); //定义默认任务
