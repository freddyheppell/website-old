var gulp = require('gulp'),
    shell = require('gulp-shell'),
    postcss = require('gulp-postcss'),
    uncss = require('postcss-uncss')
    cssnano = require('cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    glob = require('glob');

function jekyll() {
    return gulp.src('index.html', { read: false })
        .pipe(shell([
            'jekyll build'
        ]));
}    

function css() {

    var plugins = [
        uncss({
            html: ['_site/**/*.html'],
            ignore: ['.home-text svg']
        }),
        cssnano
    ];

    return gulp.src('_site/assets/css/styles.css')
       .pipe(autoprefixer())
       .pipe(postcss(plugins))
       .pipe(gulp.dest('_site/assets/css'));
}

exports.jekyll = jekyll;
exports.css = css;
exports.default = gulp.series(jekyll, css);