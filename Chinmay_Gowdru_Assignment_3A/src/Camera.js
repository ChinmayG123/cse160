class Camera {
    constructor(){
      // this.fov = 60;
      // this.eye = new Vector(0, 0, -3);
      // this.at = new Vector(0, 0, 0);
      // this.up = new Vector(0, 1, 0);


      this.eye = new Vector3([0,0,-3]);
      this.at = new Vector3([0,0,0]);
      this.up = new Vector3([0,1,0]);

      // this.viewMatrix = new Matrix4();
      // this.updateView();

      // this.projectionMatrix = new Matrix4();
      // this.projectionMatrix.setPerspective(this.fov, aspectRatio, near, far);

    }

    forward(){
      var f = this.at.subtract(this.eye);
      f = f.divide(f.length());
      this.at = this.at.add(f);
      this.eye = this.eye.add(f);

    }

    back(){
      var f = this.eye.subtract(this.at);
      f = f.divide(f.length());
      this.at = this.at.add(f);
      this.eye = this.eye.add(f);

    }

    left(){
      var f = this.eye.subtract(this.at);
      f = f.divide(f.length());
      var s = f.cross(this.up);
      s = s.divide(s.length());
      this.at = this.at.add(s);
      this.eye = this.eye.add(s);


    }

    right(){
      var f = this.eye.subtract(this.at);
      f = f.divide(f.length());
      var s = f.cross(this.up);
      s = s.divide(s.length());
      this.at = this.at.add(s);
      this.eye = this.eye.add(s);

    }

    panLeft(){

    }

    panRight(){

    }

    updateView(){
      this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
                        this.center.elements[0], this.center.elements[1], this.center.elements[2],
                        this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

}
