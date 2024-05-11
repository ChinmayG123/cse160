class Cube {
  constructor() {
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    // this.size = 5.0;
    // this.segments = 10;
    this.matrix = new Matrix4();
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


    // drawTriangle3DUV([0,0,0, 1,1,0, 1, 0, 0], [1,0, 0,1, 1,1]);
    drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1]);

    // drawTriangle3D([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
    // drawTriangle3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);
    gl.uniform4f(u_FragColor, rgba[0] *.9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    
    

    //front
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0], [1,0,0,1,1,1]);
    //drawTriangle3D([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0], [1,0,0,1,1,1]);
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);


    drawTriangle3DUV([0,1,1,0,0,1,0,0,0], [1,0,0,1,1,1]);
    drawTriangle3DUV([0,1,1,0,0,0,0,1,0], [1,0,0,1,1,1]);
    gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);

    //back
    drawTriangle3DUV([0,1,1,1,1,1,1,0,1], [1,0,0,1,1,1]);
    drawTriangle3DUV([0,1,1,1,0,1,0,0,1], [1,0,0,1,1,1]);
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //left
    drawTriangle3DUV([1,1,1,1,1,0,1,0,0], [1,0,0,1,1,1]);
    drawTriangle3DUV([1,1,1,1,0,0,1,0,1], [1,0,0,1,1,1]);
    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]);

    //bottom
    drawTriangle3DUV([0,0,1,1,0,1,1,0,0], [1,0,0,1,1,1]);
    drawTriangle3DUV([0,0,1,1,0,0,0,0,0], [1,0,0,1,1,1]);
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    
    //top
    drawTriangle3DUV([1,1,1,0,1,1,0,1,0], [1,0,0,1,1,1]);
    drawTriangle3DUV([1,1,1,0,1,0,1,1,0], [1,0,0,1,1,1]);
  }

  
  renderfaster() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);



    if (this.vertexBuffer === null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);



    if (this.uvBuffer === null) {
      this.uvBuffer = gl.createBuffer();
      if (!this.uvBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, this.uvs.length/3);
  }

  
}
