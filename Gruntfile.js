'use strict';

var express = require('express');
var proxy = require('proxy-middleware');
var url = require('url');

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

var getESCReport = require('./index.js').getESCReport;
var getAST = require('./index.js').getAST;
var reportParser = require('./report_parser.js').reportParser;

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require('load-grunt-tasks')(grunt);

  // Read configuration from package.json
  var pkgConfig = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      options: webpackDistConfig,

      dist: {
        cache: false
      }
    },

    'webpack-dev-server': {
      options: {
        hot: true,
        port: 9000,
        webpack: webpackDevConfig,
        publicPath: '/assets/',
        contentBase: './<%= pkg.src %>/',
      },

      start: {
        keepAlive: true,
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.src %>/*'],
            dest: '<%= pkg.dist %>/',
            filter: 'isFile'
          },
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.src %>/images/*'],
            dest: '<%= pkg.dist %>/images/'
          },
        ]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= pkg.dist %>'
          ]
        }]
      }
    }
  });

  //grunt.registerTask('analyse', analyse);

  grunt.registerTask('express', function() {
    var app = express();

    app.use('/assets', proxy(url.parse('http://localhost:9000/assets')));

    app.get('/ast.json', function(req, res) {
      getAST(function (ast) {
        res.send(ast);
      });
    });
    app.get('/objects.json', function(req, res) {
      getESCReport(function (ast) {
        var parsedReport = reportParser(ast);
        res.send(parsedReport);
      });
    });
    app.get('/complex.json', function(req, res) {
      getESCReport(function (report) {
        res.send(report);
      });
    });
    app.get('/gameObjects.json', function(req, res) {
      res.send(gameObjects);
    });

    app.get('/*', function(req, res) {
      res.sendFile(__dirname + '/app/index.html');
    });

    app.listen(3000);
  });

  grunt.registerTask('serve', ['express', 'webpack-dev-server']);

  grunt.registerTask('build', ['clean', 'copy', 'webpack']);

  grunt.registerTask('default', ['serve']);
};
