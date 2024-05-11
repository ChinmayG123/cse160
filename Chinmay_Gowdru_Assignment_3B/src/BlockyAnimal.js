// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
   }`
  
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
  
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } 
    else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if (u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
    else {
      gl_FragColor = vec4(1,.2,.2,1);
    }
  }
  `

  

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

let a_UV;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;

let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

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

  gl.enable(gl.DEPTH_TEST);
  // gl.depthFunc(gl.LEQUAL);
}

function connectVariablesToGLSL() {

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }


  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return; 
  }
  
  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  
  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  
  
  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  
  
  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  
  // Get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }


  
  // Get the storage location of u_Samplu_whichTextureer0
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);



}


function initTextures() {

  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  

  image.onload = function(){ sendImageToTEXTURE0(image);};
  image.src = 'sky.jpg';


  
  var image1 = new Image();
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }

  image1.onload = function(){ sendImageToTEXTURE1(image1); };
  image1.src = 'ground.jpg';

  
  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }

  image2.onload = function(){ sendImageToTEXTURE2(image2); };
  image2.src = 'block1.jpg';
  
  return true;
}

// sky
function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // gl.generate

  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTexture');


}


// floor
function sendImageToTEXTURE1(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);


  gl.uniform1i(u_Sampler1, 1);

  console.log('finished loadTexture');


}



// block
function sendImageToTEXTURE2(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE2);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);


  // gl.uniform1i(u_Sampler2, 2);




  // Rotate the image by 180 degrees
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  var ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI);
  ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2);

  // Use the rotated image for texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, canvas);

  gl.uniform1i(u_Sampler2, 2);

  console.log('finished loadTexture');


}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_rightArmAngle = 0;
let g_rightPawAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;



var g_shapeList = [];

let g_rightHandAngle = 0;
let g_rightHandAnimation = false;
let g_leftHandAnimation = false;
let g_rightArmAnimation = false;
let g_leftHandAngle = 0;
let g_leftArmAngle = 0;

let g_rightForeArmAngle = 0;

let g_leftArmAnimation = false;

let g_rightPawAnimation = false;

let g_everythingAnimation = false;

let rightforearmAnimation = false;

let g_pokeAnimation = true;


function addActionsForHTMLUI() {

  
  
  
  document.getElementById('animationPokeOffButton').onclick = function() { g_pokeAnimation = false; resetfunctions();};
  // document.getElementById('animationPokeOnButton').onclick = function() { g_pokeAnimation = true; };

  
  document.getElementById('animationForeaArmOffButton').onclick = function() { rightforearmAnimation = false; };
  document.getElementById('animationForeaArmOnButton').onclick = function() { rightforearmAnimation = true; };

  
  
  document.getElementById('animationRightArmOffButton').onclick = function() { g_rightArmAnimation = false; };
  document.getElementById('animationRightArmOnButton').onclick = function() { g_rightArmAnimation = true; };

  
  document.getElementById('animationLeftArmOffButton').onclick = function() { g_leftArmAnimation = false; };
  document.getElementById('animationLeftArmOnButton').onclick = function() { g_leftArmAnimation = true; };

  
  document.getElementById('animationRightPawOffButton').onclick = function() { g_rightPawAnimation = false; };
  document.getElementById('animationRightPawOnButton').onclick = function() { g_rightPawAnimation = true; };

  
  document.getElementById('animationRightHandOffButton').onclick = function() { g_rightHandAnimation = false; };
  document.getElementById('animationRightHandOnButton').onclick = function() { g_rightHandAnimation = true; };

  
  document.getElementById('animationLeftHandOffButton').onclick = function() { g_leftHandAnimation = false; };
  document.getElementById('animationLeftHandOnButton').onclick = function() { g_leftHandAnimation = true; };

  document.getElementById('rightPawSlide').addEventListener('mousemove', function() { g_rightPawAngle = this.value; renderScene(); });
  document.getElementById('rightArmSlide').addEventListener('mousemove', function() { g_rightArmAngle = this.value; renderScene(); });
  document.getElementById('rightHandSlide').addEventListener('mousemove', function() { g_rightHandAngle = this.value; renderScene(); });

  document.getElementById('rightForeArmSlide').addEventListener('mousemove', function() { g_rightForeArmAngle = this.value; renderScene(); });


  document.getElementById('leftArmSlide').addEventListener('mousemove', function() { g_leftArmAngle = this.value; renderScene(); });
  document.getElementById('leftHandSlide').addEventListener('mousemove', function() { g_leftHandAngle = this.value; renderScene(); });

  // document.getElementById('angleSlide').addEventListener('mouseup', function() { g_globalAngle = this.value; renderScene(); });
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); });

}

