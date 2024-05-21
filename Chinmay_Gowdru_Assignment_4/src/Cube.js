 class Cube {
  constructor() {
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    // this.size = 5.0;
    // this.segments = 10;
    this.matrix = new Matrix4();
    
    this.normalMatrix = new Matrix4();
    this.textureNum = -2;

    this.vertices = null;
    this.uvs = null;

    this.vertexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();


    this.vertices = new Float32Array([
      //FRONT
      -0.5,0.5,0.5, -0.5,-0.5,0.5, 0.5,-0.5,0.5,
      -0.5,0.5,0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5,
      //LEFT
      -0.5,0.5,-0.5, -0.5,-0.5,-0.5, -0.5,-0.5,0.5,
      -0.5,0.5,-0.5, -0.5,-0.5,0.5, -0.5,0.5,0.5,
      //RIGHT
      0.5,0.5,0.5, 0.5,-0.5,0.5, 0.5,-0.5,-0.5,
      0.5,0.5,0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,
      //TOP
      -0.5,0.5,-0.5, -0.5,0.5,0.5, 0.5,0.5,0.5,
      -0.5,0.5,-0.5, 0.5,0.5,0.5, 0.5,0.5,-0.5,
      //BACK
      0.5,0.5,-0.5, 0.5,-0.5,-0.5, -0.5,0.5,-0.5,
      -0.5,0.5,-0.5, 0.5,-0.5,-0.5, -0.5,-0.5,-0.5,
      //BOTTOM
      -0.5,-0.5,0.5, -0.5,-0.5,-0.5, 0.5,-0.5,-0.5,
      -0.5,-0.5,0.5, 0.5,-0.5,-0.5, 0.5,-0.5,0.5
    ]);


    this.uvs = new Float32Array([
      // FRONT
      0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 
      0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 
      // LEFT
      0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 
      0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 
      // RIGHT
      0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 
      0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 
      // TOP
      0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0,
      // BACK
      0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 
      0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0,
      // BOTTOM
      0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 
      0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 
    ]);

    
  }


  render() {
    // var xy = this.position; 
    var rgba = this.color;
    // var size = this.size; 

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Front 
    drawTriangle3DUVNormal(
      [0,0,0,  1,1,0,  1,0,0],
      [0,0,  1,1,  1,0],
      [0,0,-1,  0,0,-1,  0,0,-1]);
    drawTriangle3DUVNormal([0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1], [0,0,-1,  0,0,-1,  0,0,-1]);
    gl.uniform4f(u_FragColor, rgba[0] *.9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    
    // Top
    drawTriangle3DUVNormal([0,1,0,  0,1,1,  1,1,1], [0,0,  0,1,  1,1], [0,1,0,  0,1,0,  0,1,0]);
    drawTriangle3DUVNormal([0,1,0,  1,1,1,  1,1,0], [0,0,  1,1,  1,0], [0,1,0,  0,1,0,  0,1,0]);
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //right
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    drawTriangle3DUVNormal([1,1,0,  1,1,1,  1,0,0], [0,0,  0,1,  1,1], [1,0,0,  1,0,0,  1,0,0]);
    drawTriangle3DUVNormal([1,0,0,  1,1,1,  1,0,1], [0,0,  1,1,  1,0], [1,0,0,  1,0,0,  1,0,0]);

    //left
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    drawTriangle3DUVNormal([0,1,0,  0,1,1,  0,0,0], [0,0,  0,1,  1,1], [-1,0,0,  -1,0,0,  -1,0,0]);
    drawTriangle3DUVNormal([0,0,0,  0,1,1,  0,0,1], [0,0,  1,1,  1,0], [-1,0,0,  -1,0,0,  -1,0,0]);

    //bottom
    gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    drawTriangle3DUVNormal([0,0,0,  0,0,1,  1,0,1], [0,0,  0,1,  1,1], [0,-1,0,  0,-1,0,  0,-1,0]);
    drawTriangle3DUVNormal([0,0,0,  1,0,1,  1,0,0], [0,0,  1,1,  1,0], [0,-1,0,  0,-1,0,  0,-1,0]);

    // back
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    drawTriangle3DUVNormal([0,0,1,  1,1,1,  1,0,1], [0,0,  0,1,  1,1], [0,0,1,  0,0,1,  0,0,1]);
    drawTriangle3DUVNormal([0,0,1,  0,1,1,  1,1,1], [0,0,  1,1,  1,0], [0,0,1,  0,0,1,  0,0,1]); 
        
  }

  
}
