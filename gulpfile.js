const pify = require('pify');
const fs = require('fs-jetpack');
const path = require('path');
const loadJsonFile = require('load-json-file');
const inline = pify(require('inline-source'));
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const cssnext = require('postcss-cssnext');
const browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');
// var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js')

let cache;


const nunjucks = require('nunjucks');
const del = require('del');
nunjucks.configure('views', {
  noCache: true,
  watch: false,
  tags: {
    commentStart: '<#',
    commentEnd: '#>'
  }
});
const render = pify(nunjucks.render);

process.env.NODE_ENV = "development"
gulp.task('prod', () => {
  return Promise.resolve(process.env.NODE_ENV = 'production');
});

gulp.task('dev', () => {
  return Promise.resolve(process.env.NODE_ENV = 'development');
});
  /**
 * 读出数据之后接着循环，再return出promise对象，其实resolve就是promise对象
   读出对象，把对象render到页面中，渲染并读出需要模板、路径名、渲染页面中的data
   如果css和js文件不一样，继续在json中添加元素
 */ 
gulp.task('build-page', () => {
  
  const destDir = '.tmp';
  const pathDetail = loadJsonFile('views/data/path-detail.json');

  return pathDetail.then(data => {
    const demos = data.demos;
    return Promise.all(demos.map((demo) => {
      return renderPerView(demo);
    }))
  })
  .then(() => {
      console.log('inline--'+process.env.NODE_ENV)
      browserSync.reload('*.html');
    })
    .catch(err => {
      console.log(err);
    });

 
  async function renderPerView(demo){
    const env = {
      isProduction: process.env.NODE_ENV === 'production'
    };
    
    const name = demo.name;
    const template = demo.template;
    const dataPath = demo.data;

      return loadJsonFile(dataPath)
      .then(data => {
        
        if (name ==='index'){
          return render(template, {
            products: data.index,
            env
          });
        }else{
          return render(template, {
            env
          });
        }
        
      })
      .then(html => {  
        // 此处是development  
        if (process.env.NODE_ENV === 'production') {
          return inline(html, {
            compress: true,
            rootpath: path.resolve(process.cwd(), '.tmp')
          });
        }    
        return html;
        })
        .then(html => {
          const destFile = path.resolve(destDir, `${name}.html`);
          return fs.writeAsync(destFile, html);
      })


  }
  
});


gulp.task('styles', function styles() {
  const DEST = '.tmp/styles';
  return gulp.src(['client/styles/*.scss'])
    .pipe($.changed(DEST))
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      cssnext({
        features: {
          colorRgba: false
        }
      })
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream());
});


gulp.task('jshint', function () {
  return gulp.src('client/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('scripts', () => {
  return gulp.src('index.js')
    .pipe($.plumber())  //自动处理全部错误信息防止因为错误而导致 watch 不正常工作
    .pipe($.sourcemaps.init({loadMaps:true})) 
    .pipe($.babel())
    .pipe(webpack(webpackConfig))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(browserSync.reload({stream: true}));
});





gulp.task('comJs', () => {
  return gulp.src('.tmp/scripts/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('.tmp/scripts/'));
});
gulp.task('comCss', () => {
  return gulp.src('.tmp/styles/*.css')
    .pipe($.cssnano())
    .pipe(gulp.dest('.tmp/styles/'));
});


gulp.task('clean', () => {
  return del(['.tmp/**','.dest/**']);
});

gulp.task('jshint', function () {
  return gulp.src('client/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});


gulp.task('serve', gulp.parallel('build-page', 'styles', 'scripts', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      index: 'index.html',
      directory: true,
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['views/*.{html,json}'], 
    gulp.parallel('build-page')
  );

  gulp.watch(['client/**/*.scss'],
    gulp.parallel('styles')
  );

  gulp.watch(['client/**/*.js'],
    gulp.parallel('scripts')
  );

  gulp.watch(['/*.js'],
    gulp.parallel('scripts')
  );

}));

gulp.task('build', gulp.series('prod','clean','styles', 'scripts', 'build-page','comJs','comCss', 'dev'));

const destDir = 'dev_www/frontend/tpl/next/html';


gulp.task('copy:prod', () => {
  const src = path.resolve(__dirname, '.tmp/index.html');
  const dest = path.resolve(__dirname, `../${destDir}`);
  console.log(`Copy index.html to ${dest}`);
  return gulp.src(src)
    .pipe($.rename('membership.html'))
    .pipe(gulp.dest(dest));  
});


gulp.task('deploy', gulp.series('build', 'copy:prod'));



gulp.task('copy', () => {
  const dest = 'ftac';
  return gulp.src(['.tmp/subscription.html'])
    .pipe(gulp.dest(`../${dest}`))
});



