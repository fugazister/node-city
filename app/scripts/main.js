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
  var material = new THREE.MeshBasicMaterial( { color: params.color, map: params.map } );
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

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild(renderer.domElement);

  var canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;

  var context = canvas.getContext( '2d' );
  var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
  gradient.addColorStop( 0.1, 'rgba(0,0,150,1)' );
  gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );

  var shadowTexture = new THREE.Texture( canvas );
  shadowTexture.needsUpdate = true;

  var groundMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, specular: 0x111111 } );

  var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
  mesh.position.y = -250;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );

  var cube = makeBox.call(scene, {
    width: 10,
    height: 10,
    depth: 10,
    color: 0x0000ff,
    x: 0,
    y: 0,
    z: 0,
    map: shadowTexture
  });

  window.addEventListener('resize', onWindowResize, false);
};

var load = function () {
  init();
  render();
};

window.addEventListener('load', load, false);