var g_camera;

function main() {
  
  // set up canvas and gl variables
  setupWebGL(); 

  // set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // set up actions for the html ui elements
  addActionsForHTMLUI();

  g_camera = new Camera();

  document.onkeydown = keydown;


  initTextures();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)}};


  // Specify the color for clearing <canvas>
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearColor(0.7, 0.7, 1.0, 1.0);

  
  updateAnimationAngles();


  // Clear <canvas>
  // renderScene();
  requestAnimationFrame(tick);

}



var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {

  g_seconds = performance.now() / 1000.0 - g_startTime;

  updateAnimationAngles();

  renderScene();

  drawMap();
  requestAnimationFrame(tick);
}

let previous = null;


let g_globalRotationX = 0;
let g_globalRotationY = 0;

let g_translationX = 0;
let g_translationY = 0;

let pokecheck = false;

function click(ev) {

  if (ev.shiftKey) {
    pokecheck = true;

  } else {

    let [x,y] = convertCoordinatesEventToGL(ev);

    g_globalRotationX = x * 180; 
    g_globalRotationY = -y * 180; 

  }

  renderScene();


}



function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}


function updateSliderValue() {
  var rightarmslider = document.getElementById('rightArmSlide');
  if (rightarmslider) {
    rightarmslider.value = g_rightArmAngle;
  }

  var righthandslider = document.getElementById('rightHandSlide');
  if (righthandslider) {
    righthandslider.value = g_rightHandAngle;
  }

  var leftarmslider = document.getElementById('leftArmSlide');
  if (leftarmslider) {
    leftarmslider.value = g_leftArmAngle;
  }

  var lefthandslider = document.getElementById('leftHandSlide');
  if (lefthandslider) {
    lefthandslider.value = g_leftHandAngle;
  }

  var rightpawslider = document.getElementById('rightPawSlide');
  if (rightpawslider) {
    rightpawslider.value = g_rightPawAngle;
  }

  
  var rightforearmslider = document.getElementById('rightForeArmSlide');
  if (rightforearmslider) {
    rightforearmslider.value = g_rightForeArmAngle;
  }
}


function updateAnimationAngles() {

  if (g_rightArmAnimation) {
    if (g_rightArmAngle >= 90) {
      g_rightArmDirection = -1; 
    } else if (g_rightArmAngle <= 0) {
      g_rightArmDirection = 1; 
    }

    g_rightArmAngle += g_rightArmDirection; 
    updateSliderValue();
  }

  
  if (g_rightHandAnimation) {
    if (g_rightHandAngle <= -60) {
      g_rightHandDirection = 1; 
    } else if (g_rightHandAngle >= 0) {
      g_rightHandDirection = -1; 
    }

    
    g_rightHandAngle += g_rightHandDirection; 

    updateSliderValue();
  }

  
  if (rightforearmAnimation) {
    if (g_rightForeArmAngle <= -60) {
      g_rightForeArmDirection = 1; 
    } else if (g_rightForeArmAngle >= 0) {
      g_rightForeArmDirection = -1; 
    }

    
    g_rightForeArmAngle += g_rightForeArmDirection; 

    updateSliderValue();
  }

  
  if (g_leftArmAnimation) {
    if (g_leftArmAngle >= 160) {
      g_leftArmDirection = -1; 
    } else if (g_leftArmAngle <= 0) {
      g_leftArmDirection = 1; 
    }

    g_leftArmAngle += g_leftArmDirection; 
    updateSliderValue();
  }


  
  if (g_leftHandAnimation) {
    if (g_leftHandAngle <= -60) {
      g_leftHandDirection = 1; 
    } else if (g_leftHandAngle >= 0) {
      g_leftHandDirection = -1; 
    }

    
    g_leftHandAngle += g_leftHandDirection; 

    updateSliderValue();
  }

  
  if (g_rightPawAnimation) {
    
    if (g_rightPawAngle >= 60) {
      console.log("hello");
      g_rightPawDirection = -1; 
    } else if (g_rightPawAngle <= 0) {
      console.log("bye");
      g_rightPawDirection = 1; 
    }

    g_rightPawAngle += g_rightPawDirection; 
    
    updateSliderValue();
  }


  if (pokecheck && g_pokeAnimation) {
    g_translationYDirection = -0.1; 
    g_translationY += g_translationYDirection; 
    
    g_rightArmAnimation = false;
    g_rightHandAnimation = false;
    g_leftArmAnimation = false;
    g_leftHandAnimation = false;
    g_rightPawAnimation = false;
    rightforearmAnimation = false;
    // pokecheck = false;
    updateSliderValue();

  }  



}


