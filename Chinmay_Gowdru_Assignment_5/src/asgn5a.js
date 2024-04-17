import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';


function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	
    // // Set canvas size
    // canvas.style.width = '100%'; // Full width of the viewport
    // canvas.style.height = '100vh'; // Full height of the viewport
    // renderer.setSize(window.innerWidth, window.innerHeight);


	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 4;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );


    // Load the texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load('jerry.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    // Create a material with the texture
    const material = new THREE.MeshPhongMaterial({ map: texture });



    // Load texture for IronMan
	const ironmanloader = new THREE.TextureLoader();
    const ironManTexture = ironmanloader.load('rdj.jpeg'); // Example texture file
	ironManTexture.colorSpace = THREE.SRGBColorSpace;
    const ironManMaterial = new THREE.MeshPhongMaterial({ map: ironManTexture });




	{
		// const objLoader = new OBJLoader();
		// objLoader.load('IronMan.obj', (root) => {

		//   root.scale.set(0.01, 0.01, 0.01); 
		//   root.position.set(-3.5, -1, 0);
		//   root.rotation.y = Math.PI / 4; 

		//   scene.add(root);
		// });


		// Load the OBJ model
		const objLoader = new OBJLoader();
		objLoader.load('IronMan.obj', (root) => {
			root.scale.set(0.01, 0.01, 0.01);
			root.position.set(-3.5, -1, 0);
			root.rotation.y = Math.PI / 4.5;
			// root.traverse(child => {
			//     if (child instanceof THREE.Mesh) {
			//         child.material = ironManMaterial; // Apply the texture
			//     }
			// });
			scene.add(root);
		});
		
	}

	


	function makeInstance( geometry, material, x ) {

		// const material = new THREE.MeshPhongMaterial( { color } );
		
		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}


	const cubes = [
		makeInstance( geometry, material, 1 ),
		makeInstance( geometry, new THREE.MeshPhongMaterial({ color: 0x8844aa }), -1 ),
		makeInstance( geometry, new THREE.MeshPhongMaterial({ color: 0xaa8844 }) , 3 ),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
