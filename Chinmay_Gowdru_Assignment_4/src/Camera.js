class Camera {
    constructor(){

      this.eye = new Vector3([0,0,3]);
      this.at = new Vector3([0,0,-1]);
      this.up = new Vector3([0,1,0]);


      this.viewMatrix = new Matrix4();
      this.updateView();

      this.projectionMatrix = new Matrix4();
      this.projectionMatrix.setPerspective(60, canvas.width / canvas.height, 0.1, 1000);

    }

  
    moveForward(){

      let f = new Vector3();
      f = f.set(this.at);
      f = f.sub(this.eye);
      f = f.normalize();
      f = f.mul(0.15);
      this.eye = this.eye.add(f);
      this.at = this.at.add(f);

    }

    moveBackwards(){

      let b = new Vector3();
      b = b.set(this.eye);
      b = b.sub(this.at);
      b = b.normalize();
      b = b.mul(0.15);
      this.eye = this.eye.add(b);
      this.at = this.at.add(b);


    }

    moveLeft(){

      let f = new Vector3();
      f = f.set(this.at);
      f = f.sub(this.eye);

      // let s = new Vector3().cross(this.up, f);
      let s = Vector3.cross(this.up, f);

      s = s.normalize();
      s = s.mul(0.15);
      this.eye = this.eye.add(s);
      this.at = this.at.add(s);

    }

    moveRight(){

      let f = new Vector3();
      f = f.set(this.at);
      f = f.sub(this.eye);

      // let s = new Vector3().cross(f, this.up);
      let s = Vector3.cross(f, this.up);

      s = s.normalize();
      s = s.mul(0.15);
      this.eye = this.eye.add(s);
      this.at = this.at.add(s);

    }

    panLeft(){
      let f = new Vector3();
      f = f.set(this.at);
      f = f.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setIdentity();
      rotationMatrix.setRotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);


    }



    panRight(){

      
      var f = new Vector3();
      f = f.set(this.at);
      f = f.sub(this.eye);

      let rotationMatrix = new Matrix4();
      
      rotationMatrix.setIdentity();
      rotationMatrix.setRotate(-1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

      let f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);



    }

    updateView(){
      this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
                                this.at.elements[0], this.at.elements[1], this.at.elements[2],
                                this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    location() {

      return {
          x: this.eye.elements[0],
          y: this.eye.elements[1],
          z: this.eye.elements[2]
      };
    }


}
