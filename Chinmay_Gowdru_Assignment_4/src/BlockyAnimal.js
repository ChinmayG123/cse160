// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  varying vec3 v_eyeCoords;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    // v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
    v_eyeCoords = vec3(gl_Position) / gl_Position.w; // Compute eye coordinates of vertex

   }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec3 u_lightColor;

  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  
  uniform bool u_spotlightOn;


  uniform vec3 u_spotlightPosition; 
  uniform vec3 u_spotlightDirection;
  uniform float u_spotlightCutoff;
  uniform float u_spotlightExponent; 
  varying vec3 v_eyeCoords; 

  
  
  uniform float u_constantAttenuation;
  uniform float u_linearAttenuation;
  uniform float u_quadraticAttenuation;
    
    
  void main() {
  
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    } else if (u_whichTexture == -2) {
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

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);
    // if (r < 1.0) {
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if (r < 2.0) {
    //   gl_FragColor = vec4(0,1,0,1);
    // }

    
    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);

    float attenuation = 1.0 / (u_constantAttenuation +
      u_linearAttenuation * r +
      u_quadraticAttenuation * r * r);

    float nDotL = max(dot(N,L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // Eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E,R), 0.0), 10.0);

    vec3 diffuse = u_lightColor * vec3(gl_FragColor) * nDotL * attenuation * 0.5;

    
    vec3 ambient = vec3(gl_FragColor) * 0.3;

    
    if (u_spotlightOn) {

      vec3 Lspot = normalize(u_spotlightPosition - v_eyeCoords);

      float spotCosine = dot(-Lspot, normalize(u_spotlightDirection));
  
      float spotFactor = 0.0;
      if (spotCosine > cos(radians(u_spotlightCutoff))) {
          spotFactor = pow(spotCosine, u_spotlightExponent);
      }
  
      diffuse *= spotFactor;
      specular *= spotFactor;

      gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      
    }

    if (u_lightOn) {
      if (u_whichTexture == 0) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }



    
  }
  `

  

let canvas;
let gl;
let a_Position;
let a_Normal;
let u_FragColor;
let u_Size;

let a_UV;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;

let u_cameraPos;

let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let u_lightOn;
let u_NormalMatrix;

let u_lightColor;


let u_spotlightPosition;
let u_spotlightDirection;
let u_spotlightCutoff;
let u_spotlightExponent;

let u_spotlightOn;


let u_constantAttenuation;
let u_linearAttenuation;
let u_quadraticAttenuation;

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


  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal ');
    return;
  }

  
  // Get the storage location of u_spotlightPosition
  u_spotlightPosition = gl.getUniformLocation(gl.program, 'u_spotlightPosition');
  if (!u_spotlightPosition) {
    console.log('Failed to get the storage location of u_spotlightPosition');
    return;
  }
  
  
  // Get the storage location of u_spotlightDirection
  u_spotlightDirection = gl.getUniformLocation(gl.program, 'u_spotlightDirection');
  if (!u_spotlightDirection) {
    console.log('Failed to get the storage location of u_spotlightDirection');
    return;
  }

  
  // Get the storage location of u_spotlightDirection
  u_spotlightCutoff = gl.getUniformLocation(gl.program, 'u_spotlightCutoff');
  if (!u_spotlightCutoff) {
    console.log('Failed to get the storage location of u_spotlightCutoff');
    return;
  }

  

  // Get the storage location of u_spotlightExponent
  u_spotlightExponent = gl.getUniformLocation(gl.program, 'u_spotlightExponent');
  if (!u_spotlightExponent) {
    console.log('Failed to get the storage location of u_spotlightExponent');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }


  // Get the storage location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }
  
  // Get the storage location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  
  // Get the storage location of u_lightOn
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  
  // Get the storage location of u_spotlightOn
  u_spotlightOn = gl.getUniformLocation(gl.program, 'u_spotlightOn');
  if (!u_spotlightOn) {
    console.log('Failed to get the storage location of u_spotlightOn');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return; 
  }


  // Get the storage location of u_lightColor
  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return; 
  }


  u_constantAttenuation = gl.getUniformLocation(gl.program, 'u_constantAttenuation');
  u_linearAttenuation = gl.getUniformLocation(gl.program, 'u_linearAttenuation');
  u_quadraticAttenuation = gl.getUniformLocation(gl.program, 'u_quadraticAttenuation');


  // // Get the storage location of u_ModelMatrix
  // u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  // if (!u_NormalMatrix) {
  //   console.log('Failed to get the storage location of u_NormalMatrix');
  //   return; 
  // }
  
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
// let g_selectedColor = [2.0,2.0,0.0,1.0];

let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_rightArmAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;



var g_shapeList = [];


let g_everythingAnimation = false;

let g_normalOn = false;

let g_lightPos = [0,1,-2];
let g_lightOn = true;



var g_shapeList = [];

let g_rightHandAngle = 0;
let g_rightHandAnimation = false;
let g_rightArmAnimation = false;

let g_rightPawAnimation = false;

let g_spotlighton = true;

function addActionsForHTMLUI() {

  
  document.getElementById('spotlightOn').onclick = function() { g_spotlighton = true; };
  document.getElementById('spotlightOff').onclick = function() { g_spotlighton = false; };

  
  document.getElementById('lightOn').onclick = function() { g_lightOn = true; };
  document.getElementById('lightOff').onclick = function() { g_lightOn = false; };

  
  document.getElementById('normalOn').onclick = function() { g_normalOn = true; };
  document.getElementById('normalOff').onclick = function() { g_normalOn = false; };

  
  
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if (ev.buttons == 1) {g_lightPos[0] = this.value / 100; renderScene(); }});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if (ev.buttons == 1) {g_lightPos[1] = this.value / 100; renderScene(); }});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if (ev.buttons == 1) {g_lightPos[2] = this.value / 100; renderScene(); }});

  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); });

  
  document.getElementById('red').addEventListener('mousemove' , function () {g_selectedColor[0] = this.value/100;  renderScene();});
  document.getElementById('green').addEventListener('mousemove' , function () {g_selectedColor[1] = this.value/100;  renderScene();});
  document.getElementById('blue').addEventListener('mousemove' , function () {g_selectedColor[2] = this.value/100; renderScene();});

  document.getElementById('rightArmSlide').addEventListener('mousemove', function() { g_rightArmAngle = this.value; renderScene(); });
  document.getElementById('rightHandSlide').addEventListener('mousemove', function() { g_rightHandAngle = this.value; renderScene(); });



  
  document.getElementById('animationRightArmOffButton').onclick = function() { g_rightArmAnimation = false; };
  document.getElementById('animationRightArmOnButton').onclick = function() { g_rightArmAnimation = true; };

  
  document.getElementById('animationRightHandOffButton').onclick = function() { g_rightHandAnimation = false; };
  document.getElementById('animationRightHandOnButton').onclick = function() { g_rightHandAnimation = true; };

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



  initTextures();

  // gl.uniform3f(u_lightColor, g_selectedColor[0], g_selectedColor[1], g_selectedColor[2]);


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

  requestAnimationFrame(tick);
}

let previous = null;


let g_globalRotationX = 0;
let g_globalRotationY = 0;

let g_translationX = 0;
let g_translationY = 0;

function click(ev) {

    let [x,y] = convertCoordinatesEventToGL(ev);

    g_globalRotationX = x * 180; 
    g_globalRotationY = -y * 180; 

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
}




function updateAnimationAngles() {

  g_lightPos[0] = Math.cos(g_seconds);

  
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

  

}


function resetfunctions() {


  g_translationY = 0;
  

  g_rightArmAngle = 0;
  g_rightHandAngle = 0;
  g_rightArmAnimation = false;
  g_rightHandAnimation = false;

  updateSliderValue();

  
}


var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];


let right = 0;

let forwards = 0;
let backwards = 0;

let horizontal = 0;
let vertical = 0;
let forwarddirection = false;
let backwardsdirection = false;


function renderScene() {
  
  var startTime = performance.now();


  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);


  // // Apply rotation to the object
  var mousex = new Matrix4().rotate(g_globalRotationX, 0, 1, 0);
  var mousey = new Matrix4().rotate(g_globalRotationY, 1, 0, 0);

  globalRotMat = new Matrix4(mousex).multiply(mousey);
  
  // Apply the global angle rotation
  var globalAngleRotMat = new Matrix4().rotate(180, 0, 1, 0); // Rotate around the y-axis by 180 degrees
  globalRotMat.multiply(globalAngleRotMat);

  // Apply the global angle rotation
  var globalAngleRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.multiply(globalAngleRotMat);

  // Apply a uniform scale to the entire scene
  var scaleMatrix = new Matrix4().scale(0.75, 0.75, 0.75); 
  var scaledGlobalRotMat = new Matrix4(globalRotMat).multiply(scaleMatrix);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, scaledGlobalRotMat.elements);

  var translationMatrix = new Matrix4().translate(0, g_translationY, 0); 
  var transformedGlobalRotMat = new Matrix4(scaledGlobalRotMat).multiply(translationMatrix);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, transformedGlobalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  gl.uniform1f(u_constantAttenuation, 0.75); // Constant attenuation factor
  gl.uniform1f(u_linearAttenuation, 0.1); // Linear attenuation factor
  gl.uniform1f(u_quadraticAttenuation, 0.01); // Quadratic attenuation factor


  gl.uniform3f(u_spotlightPosition, 2.0, 2.0, 5.0); // Spotlight position in eye coordinates
  gl.uniform3f(u_spotlightDirection, -0.5, -0.5, -1.0); // Spotlight direction in eye coordinates

  gl.uniform1f(u_spotlightCutoff, 5.0); // Cutoff angle in degrees
  gl.uniform1f(u_spotlightExponent, 50.0); // Spotlight exponent (higher value for increased intensity)

  
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_lightColor, g_selectedColor[0] * 2, g_selectedColor[1] * 2, g_selectedColor[2] * 2);

  gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y,  g_camera.eye.z);

  gl.uniform1i(u_lightOn, g_lightOn);
  
  gl.uniform1i(u_spotlightOn, g_spotlighton);

  // floor
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0, -0.86, 0);
  floor.matrix.scale(20, 0, 20);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  // light
  var light = new Cube();
  
  light.color = [g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], 1];
  // light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1,  -.1);
  light.matrix.translate(-0.5, -0.5, -0.5);
  light.render();

  // Sphere
  var sphere = new Sphere();
  sphere.color = [0.679, 0.930, 0.784];
  sphere.textureNum = 2;
  if(g_normalOn) sphere.textureNum = -3;
  sphere.matrix.translate(1.2, -0.3, 0.5);
  sphere.matrix.scale(0.5, 0.5, 0.5);
  sphere.render();


  // sky
  var sky = new Cube();
  sky.color = [1.0, 0.0, 0.0, 1.0];
  sky.textureNum = 0;
  if (g_normalOn) sky.textureNum = -3;
  // sky.textureNum = 0;
  sky.matrix.scale(-5,-6,-8);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  

  var hat = new Cone();
  hat.color = [0.0, 0.5, 0.2, 1.0];
  hat.matrix.translate(0, 0.7, 0.25);
  hat.matrix.rotate(270, 1, 0, 0); 
  hat.matrix.scale(0.35, 0.35, 0.2); 
  hat.render();

  var rightear = new Cube();
  rightear.color = [0.1, 0.1, 0.1, 1.0];
  rightear.matrix.translate(0.1, 0.7, 0);
  rightear.matrix.scale(0.15, 0.15, 0.5);
  rightear.render();

  var leftear = new Cube();
  leftear.color = [0.1, 0.1, 0.1, 1.0];
  leftear.matrix.translate(-0.25, 0.7, 0);
  leftear.matrix.scale(0.15, 0.15, 0.5);
  leftear.render();

  var righteye = new Cube();
  righteye.color = [0.1, 0.1, 0.1, 1.0];
  righteye.matrix.translate(-0.125, 0.55, -0.1);
  righteye.matrix.scale(0.08, 0.08, 0.5);
  righteye.render();
  
  var lefteye = new Cube();
  lefteye.color = [0.1, 0.1, 0.1, 1.0];
  lefteye.matrix.translate(0.05, 0.55, -0.1);
  lefteye.matrix.scale(0.08, 0.08, 0.5);
  lefteye.render();

  var nose = new Cube();
  nose.color = [0.1, 0.1, 0.1, 1.0];
  nose.matrix.translate(-0.025, 0.475, -0.1);
  nose.matrix.scale(0.05, 0.05, 0.5);
  nose.render();

  var innermouth = new Cube();
  innermouth.color = [1.0, 0.5, 0.5, 1.0];
  innermouth.matrix.translate(-0.07, 0.36, -0.15);
  innermouth.matrix.scale(0.15, 0.075, 0.5);
  innermouth.render();
  
  var mouth = new Cube();
  mouth.color = [0.1, 0.1, 0.1, 1.0];
  mouth.matrix.translate(-0.095, 0.35, -0.1);
  mouth.matrix.scale(0.2, 0.1, 0.5);
  mouth.render();

  var head = new Cube();
  head.color = [0.9, 0.8, 0.7, 1.0];
  head.matrix.translate(-0.25, 0.3, 0);
  head.matrix.scale(0.5, 0.4, 0.5);
  head.render();


  var toprightarm = new Cube();
  toprightarm.color = [1.0, 1.0, 0.5, 1.0];
  toprightarm.matrix.rotate(-30, 0, 0, 1);
  toprightarm.matrix.rotate(180, 0, 0, 1);
  toprightarm.matrix.translate(0.24, -0.06, -0.05);
  toprightarm.matrix.rotate(0, 0, 0, 1);
  var toprightarmcoordinates = new Matrix4(toprightarm.matrix);
  toprightarm.matrix.scale(0.25, 0.5, 0.25);
  toprightarm.render();

  var righthand = new Cube();
  righthand.color = [70/255, 70/255, 70/255, 1.0];
  righthand.matrix = toprightarmcoordinates;
  righthand.matrix.translate(0, 0.5, 0);
  righthand.matrix.rotate(-0, 0, 0, 1);
  righthand.matrix.scale(0.25, 0.15, 0.25);
  righthand.render();

  var topleftarm = new Cube();
  topleftarm.color = [1.0, 1.0, 0.5, 1.0];
  topleftarm.matrix.rotate(30, 0, 0, 1);
  topleftarm.matrix.rotate(180, 0, 0, 1);
  topleftarm.matrix.translate(-0.4975, -0.06, -0.05);
  topleftarm.matrix.rotate(g_rightArmAngle, 0, 0, 1);
  var topleftarmcoordinates = new Matrix4(topleftarm.matrix);
  topleftarm.matrix.scale(0.25, 0.5, 0.25);
  topleftarm.render();

  var lefthand = new Cube();
  lefthand.color = [70/255, 70/255, 70/255, 1.0];
  lefthand.matrix = topleftarmcoordinates;
  lefthand.matrix.translate(0, 0.5, 0);
  lefthand.matrix.rotate(-g_rightHandAngle, 0, 0, 1);
  lefthand.matrix.scale(0.25, 0.15, 0.25);
  lefthand.render();

  var topbody = new Cube();
  topbody.color = [1.0, 1.0, 0.5, 1.0]; // Brighter yellow color
  topbody.matrix.translate(-0.4, 0, 0);
  topbody.matrix.scale(0.8, 0.3, 0.5);
  topbody.render();

  var whitebody = new Cube();
  whitebody.color = [0.9, 0.8, 0.7, 1.0];
  whitebody.matrix.translate(-0.4, -0.4, 0);
  whitebody.matrix.scale(0.8, 0.4, 0.5);
  whitebody.render();

  var rightleg = new Cube();
  rightleg.color = [1.0, 1.0, 0.5, 1.0];
  rightleg.matrix.translate(-0.4, -0.7, 0);
  rightleg.matrix.scale(0.3, 0.3, 0.5);
  rightleg.render();

  var leftleg = new Cube();
  leftleg.color = [1.0, 1.0, 0.5, 1.0];
  leftleg.matrix.translate(0.1, -0.7, 0);
  leftleg.matrix.scale(0.3, 0.3, 0.5);
  leftleg.render();
  
  var rightpaw = new Cube();
  rightpaw.color = [70/255, 70/255, 70/255, 1.0]
  rightpaw.matrix.rotate(180, 0, 0, 1);
  rightpaw.matrix.translate(0.1, 0.7, -0.2);
  rightpaw.matrix.rotate(0, 0, 0, 1);
  rightpaw.matrix.scale(0.3, 0.15, 0.5); 
  rightpaw.render();

  var leftpaw = new Cube();
  leftpaw.color = [70/255, 70/255, 70/255, 1.0]
  leftpaw.matrix.translate(0.1, -0.85, -0.2);
  leftpaw.matrix.scale(0.3, 0.15, 0.5);
  leftpaw.render();

  var tail = new Cube();
  tail.color = [1.0, 1.0, 0.5, 1.0];
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
