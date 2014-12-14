'use strict';

var r = require('reqwest');

var makeObject = function (scene, object) {
  r({
    url: 'objects.json',
    method: 'get',
    type: 'json'
  }).then(function (objects) {
    objects.forEach(function (box) {
      object.create(scene, box);
    });
  });
};

module.exports = {
  makeObject: makeObject
};
