var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var notify = require('gulp-notify');
var mqpacker = require("css-mqpacker");
var config = require('../config');
var cssnano = require('cssnano');


gulp.task('sass', function() {

    var processors = [
        autoprefixer({browsers: ['last 10 versions', 'IE 11'], cascade: false}),
        mqpacker({
            sort: function (a, b) {
                a = a.replace(/\D/g,'');
                b = b.replace(/\D/g,'');
                return b-a;
                // replace this with a-b for Mobile First approach
            }
        }),
        cssnano(),
    ];

    return gulp.src(config.src.sass+'*.sass')
    //.pipe(sourcemaps.init())
    .pipe(sass().on('error', notify.onError({
            title: 'Sass Error!',
            message: '<%= error.message %>'
        })))
    .pipe(postcss(processors))
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest.css));
});

gulp.task('sass:watch', function() {
    gulp.watch(config.src.sass + '/**/*', ['sass']);
});