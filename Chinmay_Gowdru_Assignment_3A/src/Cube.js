class Cube {
  constructor() {
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    // this.size = 5.0;
    // this.segments = 10;
    this.matrix = new Matrix4();
    this.textureNum = -1;
    this.cubeVerts32 = new Float32Array([
      0,0,0,  1,1,0,  1,0,0,
      0,0,0,  0,1,0,  1,1,0,
      0,1,0,  0,1,1,  1,1,1,
      0,1,0,  1,1,1,  1,1,0,
      1,1,0,  1,1,1,  1,0,0,
      1,0,0,  1,1,1,  1,0,1,
      0,1,0,  0,1,1,  0,0,0,
      0,0,0,  0,1,1,  0,0,1,
      0,0,0,  0,0,1,  1,0,1,
      0,0,0,  1,0,1,  1,0,0,
      0,0,1,  1,1,1,  1,0,1,
      0,0,1,  0,1,1,  1,1,1
    ]);
    this.cubeVerts = [
      0,0,0,  1,1,0,  1,0,0,
      0,0,0,  0,1,0,  1,1,0,
      0,1,0,  0,1,1,  1,1,1,
      0,1,0,  1,1,1,  1,1,0,
      1,1,0,  1,1,1,  1,0,0,
      1,0,0,  1,1,1,  1,0,1,
      0,1,0,  0,1,1,  0,0,0,
      0,0,0,  0,1,1,  0,0,1,
      0,0,0,  0,0,1,  1,0,1,
      0,0,0,  1,0,1,  1,0,0,
      0,0,1,  1,1,1,  1,0,1,
      0,0,1,  0,1,1,  1,1,1
    ];
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
    
    // drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1]);
    // drawTriangle3D([0, 1, 0, 1, 1, 1, 1, 1, 0]);

    //right
    // drawTriangle3D([0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0]);
    // drawTriangle3D([0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]);

    drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);
    drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);
    gl.uniform4f(u_FragColor, rgba[0] * 0.85, rgba[1] * 0.85, rgba[2] * 0.85, rgba[3]);

    //back
    drawTriangle3D([0,1,1,1,1,1,1,0,1]);
    drawTriangle3D([0,1,1,1,0,1,0,0,1]);
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //left
    drawTriangle3D([1,1,1,1,1,0,1,0,0]);
    drawTriangle3D([1,1,1,1,0,0,1,0,1]);
    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]);

    //bottom
    drawTriangle3D([0,0,1,1,0,1,1,0,0]);
    drawTriangle3D([0,0,1,1,0,0,0,0,0]);
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

    //top
    drawTriangle3D([1,1,1,0,1,1,0,1,0]);
    drawTriangle3D([1,1,1,0,1,0,1,1,0]);

  }

  
  renderfast() {
    // var xy = this.position; 
    var rgba = this.color;
    // var size = this.size; 

    // gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];

    // front
    allverts = allverts.concat( [0,0,0,  1,1,0,  1,0,0]);
    allverts = allverts.concat( [0,0,0,  0,1,0,  1,1,0]);
    
    // top
    allverts = allverts.concat( [0,1,0,  0,1,1,  1,1,1]);
    allverts = allverts.concat( [0,1,0,  1,1,1,  1,1,0]);

    // right
    allverts = allverts.concat( [1,1,0,  1,1,1,  1,0,0]);
    allverts = allverts.concat( [1,0,0,  1,1,1,  1,0,1]);

    // left
    allverts = allverts.concat( [0,1,0,  0,1,1,  0,0,0]);
    allverts = allverts.concat( [0,0,0,  0,1,1,  0,0,1]);

    // bottom
    allverts = allverts.concat( [0,0,0,  0,0,1,  1,0,1]);
    allverts = allverts.concat( [0,0,0,  1,0,1,  1,0,0]);
    
    // back
    allverts = allverts.concat( [0,0,1,  1,1,1,  1,0,1]);
    allverts = allverts.concat( [0,0,1,  0,1,1,  1,1,1]);

    drawTriangle3D(allverts);
  }

  
  renderfaster() {
    // var xy = this.position; 
    var rgba = this.color;
    // var size = this.size; 

    gl.uniform1i(u_whichTexture, -2);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    if (g_vertexBuffer == null) {
      initTriangle3D();
    }

    // Write date into the buffer object
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW);

    drawTriangle3D(gl.TRIANGLES, 0, 36);
  }
}
