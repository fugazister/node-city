'use strict';

var express = require('express');
var proxy = require('proxy-middleware');
var url = require('url');
var fs = require('fs');
var esprima = require('esprima');

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

// walk folder (recursively)
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
      if (err) {
          return done(err);
      }
      var i = 0;
      (function next() {
          var file = list[i++];
          if (!file) {
              return done(null, results);
          }
          file = dir + '/' + file;
          fs.stat(file, function (err, stat) {
              if (stat && stat.isDirectory()) {
                  walk(file, function (err, res) {
                      results = results.concat(res);
                      next();
                  });
              } else {
                  results.push(file);
                  next();
              }
          });
      }());
  });
};

var ast,
    complex,
    gameObjects;

var getAST = function(complete) {
  var _ast = [];

  walk(__dirname + '/program', function(error, results) {
    var content,
        syntax;

    results.forEach(function(filename, i) {
      try {
        content = fs.readFileSync(filename, 'utf-8');
        syntax = esprima.parse(content, { tolerant: true, loc: true });

        _ast.push(syntax);
      } catch (e) {}

      if (results.length >= i+1) {
        complete(_ast);
      }
    });
  });
};

var analyse = function() {
  ast = [];

  getAST(function(result) {
    ast = result;
  });
};

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

  grunt.registerTask('analyse', analyse);

  grunt.registerTask('express', function() {
    var app = express();

    app.use('/assets', proxy(url.parse('http://localhost:9000/assets')));

    app.get('/ast.json', function(req, res) {
      res.send(ast);
    });
    app.get('/complex.json', function(req, res) {
      res.send(complex);
    });
    app.get('/gameObjects.json', function(req, res) {
      res.send(gameObjects);
    });

    app.get('/*', function(req, res) {
      res.sendFile(__dirname + '/app/index.html');
    });

    app.listen(9001);
  });

  grunt.registerTask('serve', ['analyse', 'express', 'webpack-dev-server']);

  grunt.registerTask('build', ['clean', 'copy', 'webpack']);

  grunt.registerTask('default', ['serve']);
};