function resetfunctions() {


  g_translationY = 0;
  g_rightArmAngle = 0;
  g_rightHandAngle = 0;
  g_leftArmAngle = 0;
  g_leftHandAngle = 0;
  g_rightPawAngle = 0;
  g_rightForeArmAngle = 0;

  rightforearmAnimation = false;
  g_rightArmAnimation = false;
  g_rightHandAnimation = false;
  g_leftArmAnimation = false;
  g_leftHandAnimation = false;
  g_rightPawAnimation = false;
  pokecheck = false;
  updateSliderValue();

  
}


var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];

// right array is back side
// left array is front side
// bottom array is left side
// top array is right side

var g_map = [
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 2, 2, 1, 4],

  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 2, 2, 1, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 2, 2, 1, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],

  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 3, 3, 3, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 3, 3, 3, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 3, 3, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 4],

  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
]


function drawMap(){
  for (x = 0; x < 40; x++){
    for (y = 0; y < 40; y++){
      if (1 <= g_map[x][y] && g_map[x][y] <= 6){
        // if ( x == 18 && y == 20) {
        for (let i = 0; i < g_map[x][y]; i++) {
          drawWall(x, y, i);
        }
      // }
      }
    }
  }
}


function drawWall(x, y, i) {
  var wall = new Cube();
  wall.textureNum = 2;
  wall.matrix.scale(0.25, 0.25, 0.25);
  wall.matrix.translate(x - 16, -1.3, y - 16);
  wall.matrix.translate(3, -1.5 + i * 1.0, 6);
  wall.renderfaster();
}

let left = 0;
let right = 0;

let forwards = 0;
let backwards = 0;

let horizontal = 0;
let vertical = 0;

let leftdirection = false;
let rightdirection = false;

let forwarddirection = false;
let backwardsdirection = false

function keydown(ev) {
  
  let cameraLocation = g_camera.location(); 
  let x = cameraLocation.x;
  let y = cameraLocation.y;
  let z = cameraLocation.z;
  
  [x, y, z] = [Math.round(x) + 12, Math.round(y), Math.round(z) - 3]


  if (ev.keyCode == 87) { // W
    g_camera.moveForward();
    g_camera.updateView();
    vertical = vertical + 1;

  } else if (ev.keyCode == 83) { // S
    g_camera.moveBackwards();
    g_camera.updateView();  
    vertical = vertical - 1;

  } else if (ev.keyCode == 65) { // A
    g_camera.moveLeft();
    g_camera.updateView();  
    horizontal = horizontal + 1;

  } else if (ev.keyCode == 68) { // D
    g_camera.moveRight();
    g_camera.updateView();  
    horizontal = horizontal - 1; 

  } else if (ev.keyCode == 81) { // Q
    g_camera.panLeft();
    g_camera.updateView();  

  } else if (ev.keyCode == 69) { // E
    g_camera.panRight();
    g_camera.updateView();  
    
  } else if(ev.keyCode == 88){  // X
    if (g_map[x + horizontal][z + vertical] == 0) {
      g_map[x + horizontal][z + vertical] += 4;
    
    } 
  } else if (ev.keyCode == 90) {  // Z
    if (g_map[x + horizontal][z + vertical] > 0) { 
      g_map[x + horizontal][z + vertical] = 0; 
    }
  }

  drawMap();
  renderScene();
}


