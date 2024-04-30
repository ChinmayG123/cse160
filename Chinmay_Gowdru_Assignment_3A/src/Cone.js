class Cone {
  constructor() {
    this.type = 'cone';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    const rgba = this.color;
    const segments = 30; 
    const radius = 1.0; 
    const height = 2.0; 

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // base
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    const angleStep = (2 * Math.PI) / segments;
    for (let i = 0; i < segments; i++) {
      const angle1 = i * angleStep;
      const angle2 = (i + 1) * angleStep;

      const x1 = radius * Math.cos(angle1);
      const y1 = radius * Math.sin(angle1);
      const x2 = radius * Math.cos(angle2);
      const y2 = radius * Math.sin(angle2);

      drawTriangle3D([0.0, 0.0, 0.0, x1, y1, 0.0, x2, y2, 0.0]);
    }

    // side
    const sideAngleStep = (2 * Math.PI) / segments;
    for (let i = 0; i < segments; i++) {
      const angle1 = i * sideAngleStep;
      const angle2 = (i + 1) * sideAngleStep;

      const x1 = radius * Math.cos(angle1);
      const y1 = radius * Math.sin(angle1);
      const x2 = radius * Math.cos(angle2);
      const y2 = radius * Math.sin(angle2);

      gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
      drawTriangle3D([0.0, 0.0, height, x1, y1, 0.0, x2, y2, 0.0]);
    }

    // top
    gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    drawTriangle3D([0.0, 0.0, height, radius, 0.0, 0.0, 0.0, 0.0, 0.0]);
  }
}