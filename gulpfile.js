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
                dom: 'src/co-modules/js/base/dom/',
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
gulp.task('cleanCo', function(cb) {
    gulp.src([paths.co.root], { read:false })
        .pipe(clean())
        .on('finish', function () {
                cb();
        });
});  

//co脚本处理
gulp.task('co-scripts', function (cb) {
    gulp.src(co.jsFiles)  //要合并的文件
        .pipe(concat(co.filename +".js"))  // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.co.scripts))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.co.scripts))
        .on('finish', function () {
                cb();
        });
});

//dom处理
gulp.task('co-dom', function (cb) {
    gulp.src(paths.source.dom+'*')  //要合并的文件
        .pipe(gulp.dest(paths.co.scripts))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.co.scripts))
        .on('finish', function () {
                cb();
        });
});

//libs处理
gulp.task('co-libs',function(cb){
    gulp.src(paths.source.libs+'*')
        .pipe(gulp.dest(paths.co.libs))
        .on('finish', function () {
                cb();
        });
});

//ui处理
gulp.task('co-ui', function(cb){
    gulp.src(paths.source.ui+'**/*.*')
        .pipe(gulp.dest(paths.co.ui))
        .on('finish', function () {
                cb();
        });
});

// co样式处理
gulp.task('co-css',function (cb) {
    gulp.src('src/co-modules/less/co.less')
        .pipe(less())
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(gulp.dest(paths.co.styles))
        .on('finish', function () {
                cb();
        });
});

//co图片处理
gulp.task('co-img',function(cb){
    gulp.src(paths.source.root + 'img/*.*')
        .pipe(gulp.dest(paths.co.root + 'img/'))
        .on('finish', function () {
                cb();
        });
});

//co字体处理
gulp.task('co-font',function(cb){
    gulp.src(paths.source.root + 'fonts/*.*')
        .pipe(gulp.dest(paths.co.root + 'fonts/'))
        .on('finish', function () {
                cb();
        });
});

//co处理
gulp.task('build-co', gulp.series('cleanCo', 'co-scripts','co-dom', 'co-libs', 'co-ui', 'co-css', 'co-img', 'co-font'));

// 清空dist样式
gulp.task('cleanDist', function(cb) {
    gulp.src([paths.dist.root], { read:false })
        .pipe(clean())
        .on('finish', function () {
                cb();
        });
}); 

// dist样式处理
gulp.task('dist-css',function (cb) {
    gulp.src('src/co-modules/less/co.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(livereload())
        .on('end', function () {
                cb();
        });
});

//dist图片处理
gulp.task('dist-img',function(cb){
    gulp.src(paths.source.root + 'img/*.*')
        .pipe(gulp.dest(paths.dist.root + 'img/'))
        .on('finish', function () {
                cb();
        });
});

//dist字体处理错误: 没有找到进程 "node.exe"。
gulp.task('dist-font',function(cb){
    gulp.src(paths.source.root + 'fonts/*.*')
        .pipe(gulp.dest(paths.dist.root + 'fonts/'))
        .on('finish', function () {
                cb();
        });
});

// 样式处理
gulp.task('dist-styles', gulp.series('cleanDist', 'dist-css', 'dist-img', 'dist-font'));


//libs处理
gulp.task('dist-libs',function(cb){
    gulp.src(paths.source.libs+'*')
        .pipe(gulp.dest(paths.dist.libs))
        .on('end', function () {
                cb();
        });
});

// ui处理
gulp.task('dist-ui',function(cb){
    gulp.src(paths.source.ui+'**/*.*')
        .pipe(gulp.dest(paths.dist.ui))
        .on('end', function () {
                cb();
        });
});

// js处理
gulp.task('dist-scripts', function (cb) {
    gulp.src(co.jsFiles)  //要合并的文件
        .pipe(concat(co.filename +".js"))  // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(livereload())
        .on('end', function () {
                cb();
        });
});

// dom处理
gulp.task('dist-dom', function (cb) {
    gulp.src(paths.source.dom+'*')  //要合并的文件
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(livereload())
        .on('end', function () {
                cb();
        });
});

gulp.task('build-dist', gulp.series('dist-styles', gulp.series( 'dist-libs', 'dist-ui', 'dist-scripts','dist-dom')));

// 清空图片、样式、js
gulp.task('cleanExamples', function(cb) {
    gulp.src([paths.examples.root], { read:false })
        .pipe(clean())
        .on('finish', function () {
                cb();
        });
});      

//examples处理
gulp.task('examples',function(cb){
    gulp.src(paths.source.examples+'**/*.*')
        .pipe(gulp.dest(paths.examples.root))
        .on('end', function () {
                cb();
        });
});

gulp.task('build-examples', gulp.series('cleanExamples', 'examples'));

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('build', gulp.series('build-co','build-dist','build-examples'));


/* =================================
    Watch
================================= */
// 清空dist样式
gulp.task('cleanDs', function(cb) {
    gulp.src([paths.dist.styles], { read:false })
        .pipe(clean())
        .on('finish', function () {
                cb();
        });
}); 

// 清空dist脚本
gulp.task('cleanDj', function(cb) {
    gulp.src([paths.dist.scripts], { read:false })
        .pipe(clean())
        .on('finish', function () {
                cb();
        });
}); 

gulp.task('watch', function (cb) {
    var server = livereload();  
    livereload.listen();  
    var watcher = gulp.watch(paths.source.examples+'**/*.*');
    watcher.on('change',function(file){
        var ex = file.path.indexOf('examples');
        var next = file.path.substr(ex+9).indexOf('\\');
        var destPaht = paths.examples.root;
        if(next!=-1){
            destPaht = destPaht + file.path.substring(ex+9,ex+9+next+1);
        }
        gulp.src(file.path)
            .pipe(gulp.dest(paths.examples.root))
            .pipe(livereload());
    })
    gulp.watch(paths.source.styles + '*.less',gulp.series('dist-css'));
    gulp.watch(paths.source.scripts+'**/*.*', gulp.series('dist-libs', 'dist-ui', 'dist-scripts'));
    
    cb();
});



gulp.task('connect', function (cb) {
    connect.server({
        root: [ paths.root ],
        port:'3000'
    });
    cb();
});
    
gulp.task('open', function (cb) {
    gulp.src(paths.examples.index).pipe(open('', { url: 'http://localhost:3000/'+paths.examples.index}));
    cb();
});

gulp.task('default', gulp.series('build', 'connect','open','watch'));