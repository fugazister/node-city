var fs = require('fs');
var esprima = require('esprima');

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

    if (results.length == 0) {
      return complete(_ast);
    }

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

module.exports = {
  getAST: getAST
};
