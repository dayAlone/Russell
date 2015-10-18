import config from 'config';
import gulp from 'gulp';
import webpack from 'webpack-stream';
import configWebpack from '../webpack/production';
import through from 'through2';
import runSequence from 'run-sequence'
import co from 'co';
import selectel from 'selectel-manager';
import fs from 'fs';
import chalk from 'chalk';
const gp = require('gulp-load-plugins')();
const { svgmin, replace, imageOptimization } = gp;
let { source, tmp } = config.folders;

gulp.task('svg_mini', () => {
    return gulp.src([`${source}/images/svg/**/*.svg`])
    .pipe(svgmin([
        { moveGroupAttrsToElems: false },
        { removeUselessStrokeAndFill: false },
        { cleanupIDs: false },
        { removeComments: true },
        { moveGroupAttrsToElems: false },
        { convertPathData: { straightCurves: false } }
    ]))
    .pipe(replace(/<desc>(.*)<\/desc>/ig, ''))
    .pipe(replace(/<title>(.*)<\/title>/ig, ''))
    .pipe(gulp.dest(`${tmp}/images/svg/`));
});

gulp.task('img_mini', () => {
    return gulp.src([ `${source}/images/**/*.jpg`, `${source}/images/**/*.png`, `${source}/images/**/*.gif` ])
    .pipe(imageOptimization({
        optimizationLevel: 1,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest(`${tmp}/images/`));
});

gulp.task('images', () => {
    return runSequence('svg_mini', 'img_mini');
});

gulp.task('fonts', () => {
    return gulp.src([ `${source}/fonts/**/*.*` ])
    .pipe(gulp.dest(`${tmp}/fonts/`));
});

gulp.task('scripts', () => {
    return gulp.src([ `${source}/js/**/*.js` ])
    .pipe(webpack(configWebpack))
    .pipe(gulp.dest(`${tmp}/js/${config.version}`));
});


gulp.task('upload', () => {
    let isAuth = false;
    let folders = {};
    return gulp.src(
            [ `${tmp}/js/**`, `${tmp}/images/**`, `${tmp}/fonts/**` ],
            { base: '.', buffer: false }
        )
        .pipe(through.obj((file, enc, cb) => {
            return co(function*() {
                if (!isAuth) {
                    isAuth = yield new Promise((fulfill, reject) => {
                        selectel.authorize(config.selectel.login, config.selectel.password, (err) => {
                            if (err) reject(err);
                            fulfill(true)
                        })
                    });
                }
                let uploadPath = file.path.replace(config.__dirname + '/', '');
                let pathInfo = fs.lstatSync(file.path);
                if (pathInfo.isDirectory()) {
                    let result = yield new Promise((fulfill, reject) => {
                        selectel.getContainerFiles('russell', (err, data) => {
                            if (err) reject(err);
                            fulfill(data)
                        }, {
                            format: 'json',
                            path: uploadPath

                        })
                    });
                    JSON.parse(result.files).map(el => {
                        folders[el.name] = {
                            bites: el.bytes,
                            hash: el.hash
                        }
                    });
                } else if (fs.lstatSync(file.path).isFile()) {
                    if (!folders[uploadPath] || pathInfo.size !== folders[uploadPath].bites) {
                        yield new Promise((fulfill, reject) => {
                            selectel.uploadFile(file.path, 'russell/' + uploadPath, (err, data) => {
                                if (err) reject(err);
                                fulfill(data)
                            })
                        });
                        console.log(`  ${chalk.green('-->')} ${chalk.bold(uploadPath)} ${chalk.gray('uploaded')}`);
                    }
                }
                cb()
            }).catch(err=>(console.error(err)))

        }));
});

gulp.task('build', () => {
    runSequence('scripts', 'images', 'fonts', 'upload');
});
