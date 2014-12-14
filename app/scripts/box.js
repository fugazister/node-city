'use strict';

var THREE = require('three');

var createText = function(w, h, text, at, bg, color) {
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
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
  canvas.width = w;
  canvas.height = h;
  var context = canvas.getContext('2d');
  var maxWidth = w;
  var lineHeight = 16;
  var x = 10;
  var y = 30;

  context.font = '32pt Arial';
  context.fillStyle = bg;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;

  wrapText(context, text, x, y, maxWidth, lineHeight);

  context.fillText('@' + at, x, y * 3);

  return canvas;
};

var create = function (scene, params) {
  var geometry = new THREE.BoxGeometry( params.width, params.height, params.depth ),
      material = new THREE.MeshBasicMaterial( { color: params.color, /*map: texture*/ } ),
      cube = new THREE.Mesh( geometry, material );

  cube.position.x = params.x;
  cube.position.y = params.y;
  cube.position.z = params.z;

  scene.add(cube);


  // name
  if (params.height > 0) {
    var canvas = createText(params.width * 25, params.width * 25, params.name, params.line, params.color, (params.color === '#fff') ? 'black' : 'white');
    var texture = new THREE.Texture(canvas);

    texture.needsUpdate = true;

    var nameGeo = new THREE.BoxGeometry( params.width, params.width, 0 ),
        nameMaterial = new THREE.MeshBasicMaterial( { map: texture } ),
        nameMesh = new THREE.Mesh( nameGeo, nameMaterial );

    nameMesh.position.x = params.x;
    nameMesh.position.y = params.y;
    nameMesh.position.z = (1/100) + params.z + params.width / 2;

    scene.add(nameMesh);
  }
};

module.exports = {
  create: create
};
