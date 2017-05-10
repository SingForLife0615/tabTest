//引入webpack
var webpack = require('gulp-webpack');

//引入webpack相关
var webpackConfig = require('./webpack.config');

var gulp = require('gulp');

var gulpLoadPlugins = require('gulp-load-plugins');

//用于构建任务
var runSequence = require('run-Sequence');

//用于配置启动项
var browserSync = require('browser-sync');

//用于删除文件任务
var del = require('del');

var browserify = require('browserify');

var watchify = require('watchify');

var source = require('vinyl-source-stream');

var buffer = require('vinyl-buffer');

var autoprefixer = require('autoprefixer');

var $ = gulpLoadPlugins();

var reload = browserSync.reload;

var isProduction = process.env.NODE_ENV === 'production';

const paths = {
  dist: {
    base: 'dist',
    js: 'dist/js',
    css: 'dist/css',
    i: 'dist/i',
    fonts: 'dist/fonts'
  }
};

const AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 2.3',
  'bb >= 10'
];

//webpack任务
gulp.task("webpack", function () {
  return gulp
    .src('./')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./dist/js'));
});


//每一次运行时候删除旧的打包文件
gulp.task('clean', function () {
  return del(['dist/*', '!dist/.git'], {dot: true});
});


// 拷贝相关资源
gulp.task('copy', function () {
  return gulp.src([
    'app/*',
    '!app/*.html',
    '!app/js',
    '!app/less',
    '!app/i',
    'node_modules/amazeui/dist/css/amazeui.min.css',
    'node_modules/amazeui/dist/fonts/*',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery.cookie/jquery.cookie.js'

  ], {
    dot: true
  }).pipe(gulp.dest(function (file) {
      var filePath = file.path.toLowerCase();
      if (filePath.indexOf('.css') > -1) {
        return paths.dist.css;
      } else if (filePath.indexOf('fontawesome') > -1) {
        return paths.dist.fonts;
      } else if (filePath.indexOf('.js') > -1) {
        return paths.dist.js;
      }
      return paths.dist.base;
    }))
    .pipe($.size({title: 'copy'}));
});

// 编译 Less，添加浏览器前缀
gulp.task('styles', function () {
  return gulp.src(['app/less/style.less'])
    .pipe($.less())
    .pipe($.postcss([autoprefixer({browsers: AUTOPREFIXER_BROWSERS})]))
    .pipe(gulp.dest('dist/css'))
    .pipe($.csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'))
    .pipe($.size({title: 'styles'}));
});

// 压缩 HTML
gulp.task('html', function () {
  return gulp.src('app/**/*.html')
    .pipe($.minifyHtml())
    .pipe($.replace(/\{\{__VERSION__\}\}/g, isProduction ? '.min' : ''))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});


//构建任务
/*
 *  clean:清除已存在的文件
 *  styles用于编译less,增加浏览器前缀,压缩
 *  压缩html页面
 *  webpack任务用于解析React和打包js文件
 *  copy用于将所有代码 拷贝到dist文件里
 *
 * */
gulp.task('build', function (cb) {
  runSequence('clean', ['styles', 'html', 'copy', 'webpack'], cb);
});

//监听源文件变化
gulp.task('watch', function () {
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/**/*.less', ['styles']);
  gulp.watch('app/**/*.js',['webpack']);

});


//默认任务
gulp.task('default', ['build', 'watch'], function () {
  browserSync({
    notify: false,
    logPrefix: 'ASK',
    server:'dist'
  });
  gulp.watch(['dist/**/*'], reload);
});