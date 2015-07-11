var gulp = require('gulp'), //基础库
	concat = require('gulp-concat'),//合并文件
	connect = require('gulp-connect'),
    less = require('gulp-less'), //less解析
    minifycss = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检查
    uglify  = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'),  //重命名
    clean = require('gulp-clean'),   //清空文件夹
    open = require('gulp-open'),
    livereload = require('gulp-livereload');   //livereload
	paths = {
            root: './',
            dist: {
                root: 'dist/',
                styles: 'dist/css/',
                scripts: 'dist/js/',
                libs: 'dist/js/libs/',
                ui: 'dist/js/ui/'
            },
            co: {
                root: 'co/',
                styles: 'co/css/',
                scripts: 'co/',
                libs: 'co/libs/',
                ui: 'co/ui/'
            },
            source: {
                root: 'src/co-modules/',
                styles: 'src/co-modules/less/',
                scripts: 'src/co-modules/js/',
                libs: 'src/co-modules/js/libs/',
                ui: 'src/co-modules/js/ui/',
                examples:'src/examples/'
            }
            ,
            examples: {
                root: 'examples/',
                index: 'examples/index.html'
            }
        },
        co = {
            filename: 'co',
            jsFiles: [
                'src/co-modules/js/base/zepto/zepto.js',
                'src/co-modules/js/base/zepto/plugins/event.js',
                'src/co-modules/js/base/zepto/plugins/ajax.js',
                'src/co-modules/js/base/zepto/plugins/form.js',
                'src/co-modules/js/base/zepto/plugins/fx.js',
                'src/co-modules/js/base/zepto/plugins/fx_methods.js',
                'src/co-modules/js/base/zepto/plugins/data.js',
                'src/co-modules/js/base/zepto/plugins/deferred.js',
                'src/co-modules/js/base/zepto/plugins/callbacks.js',
                'src/co-modules/js/base/zepto/plugins/selector.js',
                'src/co-modules/js/base/zepto/plugins/stack.js',
                'src/co-modules/js/base/zepto/plugins/highlight.js',
                'src/co-modules/js/base/zepto/plugins/detect.js',
                'src/co-modules/js/base/zepto/plugins/touch.js',
                'src/co-modules/js/base/zepto/plugins/matchMedia.js',
                'src/co-modules/js/base/zepto/plugins/ex-ortchange.js',
                'src/co-modules/js/base/sea.js',
                'src/co-modules/js/base/config.js',
                'src/co-modules/js/wrap-start.js',
                'src/co-modules/js/co.js',
                'src/co-modules/js/native.js',
                'src/co-modules/js/$extend.js',
                'src/co-modules/js/$fn_extend.js',
                'src/co-modules/js/wrap-end.js'
            ],
            lessFiles:[
                'src/co-modules/less/dialog.less',
                'src/co-modules/less/list.less',
                'src/co-modules/less/slider.less'
            ]
        };

// 清空co
gulp.task('cleanCo', function() {
    return gulp.src([paths.co.root], { read:false })
                .pipe(clean());
});  

//co脚本处理
gulp.task('co-scripts',['cleanCo'], function () {
    gulp.src(co.jsFiles)  //要合并的文件
        .pipe(concat(co.filename +".js"))  // 合并匹配到的js文件
        .pipe(gulp.dest(paths.co.scripts))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.co.scripts));
});

//libs处理
gulp.task('co-libs',['co-scripts'],function(){
    gulp.src(paths.source.libs+'*')
        .pipe(gulp.dest(paths.co.libs));
});

//ui处理
gulp.task('co-ui', ['co-libs'],function(){
    gulp.src(paths.source.ui+'**/*.*')
        .pipe(gulp.dest(paths.co.ui));
});

// co样式处理
gulp.task('co-css',['co-ui'],function () {
    gulp.src('src/co-modules/less/co.less')
        .pipe(less())
        .pipe(gulp.dest(paths.co.styles))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(gulp.dest(paths.co.styles))
});

//co图片处理
gulp.task('co-img',['co-css'],function(){
    gulp.src(paths.source.root + 'img/*.*')
        .pipe(gulp.dest(paths.co.root + 'img/'));
});

//co字体处理
gulp.task('co-font',['co-img'],function(){
    gulp.src(paths.source.root + 'fonts/*.*')
        .pipe(gulp.dest(paths.co.root + 'fonts/'));    
});

//co处理
gulp.task('buildCo',['co-font']);


// 清空dist样式
gulp.task('cleanDs', function() {
    return gulp.src([paths.dist.styles], { read:false })
                .pipe(clean());
}); 

// dist样式处理
gulp.task('dist-css', ['cleanDs'],function () {
    gulp.src('src/co-modules/less/co.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(livereload());
});

//dist图片处理
gulp.task('dist-img',function(){
    gulp.src(paths.source.root + 'img/*.*')
        .pipe(gulp.dest(paths.dist.root + 'img/'));
});

//dist字体处理
gulp.task('dist-font',function(){
    gulp.src(paths.source.root + 'fonts/*.*')
        .pipe(gulp.dest(paths.dist.root + 'fonts/'));
});

// 样式处理
gulp.task('dist-styles', ['dist-css','dist-img','dist-font']);

// 清空dist脚本
gulp.task('cleanDj', function() {
    return gulp.src([paths.dist.scripts], { read:false })
                .pipe(clean());
}); 

//libs处理
gulp.task('dist-libs',['cleanDj'],function(){
    gulp.src(paths.source.libs+'*')
        .pipe(gulp.dest(paths.dist.libs))
        .pipe(livereload());
});

//ui处理
gulp.task('dist-ui', ['dist-libs'],function(){
    gulp.src(paths.source.ui+'**/*.*')
        .pipe(gulp.dest(paths.dist.ui))
        .pipe(livereload());
});

//js处理
gulp.task('dist-scripts',['dist-ui'], function () {
    gulp.src(co.jsFiles)  //要合并的文件
        .pipe(concat(co.filename +".js"))  // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(livereload());
});

// 清空图片、样式、js
gulp.task('cleanExamples', function() {
    return gulp.src([paths.examples.root], { read:false })
                .pipe(clean());
});      

//examples处理
gulp.task('examples',['cleanExamples'],function(){
    gulp.src(paths.source.examples+'**/*.*')
        .pipe(gulp.dest(paths.examples.root))
        .pipe(livereload());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('build', function(){
    return gulp.start('buildCo','dist-scripts','dist-styles','examples');
});


/* =================================
    Watch
================================= */
gulp.task('watch', function () {
    livereload.listen();  
    var server = livereload();  
    //styles and scripts
    gulp.watch(paths.source.styles + '*.less', [ 'dist-styles' ],function(event){
        server.changed(event.path+'-->'+event.type); //变化的文件的路径
    });
    gulp.watch(paths.source.scripts+'**/*.*', [ 'dist-scripts' ],function(event){
        server.changed(event.path+'-->'+event.type); //变化的文件的路径
    });
    gulp.watch(paths.source.examples+'**/*.*',[ 'examples' ],function(event){
        server.changed(event.path+'-->'+event.type); //变化的文件的路径
    });
});



gulp.task('connect', function () {
    return connect.server({
            root: [ paths.root ],
            livereload: true,
            port:'3000'
    });
});
    
gulp.task('open', function () {
    return gulp.src(paths.examples.index).pipe(open('', { url: 'http://localhost:3000/'+paths.examples.index}));
});

gulp.task('server', ['build'], function(){
    // gulp.start('watch');
    gulp.start('connect', 'open','watch');
});

gulp.task('default', [ 'server' ]);