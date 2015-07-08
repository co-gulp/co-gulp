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
                scripts: 'co/js/',
                libs: 'co/js/libs/',
                ui: 'co/js/ui/'
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
// 清空样式
gulp.task('cleanStyles', function() {
    return gulp.src([paths.dist.styles,paths.co.styles], { read:false })
                .pipe(clean());
});   

// 清空js
gulp.task('cleanJs', function() {
    return gulp.src([paths.dist.scripts,paths.co.scripts], { read:false })
                .pipe(clean());
}); 

// 清空图片、样式、js
gulp.task('cleanExamples', function() {
    return gulp.src([paths.examples.root], { read:false })
                .pipe(clean());
});      

// css处理
gulp.task('css', ['cleanStyles'],function () {
    gulp.src('src/co-modules/less/co.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(gulp.dest(paths.co.styles))
        .pipe(livereload());
});

//img处理
gulp.task('buildimg',function(){
    gulp.src(paths.source.root + 'img/*.*')
        .pipe(gulp.dest(paths.dist.root + 'img/'))
        .pipe(gulp.dest(paths.co.root + 'img/'));
    gulp.src(paths.source.root + 'fonts/*.*')
        .pipe(gulp.dest(paths.dist.root + 'fonts/'))
        .pipe(gulp.dest(paths.co.root + 'fonts/'));    
});

// 样式处理
gulp.task('styles', ['css','buildimg'],function () {
});



//libs处理
gulp.task('buildlib',['cleanJs'],function(){
    gulp.src(paths.source.libs+'*')
        .pipe(gulp.dest(paths.dist.libs))
        .pipe(gulp.dest(paths.co.libs))
        .pipe(livereload());
});

//ui处理
gulp.task('buildui', ['buildlib'],function(){
    gulp.src(paths.source.ui+'**/*.*')
        .pipe(gulp.dest(paths.dist.ui))
        .pipe(gulp.dest(paths.co.ui))
        .pipe(livereload());
});

//js处理
gulp.task('scripts',['buildui'], function () {
    gulp.src(co.jsFiles)  //要合并的文件
        .pipe(concat(co.filename +".js"))  // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(gulp.dest(paths.co.scripts))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(gulp.dest(paths.co.scripts))
        .pipe(livereload());
});

//examples处理
gulp.task('examples',['cleanExamples'],function(){
    gulp.src(paths.source.examples+'**/*.*')
        .pipe(gulp.dest(paths.examples.root))
        .pipe(livereload());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('build', function(){
    return gulp.start('styles','scripts','examples');
});

/* =================================
    Watch
================================= */
gulp.task('watch', function () {
    livereload.listen();  
    var server = livereload();  
    //styles and scripts
    gulp.watch(paths.source.styles + '*.less', [ 'css' ],function(event){
        server.changed(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
        server.changed(event.path); //变化的文件的路径
    });
    gulp.watch(paths.source.scripts+'**/*.*', [ 'scripts' ],function(event){
        server.changed(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
        server.changed(event.path); //变化的文件的路径
    });
    gulp.watch(paths.source.examples+'**/*.*',[ 'examples' ],function(event){
        server.changed(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
        server.changed(event.path); //变化的文件的路径
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