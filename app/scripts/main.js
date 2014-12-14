'use strict';

require('../styles/global.less');

var THREE = require('three');
var FlyControls = require('./FlyControls');
var OculusRiftEffect = require('./OculusRiftEffect');

var box = require('./box');
var parser = require('./parser');

var container;

var camera, scene, renderer, effect;

var controls, clock = new THREE.Clock();

var render = function () {
  requestAnimationFrame(render);
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
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
  camera.position.z = 100;
  camera.position.y = 20;

  controls = new FlyControls(camera);
  controls.movementSpeed = 100;
  controls.rollSpeed = Math.PI / 5;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1, 15000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

/*  effect = new OculusRiftEffect( renderer, {worldScale: 100} );
  effect.setSize( window.innerWidth, window.innerHeight );*/
  container.appendChild(renderer.domElement);

  // GROUND
  var groundCanvas = document.createElement( 'canvas' );
  groundCanvas.width = 32;
  groundCanvas.height = 32;

  var groundContext = groundCanvas.getContext( '2d' );

  groundContext.moveTo(0, groundCanvas.width / 2);
  groundContext.lineTo(groundCanvas.width, groundCanvas.width / 2);
  groundContext.moveTo(groundCanvas.width / 2, 0);
  groundContext.lineTo(groundCanvas.width / 2, groundCanvas.width);
  groundContext.strokeStyle = 'blue';
  groundContext.stroke();

  var groundTexture = new THREE.Texture( groundCanvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping ),
      groundMaterial = new THREE.MeshBasicMaterial( { map: groundTexture } );

  groundTexture.needsUpdate = true;
  groundTexture.repeat.set( 1000, 1000 );

  var geometry = new THREE.PlaneBufferGeometry( 100, 100 );

  var meshCanvas = new THREE.Mesh( geometry, groundMaterial );
  meshCanvas.rotation.x = -Math.PI / 2;
  meshCanvas.position.x = 0;
  meshCanvas.position.y = -0.1;
  meshCanvas.position.z = 0;
  meshCanvas.scale.set( 100, 100, 100 );

  scene.add( meshCanvas );

  // BOXES
  parser.makeObject(scene, box);

  window.addEventListener('resize', onWindowResize, false);
};

var load = function () {
  init();
  render();
};

window.addEventListener('load', load, false);
