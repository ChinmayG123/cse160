// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`
  
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`


let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_FragColor
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 10;
let draw = 0;
let game = 0;

function addActionsForHTMLUI() {
  
  // Button Events (Shape Type)
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function() { g_shapesList = []; draw = 0; game = 0; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function() { g_selectedType = POINT};
  document.getElementById('triangleButton').onclick = function() { g_selectedType = TRIANGLE};
  document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE};
  document.getElementById('drawingButton').onclick = function() { drawing(); draw = 1};
  document.getElementById('gameButton').onclick = function() { game = 1; minigame()};



  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_selectedSegment = this.value; });

}

function main() {
  
  // set up canvas and gl variables
  setupWebGL();

  // set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // set up actions for the html ui elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)}};


  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // drawing();
}

var g_shapesList = [];

let previous = null;


function click(ev) {

  let [x,y] = convertCoordinatesEventToGL(ev);

  let point;

  if (g_selectedType == POINT) {
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  }
  else {
    point = new Circle();
    point.segments = g_selectedSegment;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();

}


function minigame() {

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);


  // var gameImage = document.getElementById('game-image');
  // if (gameImage.style.display === 'none') {
  //   gameImage.style.display = 'block'; 
  // } else {
  //   gameImage.style.display = 'none'; 
  // }



}


// function drawLine(vertices) {
//   var n = 2; // The number of vertices for a line

//   // Create a buffer object
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('Failed to create the buffer object');
//     return -1;
//   }

//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

//   gl.enableVertexAttribArray(a_Position);

//   gl.uniform4fv(u_FragColor, g_selectedColor);

//   gl.drawArrays(gl.LINES, 0, n);
  
// }


function drawing() {
  // ocean
  gl.uniform4f(u_FragColor, 0.3, 0.5, 1.0, 1.0);
  drawTriangle([-1,0,1,-1,-1,-1]);
  drawTriangle([-1,0,1,0,1,-1]);

  // sky
  gl.uniform4f(u_FragColor, 0.8, 0.9, 1.0, 1.0);
  drawTriangle([-1,0,1,0,-1,1]);
  drawTriangle([1,1,1,0,-1,1]);

  // support beam 1
  gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);
  drawTriangle([-1, 0.1, -1, -0.2, -0.8, -0.2]);
  drawTriangle([-1, 0.1, -0.8, 0.1, -0.8, -0.2]);

  // support beam 2
  gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);
  drawTriangle([1, 0.1, 1, -0.2, 0.8, -0.2]);
  drawTriangle([1, 0.1, 0.8, 0.1, 0.8, -0.2]);

  // fish 1
  gl.uniform4f(u_FragColor, 1, 1, 0, 1.0);
  drawTriangle([0,-0.5, 0.4, -0.2, 0.4, -0.5]);
  drawTriangle([0,-0.5, 0.4, -0.8, 0.4, -0.5]);

  gl.uniform4f(u_FragColor, 0, 1, 0, 1.0);
  drawTriangle([0,-0.5, 0.2, -0.35, 0.2, -0.5]);
  drawTriangle([0,-0.5, 0.2, -0.65, 0.2, -0.5]);

  gl.uniform4f(u_FragColor, 0.7, 0.5, 0.9, 1.0);
  drawTriangle([0.4, -0.5, 0.6, -0.35, 0.6, -0.5]);
  drawTriangle([0.4, -0.5, 0.6, -0.65, 0.6, -0.5]);

  // fish 2
  gl.uniform4f(u_FragColor, 1, 1, 0, 1.0);
  drawTriangle([-0.8,-0.5, -0.4, -0.2, -0.4, -0.5]);
  drawTriangle([-0.8,-0.5, -0.4, -0.8, -0.4, -0.5]);

   gl.uniform4f(u_FragColor, 0, 1, 0, 1.0);
  drawTriangle([-0.8,-0.5, -0.6, -0.35, -0.6, -0.5]);
  drawTriangle([-0.8,-0.5, -0.6, -0.65, -0.6, -0.5]);

  gl.uniform4f(u_FragColor, 0.7, 0.5, 0.9, 1.0);
  drawTriangle([-0.4, -0.5, -0.2, -0.35, -0.2, -0.5]);
  drawTriangle([-0.4, -0.5, -0.2, -0.65, -0.2, -0.5]);

  
  

  // red
  gl.uniform4f(u_FragColor, 1, 0.1, 0.1, 1.0);
  drawTriangle([-0.8, 0.1, -0.6, 0.4, -0.6, 0.1]);
  drawTriangle([-0.4, 0.1, -0.6, 0.4, -0.6, 0.1]);

  drawTriangle([-0.4, 0.1, -0.2, 0.4, 0, 0.1]);
  drawTriangle([0, 0.1, -0.2, 0.4, 0, 0.1]);

  drawTriangle([0, 0.1, 0.2, 0.4, 0.2, 0.1]);
  drawTriangle([0.4, 0.1, 0.2, 0.4, 0.2, 0.1]);

  drawTriangle([0.4, 0.1, 0.6, 0.4, 0.6, 0.1]);
  drawTriangle([0.8, 0.1, 0.6, 0.4, 0.6, 0.1]);


  // purple
  gl.uniform4f(u_FragColor, 0, 0, 0.2, 1.0);

  drawTriangle([-0.6, 0.1, -0.4, 0.4, -0.6, 0.4]);
  drawTriangle([-0.6, 0.1, -0.8, 0.4, -0.6, 0.4]);

  drawTriangle([-0.2, 0.1, 0, 0.4, -0.2, 0.4]);
  drawTriangle([-0.2, 0.1, -0.4, 0.4, -0.2, 0.4]);
  
  drawTriangle([0.2, 0.1, 0.4, 0.4, 0.2, 0.4]);
  drawTriangle([0.2, 0.1, 0, 0.4, 0.2, 0.4]);

  drawTriangle([0.6, 0.1, 0.8, 0.4, 0.6, 0.4]);
  drawTriangle([0.6, 0.1, 0.4, 0.4, 0.6, 0.4]);

  // green
  gl.uniform4f(u_FragColor, 0, 0.6, 0.2, 1.0);

  drawTriangle([-0.4, 0.1, -0.2, 0.4, -0.4, 0.4]);
  drawTriangle([-0.4, 0.1, -0.6, 0.4, -0.4, 0.4]);

  drawTriangle([0, 0.1, 0.2, 0.4, 0, 0.4]);
  drawTriangle([0, 0.1, -0.2, 0.4, 0, 0.4]);

  drawTriangle([0.4, 0.1, 0.2, 0.4, 0.4, 0.4]);
  drawTriangle([0.4, 0.1, 0.6, 0.4, 0.4, 0.4]);


  
  // end sides
  gl.uniform4f(u_FragColor, 0, 0.6, 0.2, 1.0);

  drawTriangle([0.8, 0.1, 0.8, 0.4, 0.6, 0.4]);
  drawTriangle([-0.8, 0.1, -0.8, 0.4, -0.6, 0.4]);

  
  // light purple
  gl.uniform4f(u_FragColor, 0.6, 0.3, 0.8, 1.0);

  drawTriangle([-0.7, 0.25, -0.8, 0.4, -0.8, 0.25]);
  drawTriangle([-0.7, 0.25, -0.8, 0.1, -0.8, 0.25]);

  drawTriangle([-0.5, 0.25, -0.4, 0.4, -0.4, 0.25]);
  drawTriangle([-0.3, 0.25, -0.4, 0.4, -0.4, 0.25]);

  drawTriangle([-0.5, 0.25, -0.4, 0.1, -0.4, 0.25]);
  drawTriangle([-0.3, 0.25, -0.4, 0.1, -0.4, 0.25]);

  drawTriangle([-0.1, 0.25, 0, 0.4, 0, 0.25]);
  drawTriangle([0.1, 0.25, 0, 0.4, 0, 0.25]);

  drawTriangle([-0.1, 0.25, 0, 0.1, 0, 0.25]);
  drawTriangle([0.1, 0.25, 0, 0.1, 0, 0.25]);

  drawTriangle([0.3, 0.25, 0.4, 0.4, 0.4, 0.25]);
  drawTriangle([0.5, 0.25, 0.4, 0.4, 0.4, 0.25]);

  drawTriangle([0.3, 0.25, 0.4, 0.1, 0.4, 0.25]);
  drawTriangle([0.5, 0.25, 0.4, 0.1, 0.4, 0.25]);

  
  drawTriangle([0.7, 0.25, 0.8, 0.4, 0.8, 0.25]);
  drawTriangle([0.7, 0.25, 0.8, 0.1, 0.8, 0.25]);

  
  // bridge left and right
  gl.uniform4f(u_FragColor, 0, 0, 0.2, 1.0);
  drawTriangle([-0.95, 0.1, -0.8, 0.4, -0.8, 0.1]);
  drawTriangle([0.95, 0.1, 0.8, 0.4, 0.8, 0.1]);

  // bird
  gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);
  drawTriangle([-0.7, 0.8, -0.9, 0.7, -0.5, 0.6]);
  drawTriangle([-0.3, 0.8, -0.1, 0.7, -0.5, 0.6]);

  // sun
  gl.uniform4f(u_FragColor, 1, 1, 0, 1.0);
  drawTriangle([0.55, 0.95, 0.6, 0.75, 0.65, 0.95]);
  drawTriangle([0.65, 0.55, 0.6, 0.75, 0.55, 0.55]);

  drawTriangle([0.6, 0.75, 0.8, 0.8, 0.8, 0.7]);
  drawTriangle([0.6, 0.75, 0.4, 0.8, 0.4, 0.7]);

  drawTriangle([0.6, 0.75, 0.65, 0.95, 0.75, 0.9]);
  drawTriangle([0.6, 0.75, 0.55, 0.55, 0.45, 0.6]);

  drawTriangle([0.6, 0.75, 0.65, 0.55, 0.75, 0.6]);
  drawTriangle([0.6, 0.75, 0.55, 0.95, 0.45, 0.9]);

  drawTriangle([0.6, 0.75, 0.8, 0.8, 0.75, 0.9]);
  drawTriangle([0.6, 0.75, 0.45, 0.6, 0.4, 0.7]);

  drawTriangle([0.6, 0.75, 0.4, 0.8, 0.45, 0.9]);
  drawTriangle([0.6, 0.75, 0.75, 0.6, 0.8, 0.7]);


}


function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}


function renderAllShapes() {
  
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);


  if (draw == 1) {
    drawing();
  }

  if (game == 1) {
    minigame();
  }
  

  var len = g_shapesList.length;

  // var len = g_points.length;
  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();

  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
