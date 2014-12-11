'use strict';

require('../styles/global.less');

var THREE = require('three');
var FlyControls = require('./FlyControls');

var container;

var camera, scene, renderer;

var controls, clock = new THREE.Clock();

var render = function () {
  requestAnimationFrame(render);
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
};

var makeBox = function (params) {
  var geometry = new THREE.BoxGeometry( params.width, params.height, params.depth );
  var material = new THREE.MeshBasicMaterial( { color: params.color } );
  var cube = new THREE.Mesh( geometry, material );

  cube.position.x = params.x;
  cube.position.y = params.y;
  cube.position.z = params.z;

  this.add( cube );
};

var onWindowResize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
};

var init = function () {
  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 15000);
  camera.position.z = 50;

  controls = new FlyControls(camera);
  controls.movementSpeed = 10;
  controls.rollSpeed = Math.PI/10;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1, 15000);

  var light = new THREE.PointLight(0xff2200);
  light.position.set( 0, 0, 0 );
  scene.add( light );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild(renderer.domElement);

  for (var i = 0; i <= 10; i++) {
    var cube = makeBox.call(scene, {
      width: 1,
      height: i,
      depth: 1,
      color: 0xffccff,
      x: i * 3,
      y: 0,
      z: 0
    });
  }

  window.addEventListener('resize', onWindowResize, false);
};

var load = function () {
  init();
  render();
};

window.addEventListener('load', load, false);
