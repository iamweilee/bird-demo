/**
 * 该文件用来构建业务模块的代码
 */
module.exports = function(grunt) {

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
          src: ['**/*.js'],
          dest: 'tmp/biz'
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
      bird: {
        src: ['tmp/biz/**'],
        dest: 'biz/biz.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! biz.min.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      bird: {
        files: [{
          src: ['biz/biz.js'],
          dest: 'biz/biz.min.js'
        }]
      }
    },
    clean: ['tmp', 'asset/css/all.css', 'biz/biz*.js', 'moduleConfig.product.js'],
    less: {
      all: {
        /*options: {
          paths: ["asset"],
          cleancss: true
        },*/
        files: {
          "asset/css/all.css": "asset/css/all.less"
        }
      }
    },
    copy: {
      moduleConfig: {
        src: 'moduleConfig.js',
        dest: 'moduleConfig.product.js',
        options: {
          process: function (content, srcpath) {
            content = content.replace(/\/\/begin/g, '/*//begin');
            content = content.replace(/\/\/end/g, '//end*/');
            return content;
          }
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: '.',
          keepalive: true,
          hostname: "127.0.0.1"
        }
      }
    }
  });

  // Load custom task
  //grunt.loadTasks('grunt');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'less', 'transport', 'concat', 'uglify', 'connect']);
};