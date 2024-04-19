import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';



function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );


	const fov = 75;
	const aspect = 2; 
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


    const loader = new THREE.TextureLoader();
    const texture = loader.load('jerry.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshPhongMaterial({ map: texture });



	const ironmanloader = new THREE.TextureLoader();
    const ironManTexture = ironmanloader.load('rdj.jpeg'); 
	ironManTexture.colorSpace = THREE.SRGBColorSpace;
    const ironManMaterial = new THREE.MeshPhongMaterial({ map: ironManTexture });

	let ironMan;

	const mtlLoader = new MTLLoader();
	const objLoader = new OBJLoader();
	mtlLoader.load('IronMan.mtl', (mtl) => {
		mtl.preload();
		objLoader.setMaterials(mtl); 
		objLoader.load('IronMan.obj', (root) => {
			root.scale.set(0.01, 0.01, 0.01);
			root.position.set(-3.5, -1, 0);
			root.rotation.y = Math.PI / 4.5;
			ironMan = root;
			scene.add(root);
		});
	});
	
		
	 


	function makeCubeInstance( geometry, material, x ) {

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}



	function makeSphereInstance(geometry, material, x, isSphere = false) {
		let mesh;
		if (isSphere) {
			mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
		} else {
			mesh = new THREE.Mesh(geometry, material);
		}
		scene.add(mesh);
		mesh.position.x = x;
		return mesh;
	}
	

	function makeCylinderInstance(geometry, material, x, isCylinder = false) {
		let mesh;
		if (isCylinder) {
			mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 32), material);
		} else {
			mesh = new THREE.Mesh(geometry, material);
		}
		scene.add(mesh);
		mesh.position.x = x;
		return mesh;
	}
	
	const cubes = [
		makeCubeInstance( geometry, material, 1 ),
		// makeInstance( geometry, new THREE.MeshPhongMaterial({ color: 0x8844aa }), -1 ),

		makeSphereInstance(geometry, new THREE.MeshPhongMaterial({ color: 0x44aa88 }), -1, true),

		makeCylinderInstance(geometry, new THREE.MeshPhongMaterial({ color: 0xaa8844 }), 3, true),
	];



	function render( time ) {

		time *= 0.001; 

		let ironmanspeed = 0;

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			let ironmanspeed = speed;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		if (ironMan) {
			ironMan.rotation.y = time;
        }



		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

// main();
window.onload = main;