function renderScene() {
  
  var startTime = performance.now();


  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);


  // // Apply rotation to the object
  var mousex = new Matrix4().rotate(g_globalRotationX, 0, 1, 0);
  var mousey = new Matrix4().rotate(g_globalRotationY, 1, 0, 0);
  // var mousey = new Matrix4().rotate(90, 1, 0, 0);

  globalRotMat = new Matrix4(mousex).multiply(mousey);
  
  // Apply the global angle rotation
  var globalAngleRotMat = new Matrix4().rotate(180, 0, 1, 0); // Rotate around the y-axis by 180 degrees
  globalRotMat.multiply(globalAngleRotMat);

  // Apply the global angle rotation
  var globalAngleRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.multiply(globalAngleRotMat);

  // Apply a uniform scale to the entire scene
  // var scaleMatrix = new Matrix4().scale(0.3, 0.3, 0.3); 
  var scaleMatrix = new Matrix4().scale(0.75, 0.75, 0.75); 
  var scaledGlobalRotMat = new Matrix4(globalRotMat).multiply(scaleMatrix);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, scaledGlobalRotMat.elements);

  // var translationMatrix = new Matrix4().translate(-2, g_translationY, 0); 
  var translationMatrix = new Matrix4().translate(0, g_translationY, 0); 
  var transformedGlobalRotMat = new Matrix4(scaledGlobalRotMat).multiply(translationMatrix);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, transformedGlobalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // floor
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0, -0.86, 0);
  floor.matrix.scale(20, 0, 20);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  // sky
  var sky = new Cube();
  sky.color = [1.0, 0.0, 0.0, 1.0];
  sky.textureNum = 0;
  sky.matrix.scale(50,50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  var hat = new Cone();
  hat.color = [0.0, 0.5, 0.2, 1.0];
  hat.matrix.translate(0, 0.7, 0.25);
  hat.matrix.rotate(270, 1, 0, 0); 
  hat.matrix.scale(0.35, 0.35, 0.2); 
  hat.render();

  var rightear = new Cube();
  rightear.color = [0.0, 0.0, 0.0, 1.0];
  rightear.matrix.translate(0.1, 0.7, 0);
  rightear.matrix.scale(0.15, 0.15, 0.5);
  rightear.render();

  var leftear = new Cube();
  leftear.color = [0.0, 0.0, 0.0, 1.0];
  leftear.matrix.translate(-0.25, 0.7, 0);
  leftear.matrix.scale(0.15, 0.15, 0.5);
  leftear.render();

  var righteye = new Cube();
  righteye.color = [0.0, 0.0, 0.0, 1.0];
  righteye.matrix.translate(-0.125, 0.55, -0.1);
  righteye.matrix.scale(0.08, 0.08, 0.5);
  righteye.render();
  
  var lefteye = new Cube();
  lefteye.color = [0.0, 0.0, 0.0, 1.0];
  lefteye.matrix.translate(0.05, 0.55, -0.1);
  lefteye.matrix.scale(0.08, 0.08, 0.5);
  lefteye.render();

  var nose = new Cube();
  nose.color = [0.0, 0.0, 0.0, 1.0];
  nose.matrix.translate(-0.025, 0.475, -0.1);
  nose.matrix.scale(0.05, 0.05, 0.5);
  nose.render();

  var innermouth = new Cube();
  innermouth.color = [1.0, 0.5, 0.5, 1.0];
  innermouth.matrix.translate(-0.07, 0.36, -0.15);
  innermouth.matrix.scale(0.15, 0.075, 0.5);
  innermouth.render();
  
  var mouth = new Cube();
  mouth.color = [0.0, 0.0, 0.0, 1.0];
  mouth.matrix.translate(-0.095, 0.35, -0.1);
  mouth.matrix.scale(0.2, 0.1, 0.5);
  mouth.render();

  var head = new Cube();
  head.color = [0.0, 0.0, 0.0, 0.0];
  head.matrix.translate(-0.25, 0.3, 0);
  head.matrix.scale(0.5, 0.4, 0.5);
  head.render();

  var toprightarm = new Cube();
  toprightarm.color = [0.0, 0, 0, 1.0];
  toprightarm.matrix.rotate(-90, 0, 0, 1);
  toprightarm.matrix.rotate(180, 1, 0, 0);
  toprightarm.matrix.translate(-0.3, 0.4, -0.25);
  toprightarm.matrix.rotate(g_rightArmAngle, 0, 0, 1);
  var toprightarmcoordinates = new Matrix4(toprightarm.matrix);
  toprightarm.matrix.scale(0.3, 0.3, 0.25);
  toprightarm.render();

  var bottomrightarm = new Cube();
  bottomrightarm.color = [0.0, 0, 0, 1.0];
  bottomrightarm.matrix = toprightarmcoordinates;
  bottomrightarm.matrix.rotate(90, 0, 0, 1);
  bottomrightarm.matrix.rotate(180, 1, 0, 0);
  bottomrightarm.matrix.translate(0.3, 0, -0.25);
  bottomrightarm.matrix.rotate(g_rightForeArmAngle, 0, 0, 1);
  var bottomrightarmcoordinates = new Matrix4(bottomrightarm.matrix);
  bottomrightarm.matrix.scale(0.25, 0.5, 0.25);
  bottomrightarm.render();

  var righthand = new Cube();
  righthand.color = [70/255, 70/255, 70/255, 1.0];
  righthand.matrix = bottomrightarmcoordinates;
  righthand.matrix.rotate(180, 1, 0, 0);
  righthand.matrix.rotate(180, 0, 0, 1);
  righthand.matrix.translate(-0.25, 0.5, -0.25);
  
  righthand.matrix.rotate(-g_rightHandAngle, 0, 0, 1);
  righthand.matrix.scale(0.25, 0.15, 0.25);
  righthand.render();

  var topleftarm = new Cube();
  topleftarm.color = [0.0, 0, 0, 1.0];
  topleftarm.matrix.rotate(30, 0, 0, 1);
  topleftarm.matrix.rotate(180, 0, 0, 1);
  topleftarm.matrix.translate(-0.4975, -0.06, -0.05);
  topleftarm.matrix.rotate(g_leftArmAngle, 0, 0, 1);
  var topleftarmcoordinates = new Matrix4(topleftarm.matrix);
  topleftarm.matrix.scale(0.25, 0.5, 0.25);
  topleftarm.render();

  var lefthand = new Cube();
  lefthand.color = [70/255, 70/255, 70/255, 1.0];
  lefthand.matrix = topleftarmcoordinates;
  lefthand.matrix.translate(0, 0.5, 0);
  lefthand.matrix.rotate(-g_leftHandAngle, 0, 0, 1);
  lefthand.matrix.scale(0.25, 0.15, 0.25);
  lefthand.render();

  var topbody = new Cube();
  topbody.color = [0.0, 0.0, 0.0, 1.0];
  topbody.matrix.translate(-0.4, 0, 0);
  topbody.matrix.scale(0.8, 0.3, 0.5);
  topbody.render();

  var whitebody = new Cube();
  whitebody.color = [0.0, 0.0, 0.0, 0.0];
  whitebody.matrix.translate(-0.4, -0.4, 0);
  whitebody.matrix.scale(0.8, 0.4, 0.5);
  whitebody.render();

  var rightleg = new Cube();
  rightleg.color = [0.0, 0.0, 0.0, 1.0];
  rightleg.matrix.translate(-0.4, -0.7, 0);
  rightleg.matrix.scale(0.3, 0.3, 0.5);
  rightleg.render();

  var leftleg = new Cube();
  leftleg.color = [0.0, 0.0, 0.0, 1.0];
  leftleg.matrix.translate(0.1, -0.7, 0);
  leftleg.matrix.scale(0.3, 0.3, 0.5);
  leftleg.render();
  
  var rightpaw = new Cube();
  rightpaw.color = [70/255, 70/255, 70/255, 1.0]
  rightpaw.matrix.rotate(180, 0, 0, 1);
  rightpaw.matrix.translate(0.1, 0.7, -0.2);
  rightpaw.matrix.rotate(g_rightPawAngle, 0, 0, 1);
  rightpaw.matrix.scale(0.3, 0.15, 0.5); 
  rightpaw.render();

  var leftpaw = new Cube();
  leftpaw.color = [70/255, 70/255, 70/255, 1.0]
  leftpaw.matrix.translate(0.1, -0.85, -0.2);
  leftpaw.matrix.scale(0.3, 0.15, 0.5);
  leftpaw.render();

  var tail = new Cube();
  tail.color = [0.0, 0.0, 0.0, 1];
  tail.matrix.translate(-0.1, -0.4, 0.5);
  tail.matrix.scale(0.2, 0.2, 0.2);
  tail.render();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps " + Math.floor(1000/duration), "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
