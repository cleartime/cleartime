/**
 * Created by Laggo on 11/4/15.
 */
var gulp = require('gulp');
var compass = require('gulp-compass');
var notifier = require('node-notifier');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var rev = require('gulp-reversion');
var cssSprite = require('gulp-css-spritesmith');
////版本控制
//gulp.task('rev', function() {
//    gulp.src('./src/index.html')
//        .pipe(rev())
//        .pipe(gulp.dest('../'));
//});

// 自动雪碧图
// autoSprite, with media query
gulp.task('autoSprite', function() {
    gulp.src('css/*.css').pipe(cssSprite({
            // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
            imagepath: './src/img',
            // 映射CSS中背景路径，支持函数和数组，默认为 null
            imagepath_map: null,
            // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
            spritedest: './www/img',
            // 替换后的背景路径，默认 ../images/
            spritepath: './www/img',
            // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
            padding: 2,
            // 是否使用 image-set 作为2x图片实现，默认不使用
            useimageset: false,
            // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
            newsprite: false,
            // 给雪碧图追加时间戳，默认不追加
            spritestamp: true,
            // 在CSS文件末尾追加时间戳，默认不追加
            cssstamp: true
        }))
        .pipe(gulp.dest('./www/img'));
});


//输出html
gulp.task('html', function () {
    return gulp.src('./src/html/**/*.html')
        .pipe(cache('linting'))
        .pipe(gulp.dest('./www/html'));
});

//输出lib
gulp.task('lib', function () {
    return gulp.src('./src/lib/**/*.*')
        .pipe(cache('linting'))
        .pipe(gulp.dest('./www/lib'));
});

gulp.task('compass', function () {
    gulp.src('src/sass/main.sass')
        .pipe(compass({
            config_file: 'src/config.rb',
            css: 'www/',
            sass: 'src/sass/'
        }))
        .on('error', function (err) {
            notifier.notify({
                'title': 'sass error!',
                'message': 'sass error'
            });
            this.emit('end');
        })
        .pipe(gulp.dest('www/'))
});

gulp.task('script', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        //.pipe(uglify())
        .pipe(gulp.dest('www/'));
});


// 静态服务器
gulp.task('browsersync', function() {
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js'
    ];
    browserSync.init(files,{
        server: {
            baseDir: "./"
        }
    });
});
gulp.task('watch',['browsersync'], function () {
    gulp.watch('src/sass/*.sass', ['compass']);
    gulp.watch('src/js/**/*.js', ['script']);
    gulp.watch('src/html/**/*.html', ['html']);
    gulp.watch(['www/main.css','www/main.js','www/html/**/*.html','index.html'], browserSync.reload);
});

//default task
gulp.task('default', ['watch','compass','script','html','lib','autoSprite'], function () {
    //browserSync.init({
    //    server: {
    //        baseDir: "./"
    //    }
    //});
    notifier.notify({
        'title': 'success！',
        'message': 'Gulp running!'
    });
});