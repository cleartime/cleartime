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

////版本控制
//gulp.task('rev', function() {
//    gulp.src('./src/index.html')
//        .pipe(rev())
//        .pipe(gulp.dest('../'));
//});

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
gulp.task('default', ['watch','compass','script','html','lib'], function () {
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