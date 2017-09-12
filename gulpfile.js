var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    path = require('path'),
    gutil = require('gulp-util'),
    clean = require('del');


// Compile ES6 to ES5
gulp.task("default", () => {
    clean('build/*');

    return gulp
        .src([
            'src/**/*.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            stage: 0,
            blacklist: ['strict'],
            optional: ['runtime', 'asyncToGenerator'],
            loose: true
        }))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: function(file) {
                return path.relative(file.path, __dirname + '/src' ) + '/src';
            }
        }))
        .pipe(gulp.dest('build'));
});