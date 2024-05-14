import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';



function main() {
	const canvas = document.querySelector( '#c' );

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
		alpha: true,
		logarithmicDepthBuffer: true,
	  });
	  
 

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;

	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	// camera.position.z = 4;
	camera.position.set(0, 10, 20);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 5, 0);
	controls.update();



	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

	

	{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		mesh.position.y = -1.2; // Move the ground down by 5 units
		scene.add( mesh );

	}


	{

		const cubeSize = 4;
		const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
		const cubeMat = new THREE.MeshPhongMaterial( { color: '#8AC' } );
		const mesh = new THREE.Mesh( cubeGeo, cubeMat );
		mesh.position.set( cubeSize + 2, cubeSize / 2, 0 );
		scene.add( mesh );

	}


	{

		const sphereRadius = 3;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
		const sphereMat = new THREE.MeshPhongMaterial( { color: '#CA8' } );
		const mesh = new THREE.Mesh( sphereGeo, sphereMat );
		mesh.position.set( - sphereRadius - 1, sphereRadius + 2, 0 );
		scene.add( mesh );

	}


	class ColorGUIHelper {

		constructor( object, prop ) {

			this.object = object;
			this.prop = prop;

		}
		get value() {

			return `#${this.object[ this.prop ].getHexString()}`;

		}
		set value( hexString ) {

			this.object[ this.prop ].set( hexString );

		}

	}


	class DegRadHelper {

		constructor( obj, prop ) {

			this.obj = obj;
			this.prop = prop;

		}
		get value() {

			return THREE.MathUtils.radToDeg( this.obj[ this.prop ] );

		}
		set value( v ) {

			this.obj[ this.prop ] = THREE.MathUtils.degToRad( v );

		}

	}

	function makeXYZGUI(gui, vector3, name, onChangeFn) {
		const folder = gui.addFolder(name);
	
		folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
		folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
		folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
		folder.open();
	}


	{

		// HEMISPHERE
		// const color = 0xFFFFFF;
		const skyColor = 0xB1E1FF;  // light blue
		const groundColor = 0xB97A20;  // brownish orange
		const intensity = 1;
		// const light = new THREE.AmbientLight( color, intensity );
		const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
		scene.add( light );

		// DIRECTIONAL
		const color = 0xFFFFFF;
		// const intensity = 1;
		const light2 = new THREE.DirectionalLight(color, intensity);
		light2.position.set(0, 10, 0);
		light2.target.position.set(-5, 0, 0);
		scene.add(light2);
		scene.add(light2.target);

		const helper = new THREE.DirectionalLightHelper(light2);
		scene.add(helper);

		// POINT
		const pointcolor = 0xFFFFFF;
		const pointintensity = 150;
		const pointlight = new THREE.PointLight( pointcolor, pointintensity );
		pointlight.position.set( 6, 8, 0 );
		scene.add( pointlight );


		const pointhelper = new THREE.PointLightHelper(pointlight);
		scene.add( pointhelper );


		// SPOTLIGHT

		const spotcolor = 0xFFFFFF;
		const spotintensity = 150;
		const spotlight = new THREE.SpotLight( spotcolor, spotintensity );
		spotlight.position.set( -10, 10, 0 );
		spotlight.target.position.set( - 5, 0, 0 );
		scene.add( spotlight );
		scene.add( spotlight.target );

		const spothelper = new THREE.SpotLightHelper( spotlight );
		scene.add( spothelper );

		function updateSpotLight() {

			spotlight.target.updateMatrixWorld();
			spothelper.update();

		}

		updateSpotLight();


		function updateLight() {

			light2.target.updateMatrixWorld();
			helper.update();

		}

		updateLight();

		
		function updatePointLight() {

			pointhelper.update();

		}




		const gui = new GUI();
		// HEMISPHERE
		// gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
		gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
		gui.addColor( new ColorGUIHelper( light, 'groundColor' ), 'value' ).name( 'groundColor' );
		gui.add( light, 'intensity', 0, 5, 0.01 );
		

		// const gui = new GUI();
		// DIRECTIONAL
		gui.addColor( new ColorGUIHelper( light2, 'color' ), 'value' ).name( 'color' );
		gui.add( light2, 'intensity', 0, 5, 0.01 );

		makeXYZGUI( gui, light2.position, 'position', updateLight );
		makeXYZGUI( gui, light2.target.position, 'target', updateLight );


		// POINT
		gui.addColor(new ColorGUIHelper(pointlight, 'color'), 'value').name('Point color');
		gui.add(pointlight, 'intensity', 0, 150, 1).name('Point intensity');
		gui.add(pointlight, 'distance', 0, 40).onChange(updateLight).name('Point distance');
		
		makeXYZGUI(gui, pointlight.position, 'position', updatePointLight);

		// makeXYZGUI( gui, pointlight.position, 'position' );

		// SPOTLIGHT

		gui.addColor( new ColorGUIHelper( spotlight, 'color' ), 'value' ).name( 'color' );
		gui.add( spotlight, 'intensity', 0, 250, 1 );
		gui.add( spotlight, 'distance', 0, 40 ).onChange( updateSpotLight );
		gui.add( new DegRadHelper( spotlight, 'angle' ), 'value', 0, 90 ).name( 'angle' ).onChange( updateSpotLight );
		gui.add( spotlight, 'penumbra', 0, 1, 0.01 );
		

		makeXYZGUI( gui, spotlight.position, 'position', updateSpotLight );
		makeXYZGUI( gui, spotlight.target.position, 'target', updateSpotLight );







	}



	class MinMaxGUIHelper {

		constructor( obj, minProp, maxProp, minDif ) {

			this.obj = obj;
			this.minProp = minProp;
			this.maxProp = maxProp;
			this.minDif = minDif;

		}
		get min() {

			return this.obj[ this.minProp ];

		}
		set min( v ) {

			this.obj[ this.minProp ] = v;
			this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

		}
		get max() {

			return this.obj[ this.maxProp ];

		}
		set max( v ) {

			this.obj[ this.maxProp ] = v;
			this.min = this.min; // this will call the min setter

		}

	}


	function updateCamera() {

		camera.updateProjectionMatrix();

	}



	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );


    const loader = new THREE.TextureLoader();
    const texture = loader.load('jerry.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshPhongMaterial({ map: texture });
	
    const tomloader = new THREE.TextureLoader();
    const tomtexture = tomloader.load('tom.png');
    tomtexture.colorSpace = THREE.SRGBColorSpace;
    const tommaterial = new THREE.MeshPhongMaterial({ map: tomtexture });
	
    const mickeyloader = new THREE.TextureLoader();
    const mickeytexture = mickeyloader.load('mickey.png');
    mickeytexture.colorSpace = THREE.SRGBColorSpace;
    const mickeymaterial = new THREE.MeshPhongMaterial({ map: mickeytexture });

    const donaldloader = new THREE.TextureLoader();
    const donaldtexture = donaldloader.load('donald.png');
    donaldtexture.colorSpace = THREE.SRGBColorSpace;
    const donaldmaterial = new THREE.MeshPhongMaterial({ map: donaldtexture });

    const mcqueenloader = new THREE.TextureLoader();
    const mcqueentexture = mcqueenloader.load('mcqueen.png');
    mcqueentexture.colorSpace = THREE.SRGBColorSpace;
    const mcqueenmaterial = new THREE.MeshPhongMaterial({ map: mcqueentexture });
	
    const materloader = new THREE.TextureLoader();
    const matertexture = materloader.load('mater.png');
    matertexture.colorSpace = THREE.SRGBColorSpace;
    const matermaterial = new THREE.MeshPhongMaterial({ map: matertexture });

    const woodyloader = new THREE.TextureLoader();
    const woodytexture = woodyloader.load('woody.png');
    woodytexture.colorSpace = THREE.SRGBColorSpace;
    const woodymaterial = new THREE.MeshPhongMaterial({ map: woodytexture });
	
    const buzzloader = new THREE.TextureLoader();
    const buzztexture = buzzloader.load('buzz.png');
    buzztexture.colorSpace = THREE.SRGBColorSpace;
    const buzzmaterial = new THREE.MeshPhongMaterial({ map: buzztexture });

    const elsaloader = new THREE.TextureLoader();
    const elsatexture = elsaloader.load('elsa.png');
    elsatexture.colorSpace = THREE.SRGBColorSpace;
    const elsamaterial = new THREE.MeshPhongMaterial({ map: elsatexture });

    const moanaloader = new THREE.TextureLoader();
    const moanatexture = moanaloader.load('moana.png');
    moanatexture.colorSpace = THREE.SRGBColorSpace;
    const moanamaterial = new THREE.MeshPhongMaterial({ map: moanatexture });
	
    const bambiloader = new THREE.TextureLoader();
    const bambitexture = bambiloader.load('bambi.png');
    bambitexture.colorSpace = THREE.SRGBColorSpace;
    const bambimaterial = new THREE.MeshPhongMaterial({ map: bambitexture });

    const cinderellaloader = new THREE.TextureLoader();
    const cinderellatexture = cinderellaloader.load('cinderella.png');
    cinderellatexture.colorSpace = THREE.SRGBColorSpace;
    const cinderellamaterial = new THREE.MeshPhongMaterial({ map: cinderellatexture });

    const peterpanloader = new THREE.TextureLoader();
    const peterpantexture = peterpanloader.load('peterpan.png');
    peterpantexture.colorSpace = THREE.SRGBColorSpace;
    const peterpanmaterial = new THREE.MeshPhongMaterial({ map: peterpantexture });

    const poohloader = new THREE.TextureLoader();
    const poohtexture = peterpanloader.load('pooh.png');
    poohtexture.colorSpace = THREE.SRGBColorSpace;
    const poohmaterial = new THREE.MeshPhongMaterial({ map: poohtexture });

    const ursulaloader = new THREE.TextureLoader();
    const ursulatexture = ursulaloader.load('ursula.png');
    ursulatexture.colorSpace = THREE.SRGBColorSpace;
    const ursulamaterial = new THREE.MeshPhongMaterial({ map: ursulatexture });

    const genieloader = new THREE.TextureLoader();
    const genietexture = genieloader.load('genie.png');
    genietexture.colorSpace = THREE.SRGBColorSpace;
    const geniematerial = new THREE.MeshPhongMaterial({ map: genietexture });

    const aladdinloader = new THREE.TextureLoader();
    const aladdintexture = aladdinloader.load('aladdin.png');
    aladdintexture.colorSpace = THREE.SRGBColorSpace;
    const aladdinmaterial = new THREE.MeshPhongMaterial({ map: aladdintexture });

    const mufasaloader = new THREE.TextureLoader();
    const mufasatexture = mufasaloader.load('mufasa.png');
    mufasatexture.colorSpace = THREE.SRGBColorSpace;
    const mufasamaterial = new THREE.MeshPhongMaterial({ map: mufasatexture });


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
	
		
	 


	function makeCubeInstance( geometry, material, x , y, z, size) {

		const cube = new THREE.Mesh(new THREE.BoxGeometry(size * 1, size * 1, size * 1), material);
		scene.add( cube );

		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;

		return cube;

	}



	function makeSphereInstance(geometry, material, x, y, z, size, isSphere = false) {
		let mesh;
		if (isSphere) {
			mesh = new THREE.Mesh(new THREE.SphereGeometry(size * 0.5, 32, 32), material);
		} else {
			mesh = new THREE.Mesh(geometry, material);
		}
		scene.add(mesh);
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		return mesh;
	}
	

	function makeCylinderInstance(geometry, material, x, y, z, size, isCylinder = false) {
		let mesh;
		if (isCylinder) {
			mesh = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.5, size * 0.5, size * 1, 32), material);
		} else {
			mesh = new THREE.Mesh(geometry, material);
		}
		scene.add(mesh);
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		return mesh;
	}
	
	const cubes = [
		makeCubeInstance( geometry, material, 1, 0, 0, 1),
		makeCubeInstance( geometry, new THREE.MeshPhongMaterial({ color: 0xff0000 }), -10, 5, -2, 1),
		makeCubeInstance( geometry, tommaterial, -8, 5, 5, 3),
		makeCubeInstance( geometry, matermaterial, 8, 5, -5, 2),
		makeCubeInstance( geometry, elsamaterial, 0, 10, -5, 2),
		makeCubeInstance( geometry, peterpanmaterial, -7, 10, -20, 3),
		makeCubeInstance( geometry, geniematerial, -5, 10, 5, 1),

		makeSphereInstance(geometry, new THREE.MeshPhongMaterial({ color: 0x44aa88 }), -1, 0, 0, 1, true),
		makeSphereInstance(geometry, mickeymaterial, 2, 5, -8, 4, true),
		makeSphereInstance(geometry, bambimaterial, 13, 5, 0, 4, true),
		makeSphereInstance(geometry, woodymaterial, -2, 1, -7, 3, true),
		makeSphereInstance(geometry, moanamaterial, 5, 10, -7, 3, true),
		makeSphereInstance(geometry, poohmaterial, 10, 5, -2, 2, true),
		makeSphereInstance(geometry, aladdinmaterial, 8, 10, 3, 1, true),

		makeCylinderInstance(geometry, new THREE.MeshPhongMaterial({ color: 0xaa8844 }), 3, 0, 0, 1, true),
		makeCylinderInstance(geometry, donaldmaterial, 3, 2, 5, 2, true),
		makeCylinderInstance(geometry, mcqueenmaterial, -10, 2, -10, 4, true),
		makeCylinderInstance(geometry, buzzmaterial, -5, 2, 5, 2, true),
		makeCylinderInstance(geometry, cinderellamaterial, -10, 10, -5, 2, true),
		makeCylinderInstance(geometry, ursulamaterial, -15, 8, 0, 1, true),
		makeCylinderInstance(geometry, mufasamaterial, -10, 8, 5, 2, true),

	];



	// const backgroundloader = new THREE.TextureLoader();
	// const bgTexture = backgroundloader.load( 'https://threejs.org/manual/examples/resources/images/daikanyama.jpg' );
	// bgTexture.colorSpace = THREE.SRGBColorSpace;
	// scene.background = bgTexture;

	const backgroundloader = new THREE.TextureLoader();
	const bgTexture = backgroundloader.load( 
		'https://threejs.org/manual/examples/resources/images/daikanyama.jpg', 
		() => {
			bgTexture.mapping = THREE.EquirectangularReflectionMapping;
			bgTexture.colorSpace = THREE.SRGBColorSpace;
			scene.background = bgTexture;
		});




	function render( time ) {

		time *= 0.001; 

		let ironmanspeed = 0;

		// Set the repeat and offset properties of the background texture
		// to keep the image's aspect correct.
		// Note the image may not have loaded yet.
		const canvasAspect = canvas.clientWidth / canvas.clientHeight;
		const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
		const aspect = imageAspect / canvasAspect;
		
		bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
		bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
		
		bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
		bgTexture.repeat.y = aspect > 1 ? 1 : aspect;

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

