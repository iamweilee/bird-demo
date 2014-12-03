/**
 * 该文件用来构建业务模块的代码
 */
module.exports = function(grunt) {

  var mockEnable = true;
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    transport: {
      options: {
        debug: false
      },
      expand: {
        files: [{
          expand: true,
          cwd: 'biz/',
          src: ['**/*.js', '!biz*'],
          dest: 'output/tmp/biz'
        }]
      },
    },
    concat: {
      options: {
        banner: '/**\n * @file: biz.js\n'
              + ' * @author: <%= pkg.author %>\n'
              + ' * @date: <%= grunt.template.today("yyyy-mm-dd") %>\n'
              + ' */\n',
        separator: '\n'
      },
      biz: {
        src: ['output/tmp/biz/**'],
        dest: 'output/biz/biz.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! biz.min.js <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true/*,
        sourceMapName: './biz/biz.min.js.map'*/
      },
      biz: {
        files: [{
          src: ['output/biz/biz.js'],
          dest: 'output/biz/biz.min.js'
        }]
      }
    },
    clean: {
      output: ['output'],
      tmp: ['output/tmp']
    },
    less: {
      all: {
        /*options: {
          paths: ["asset"],
          cleancss: true
        },*/
        files: {
          "output/asset/all.css": "asset/all.less"
        }
      }
    },
    copy: {
      root: {
        files: [
          {expand: true, src: ['app.js', 'index.html'], dest: 'output/', filter: 'isFile'}
        ]
      },
      dep: {
        files: [
          {expand: true, src: ['dep/**'], dest: 'output/'}
        ]
      },
      asset: {
        files: [
          {expand: true, src: ['asset/font/**', 'asset/img/**'], dest: 'output/'}
        ]
      },
      tpl: {
        files: [
          {expand: true, src: ['biz/**/*.html'], dest: 'output/'}
        ]
      },
      biz: {
        files: [
          {expand: true, src: ['biz/*'], dest: 'output/', filter: 'isFile'}
        ]
      },
      moduleConfig: {
        src: 'moduleConfig.js',
        dest: 'output/moduleConfig.js',
        options: {
          process: function (content, srcpath) {
            content = content.replace(/\/\/begin(.|\n|\r)+\/\/end/, '');
            return content;
          }
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 80,
          base: './output',
          //keepalive: true,//一旦开启, 就不会启动后面的watch
          hostname: "127.0.0.1",
          middleware: function(connect, options, middlewares) {
            var fs = require('fs');
            //var urlHelper = require('url');
            // inject a custom middleware into the array of default middlewares
            middlewares.unshift(function(req, res, next) {
              if (!mockEnable || !/\/api\//.test(req.url)) {
                return next();
              }

              //var param = urlHelper.parse(req.url, true).query;

              //console.log(req.url);

              var arr = req.url.split('?');
              var url = arr && arr[0];
              url = url.replace(/^\/api/, '/mockup');
              var method = req.method.toUpperCase();
              if('GET' === method) {
                if(/\/\d+$/.test(url)) {
                  url = url.replace(/\/\d+$/, '/detail.json');
                }else{
                  url += (/\/$/.test(url) ? '' : '/') + 'list.json';
                }
              }else if('POST' === method) {
                url += (/\/$/.test(url) ? '' : '/') + 'create.json';
              }else if('PUT' === method || 'PATCH' === method) {
                url = url.replace(/\/\d+$/, '');
                url += (/\/$/.test(url) ? '' : '/') + 'update.json';
              }else if('DELETE' === method) {
                url = url.replace(/\/\d+$/, '');
                url += (/\/$/.test(url) ? '' : '/') + 'delete.json';
              }

              var text = fs.readFileSync('.' + url, 'utf8');
              text = text.replace(/\/\*(.|\n|\r)+\*\/?/,'');//注释删除多行
              text = text.replace(/\/\/.+/,'');//删除单行注释

              //var json = JSON.parse(text);
              //res.setHeader("Content-Type", "application/json");

              res.end(text);
            });

            return middlewares;
          }
        }
      }
    },
    watch: {
      js: {
        files: ['biz/**/*.js', '!biz/biz*'],
        tasks: ['copy:biz', 'transport', 'concat', 'clean:tmp' ,'uglify']
      },
      css: {
        files: ['biz/**/*.less', 'asset/*.less'],
        tasks: ['less']
      },
      asset: {
        files: ['asset/img/**', 'asset/font/**'],
        tasks: ['copy:asset']
      },
      moduleConfig: {
        files: 'moduleConfig.js',
        tasks: ['copy:moduleConfig']
      },
      dep: {
        files: 'dep/**',
        tasks: ['copy:dep']
      },
      root: {
        files: ['index.html', 'app.js'],
        tasks: ['copy:root']
      },
      tpl: {
        files: ['biz/**/*.html'],
        tasks: ['copy:tpl']
      }
    }
  });

  //启动监听命令: grunt watch --force
  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  // Load custom task
  //grunt.loadTasks('grunt');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'less', 'transport', 'concat', 'clean:tmp', 'uglify', 'connect', 'watch']);
};