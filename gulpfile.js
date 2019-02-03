var gulp         = require('gulp'),
	watch        = require('gulp-watch'),
	rename       = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify       = require('gulp-uglify'),
	sass         = require('gulp-sass'),
	sourcemaps   = require('gulp-sourcemaps'),
	rigger       = require('gulp-rigger'),
	cssmin       = require('gulp-minify-css'),
	imagemin     = require('gulp-imagemin'),
	// spritesmith  = require('gulp.spritesmith'),
	browserSync  = require('browser-sync'),
	rimraf       = require('gulp-rimraf'),
	pug          = require('gulp-pug'),
	plumber      = require('gulp-plumber'),
	include      = require('gulp-include');

var path = {
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { 
        html: 'src/pug/*.pug', 
        js: 'src/js/main.js',
        style: 'src/sass/main.sass',
        img: 'src/img/*.*', 
        fonts: 'src/fonts/*.*'
    },
    watch: { 
        html: 'src/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.sass',
        img: 'src/img/*.*',
        fonts: 'src/fonts/*.*'
    },
    clean: './build'
};


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
    });
     gulp.watch('build/**/*').on('change', browserSync.reload);
});

// HTML
gulp.task('html', function(){
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(pug({
            pretty: true
        }))
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({stream: true}))
});

//CSS
gulp.task('css', function(){
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename({
			basename: 'styles',
			extname: ".css"
		}))
		.pipe(gulp.dest(path.build.css))
});

// COMPRESSED CSS
gulp.task('min-css', ['css'], function(){
	return gulp.src(path.build.css + 'styles.css')
		.pipe(plumber())
		.pipe(cssmin())
		.pipe(rename({
			basename: 'styles',
			suffix: '.min',
			extname: ".css"
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
});

//JS
gulp.task('js', function(){
	// clear(path.build.js);
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		// .pipe(sourcemaps.init())
		.pipe(uglify()) // сжимаем
		.pipe(rename({
			basename: 'scripts',
			suffix: '.min',
			extname: ".js"
		})) 
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({stream: true}))
});

//SPRITE SMITH
// gulp.task('sprite', function () {
//   var spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
//     imgName: 'sprite.png',
//     cssName: 'sprite.sass'
//   }));
//   return spriteData.pipe(gulp.dest('src/img/sprites/'));
// });

gulp.task('img', function(){
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.reload({stream: true}))
});

// IMG MIN
gulp.task('min-img', function(){
	return gulp.src(path.src.img)
		.pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({
		        plugins: [
		            {removeViewBox: true},
		            {cleanupIDs: false}
		        ]
		    })
		]))
		.pipe(gulp.dest(path.build.img))
});


gulp.task('fonts', function(){
	// clear(path.build.fonts);
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browserSync.reload({stream: true}))
});


gulp.task('build', [
	'html',
	'min-css',
	'fonts',
	'img',
	'js'
]);

gulp.task('clear', function(cb) {
 	rimraf(path.clean, cb);
});

gulp.task('watch', ['browser-sync'], function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html');
	})
	watch([path.watch.img], function(event, cb) {
		gulp.start('img');
	})
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts');
	})
	watch([path.watch.style], function(event, cb) {
		gulp.start('min-css');
	})
	watch([path.watch.js], function(event, cb) {
		gulp.start('js');
	})
});

gulp.task('default', ['build', 'watch', 'browser-sync']);

