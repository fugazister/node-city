'use strict';

var THREE = require('three');

var createText = function(text, bg, color) {
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  var canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  var context = canvas.getContext('2d');
  var maxWidth = 100;
  var lineHeight = 8;
  var x = 10;
  var y = 30;

  context.font = 'Bold 16pt Arial';
  context.fillStyle = bg;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;

  wrapText(context, text, x, y, maxWidth, lineHeight);

  return canvas;
};

var create = function (scene, params) {
  var canvas = createText(params.name, params.color, 'red'),
      texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  var geometry = new THREE.BoxGeometry( params.width, params.height, params.depth ),
      material = new THREE.MeshBasicMaterial( { map: texture } ),
      cube = new THREE.Mesh( geometry, material );

  cube.position.x = params.x;
  cube.position.y = params.y;
  cube.position.z = params.z;

  scene.add(cube);
};

module.exports = {
  create: create
};
