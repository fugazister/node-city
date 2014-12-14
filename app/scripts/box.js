'use strict';

var THREE = require('three');

var create = function (scene, params) {
  var geometry = new THREE.BoxGeometry( params.width, params.height, params.depth );
  var material = new THREE.MeshBasicMaterial( { color: params.color, map: params.map } );
  var cube = new THREE.Mesh( geometry, material );

  cube.position.x = params.x;
  cube.position.y = params.y;
  cube.position.z = params.z;

  scene.add( cube );
};

module.exports = {
  create: create
};
