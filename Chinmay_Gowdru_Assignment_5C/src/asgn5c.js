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
	  
 

	const fov = 60; // 45
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;

	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set(0, 10, 27); 

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 5, 0);
	controls.update();



	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );



	{

		const planeSize = 42;

		const loader = new THREE.TextureLoader();
		// const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
		const texture = loader.load( 'ground.png' );
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
		// mesh.position.y = -1.2; // Move the ground down by 5 units
		scene.add( mesh );

	}


    // Fog
    {
		scene.fog = new THREE.Fog(0x4c0db2, 10, 60);

	}
  


	// {
// 
	// 	const cubeSize = 4;
	// 	const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
	// 	const cubeMat = new THREE.MeshPhongMaterial( { color: '#8AC' } );
	// 	const mesh = new THREE.Mesh( cubeGeo, cubeMat );
	// 	mesh.position.set( cubeSize + 2, cubeSize / 2, 0 );
	// 	scene.add( mesh );

	// }


	// {

	// 	const sphereRadius = 3;
	// 	const sphereWidthDivisions = 32;
	// 	const sphereHeightDivisions = 16;
	// 	const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
	// 	const sphereMat = new THREE.MeshPhongMaterial( { color: '#CA8' } );
	// 	const mesh = new THREE.Mesh( sphereGeo, sphereMat );
	// 	mesh.position.set( - sphereRadius - 1, sphereRadius + 2, 0 );
	// 	scene.add( mesh );

	// }


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
		pointlight.position.set( 6, 12, 8 );
		scene.add( pointlight );


		const pointhelper = new THREE.PointLightHelper(pointlight);
		scene.add( pointhelper );


		// SPOTLIGHT

		const spotcolor = 0xFFFFFF;
		const spotintensity = 150;
		const spotlight = new THREE.SpotLight( spotcolor, spotintensity );
		spotlight.position.set( -10, 10, 0 );
		spotlight.target.position.set( 5, 0, 0 );
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
			this.min = this.min;

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


	// walls
	const wallsloader = new THREE.TextureLoader();
    const wallsTexture = wallsloader.load('brick.png'); 
	wallsTexture.colorSpace = THREE.SRGBColorSpace;
    const wallsMaterial = new THREE.MeshPhongMaterial({ map: wallsTexture });


	// sun
	
	const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 });
	const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
	const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
	sunMesh.position.set(-20, 18, -8);
	sunMesh.scale.set(0.6, 0.6, 0.6);

	scene.add(sunMesh);
	
	// Create sunrays
	const sunraysCount = 20; // Number of sunrays
	const sunraysMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }); // Render both sides of the plane
	const sunraysRadius = 5; // Distance of the sunrays from the sun
	const sunraysWidth = 3; // Width of the sunrays
	const sunraysHeight = 10; // Height (thickness) of the sunrays
	const sunrayMeshes = []; // Array to store sunray meshes

	for (let i = 0; i < sunraysCount; i++) {
	const sunrayGeometry = new THREE.PlaneGeometry(sunraysWidth, sunraysHeight); // Width and height of the sunray
	const sunrayMesh = new THREE.Mesh(sunrayGeometry, sunraysMaterial);

	// Position and rotate the sunray around the sun
	const angle = (i / sunraysCount) * Math.PI * 2; // Calculate the angle for each sunray
	sunrayMesh.position.set(
		sunMesh.position.x + Math.cos(angle) * sunraysRadius,
		sunMesh.position.y,
		sunMesh.position.z + Math.sin(angle) * sunraysRadius
	);
	sunrayMesh.rotation.x = -Math.PI / 2; // Rotate the sunray to be horizontal

	scene.add(sunrayMesh);
	sunrayMeshes.push(sunrayMesh); // Add the sunray mesh to the array

	}


	let ironMan;

	const mtlLoader = new MTLLoader();
	const objLoader = new OBJLoader();
	mtlLoader.load('IronMan.mtl', (mtl) => {
		mtl.preload();
		objLoader.setMaterials(mtl); 
		objLoader.load('IronMan.obj', (root) => {
			root.position.set(-20, 5, 5);  // z -2
			root.rotation.y = Math.PI / 4.5;
			root.scale.set(0.03, 0.03, 0.03); 

			ironMan = root;
			scene.add(root);
		});
	});


	
	let Tree1;

	const mtlTreeLoader = new MTLLoader();
	const objTreeLoader = new OBJLoader();
	mtlTreeLoader.load('Tree.mtl', (mtl) => {
		mtl.preload();
		objTreeLoader.setMaterials(mtl); 
		objTreeLoader.load('Tree.obj', (root) => {
			root.position.set(-13, 0, -10);  // z -2
			root.scale.set(1.75, 1.75, 1.75); 
			Tree1 = root;
			scene.add(root);

			
			const treeClone = root.clone();
			treeClone.position.set(14, 0, -10); 
			scene.add(treeClone);
		});
	});

	
	
	let wall;

	const mtlWallLoader = new MTLLoader();
	const objWallLoader = new OBJLoader();
	mtlWallLoader.load('wall.mtl', (wallmtl) => {
		wallmtl.preload();
		objWallLoader.setMaterials(wallmtl); 
		objWallLoader.load('wall.obj', (root) => {
			root.position.set(-15, 0, -20);
			wall = root;
			scene.add(root);

			// back
			const wallClone = root.clone();
			wallClone.position.set(-5, 0, -20); 
			scene.add(wallClone);
			
			const wall2Clone = root.clone();
			wall2Clone.position.set(5, 0, -20); 
			scene.add(wall2Clone);

			const wall3Clone = root.clone();
			wall3Clone.position.set(15, 0, -20); 
			scene.add(wall3Clone);

			// left
			const wall4Clone = root.clone();
			wall4Clone.position.set(-20, 0, -15); 
			wall4Clone.rotation.y = Math.PI / 2;
			scene.add(wall4Clone);
			
			const wall5Clone = root.clone();
			wall5Clone.position.set(-20, 0, -5); 
			wall5Clone.rotation.y = Math.PI / 2;
			scene.add(wall5Clone);

			const wall6Clone = root.clone();
			wall6Clone.position.set(-20, 0, 5); 
			wall6Clone.rotation.y = Math.PI / 2;
			scene.add(wall6Clone);

			const wall7Clone = root.clone();
			wall7Clone.position.set(-20, 0, 15);
			wall7Clone.rotation.y = Math.PI / 2;
			scene.add(wall7Clone);

			// right
			const wall8Clone = root.clone();
			wall8Clone.position.set(20, 0, -15); 
			wall8Clone.rotation.y = Math.PI / 2;
			scene.add(wall8Clone);

			const wall9Clone = root.clone();
			wall9Clone.position.set(20, 0, -5); 
			wall9Clone.rotation.y = Math.PI / 2;
			scene.add(wall9Clone);
			
			const wall10Clone = root.clone();
			wall10Clone.position.set(20, 0, 5); 
			wall10Clone.rotation.y = Math.PI / 2;
			scene.add(wall10Clone);

			const wall11Clone = root.clone();
			wall11Clone.position.set(20, 0, 15); 
			wall11Clone.rotation.y = Math.PI / 2;
			scene.add(wall11Clone);

			// front
			const wall12Clone = root.clone();
			wall12Clone.position.set(-15, 0, 20); 
			scene.add(wall12Clone);

			const wall13Clone = root.clone();
			wall13Clone.position.set(-5, 0, 20); 
			scene.add(wall13Clone);
			
			const wall14Clone = root.clone();
			wall14Clone.position.set(5, 0, 20); 
			scene.add(wall14Clone);

			const wall15Clone = root.clone();
			wall15Clone.position.set(15, 0, 20); 
			scene.add(wall15Clone);


			

		});
	});


	
	let leia;

	

	// Load the texture
	const textureLeiaLoader = new THREE.TextureLoader();
	textureLeiaLoader.load('peach.png', (texture) => {

		// Create a material with the loaded texture
		const material = new THREE.MeshBasicMaterial({ map: texture });

		const objSoldierLoader = new OBJLoader();

		objSoldierLoader.load('leia.obj', (root) => {

			root.position.set(1.25, 0, -5);
			root.scale.set(0.15, 0.15, 0.15); 

			// Apply the material to the soldier object
			root.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material;
				}
			});

			leia = root;
			scene.add(root);
		});
	});



		
	let castle;

	

	{

		const objCastleLoader = new OBJLoader();
		const textureLoader = new THREE.TextureLoader();

		objCastleLoader.load('tinker.obj', (root) => {
		const genieColor = 0xB59410; 

		// Load the texture
		const texture = textureLoader.load('buzz.png');

		// Create a material that supports textures
		const genieMaterial = new THREE.MeshLambertMaterial({
			map: texture, 
			color: genieColor 
		});

		root.traverse((child) => {
			if (child instanceof THREE.Mesh) {
			child.material = genieMaterial;
			}
		});

		root.rotation.x = Math.PI / 2;
		root.rotation.y = Math.PI;
		root.rotation.z = Math.PI;
		root.scale.set(0.25, 0.25, 0.25);
		root.position.set(0, 0.25, -10);
		castle = root;
		scene.add(root);

		});
	}


	
	
	
	
	
	let gull;

	const objGullLoader = new OBJLoader();

	objGullLoader.load('GULL.OBJ', (root) => {
		root.position.set(20, 11, -10); 
		root.rotation.y = -Math.PI / 2;
		root.scale.set(30, 30, 30);
		gull = root;
		scene.add(root);

	});

	
	let bench1;

	const objBenchLoader = new OBJLoader();

	objBenchLoader.load('bench_w_spine.obj', (root) => {
	
		const genieColor = 0x5C4033; // Green color (you can change this to any other hex color value)
		const genieMaterial = new THREE.MeshBasicMaterial({ color: genieColor });

		// Apply the material to all child meshes
		root.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = genieMaterial;
			}
		});

		root.position.set(-18, 0, 4); 
		root.rotation.y = -Math.PI / 2;
		root.scale.set(0.08, 0.08, 0.08);
		bench1 = root;
		scene.add(root);

		
		const bench1Clone = root.clone();
		bench1Clone.rotation.y = Math.PI / 2;
		bench1Clone.position.set(18, 0, 4); 
		scene.add(bench1Clone);

	});



	let soldiers = [];

	// Load the texture
	const textureLoader = new THREE.TextureLoader();
	textureLoader.load('military.png', (texture) => {

		// Create a material with the loaded texture
		const material = new THREE.MeshBasicMaterial({ map: texture });

		const objSoldierLoader = new OBJLoader();

		objSoldierLoader.load('18821_Soldier_standing_with_rifle_resting_on_shoulder_v2.obj', (root) => {

			root.position.set(-15, 0.25, 12);
			root.rotation.x = -Math.PI / 2;
			root.scale.set(0.75, 0.75, 0.75);

			// Apply the material to the soldier object
			root.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material;
				}
			});

			soldiers.push(root);
			scene.add(root);

			const soldier2Clone = root.clone();
			soldier2Clone.position.set(-5, 0.25, 12); 
			scene.add(soldier2Clone);
			soldiers.push(soldier2Clone);

			const soldier3Clone = root.clone();
			soldier3Clone.position.set(5, 0.25, 12); 
			scene.add(soldier3Clone);
			soldiers.push(soldier3Clone);
			
			const soldier4Clone = root.clone();
			soldier4Clone.position.set(15, 0.25, 12); 
			scene.add(soldier4Clone);
			soldiers.push(soldier4Clone);
		});
	});


	
	let soldier2;

	// Load the texture
	const texture2Loader = new THREE.TextureLoader();
	texture2Loader.load('military.png', (texture) => {

		// Create a material with the loaded texture
		const material = new THREE.MeshBasicMaterial({ map: texture });

		const objSoldierLoader = new OBJLoader();

		objSoldierLoader.load('18825_Soldier_on_one_knee_firing_a_rifle_v1_NEW.obj', (root) => {

			root.position.set(0, 0.2, 14);
			root.rotation.x = -Math.PI / 2;
			root.scale.set(0.75, 0.75, 0.75);

			// Apply the material to the soldier object
			root.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material;
				}
			});

			soldier2 = root;
			soldier2.rotation.z = -Math.PI / 2.5;
			soldier2.position.set(-1.5,0.2,14);

			scene.add(root);

			const soldier2Clone = root.clone();
			soldier2Clone.position.set(-12, 0.2, 12); 
			soldier2Clone.rotation.z = -Math.PI / 2;
			scene.add(soldier2Clone);
			
			const soldier3Clone = root.clone();
			soldier3Clone.position.set(10, 0.1, 14); 
			soldier3Clone.rotation.z = Math.PI / 11;
			scene.add(soldier3Clone);
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
	
	const walls = [
		// back
		makeCubeInstance( geometry, wallsMaterial, -15, 5.25, -26, 10),
		makeCubeInstance( geometry, wallsMaterial, -5, 5.25, -26, 10),
		makeCubeInstance( geometry, wallsMaterial, 5, 5.25, -26, 10),
		makeCubeInstance( geometry, wallsMaterial, 15, 5.25, -26, 10),

		// front
		makeCubeInstance( geometry, wallsMaterial, -15, 5.25, 26, 10),
		makeCubeInstance( geometry, wallsMaterial, -5, 5.25, 26, 10),
		makeCubeInstance( geometry, wallsMaterial, 5, 5.25, 26, 10),
		makeCubeInstance( geometry, wallsMaterial, 15, 5.25, 26, 10),

		// left
		makeCubeInstance( geometry, wallsMaterial, -26, 5.25, -26, 10),
		makeCubeInstance( geometry, wallsMaterial, -26, 5.25, -16, 10),
		makeCubeInstance( geometry, wallsMaterial, -26, 5.25, -6, 10),
		makeCubeInstance( geometry, wallsMaterial, -26, 5.25, 4, 10),
		makeCubeInstance( geometry, wallsMaterial, -26, 5.25, 14, 10),
		makeCubeInstance( geometry, wallsMaterial, -26, 5.25, 24, 10),
		
		// right
		makeCubeInstance( geometry, wallsMaterial, 26, 5.25, -26, 10),
		makeCubeInstance( geometry, wallsMaterial, 26, 5.25, -16, 10),
		makeCubeInstance( geometry, wallsMaterial, 26, 5.25, -6, 10),
		makeCubeInstance( geometry, wallsMaterial, 26, 5.25, 4, 10),
		makeCubeInstance( geometry, wallsMaterial, 26, 5.25, 14, 10),
		makeCubeInstance( geometry, wallsMaterial, 26, 5.25, 24, 10),



	]
	
	const cubes = [
		// // makeCubeInstance( geometry, material, 15, 2, 0, 3),
		// // makeCubeInstance( geometry, new THREE.MeshPhongMaterial({ color: 0xff0000 }), -10, 5, -2, 1),
		// // makeCubeInstance( geometry, tommaterial, -8, 5, 8, 3),
		// makeCubeInstance( geometry, matermaterial, 15, 10, -5, 3),
		// makeCubeInstance( geometry, elsamaterial, -15, 10, -5, 2),
		// makeCubeInstance( geometry, peterpanmaterial, -8, 10, -25, 5),
		// makeCubeInstance( geometry, geniematerial, -12, 1, 8, 2),

		// // makeSphereInstance(geometry, new THREE.MeshPhongMaterial({ color: 0x44aa88 }), -1, 0, 0, 1, true),
		// makeSphereInstance(geometry, mickeymaterial, 15, 5, -15, 4, true),
		// // makeSphereInstance(geometry, bambimaterial, -13, 7, 0, 4, true),
		// makeSphereInstance(geometry, woodymaterial, 0, 1, -7, 3, true),
		// makeSphereInstance(geometry, moanamaterial, 10, 10, 10, 3, true),
		// makeSphereInstance(geometry, poohmaterial, -15, 15, -2, 4, true),
		// makeSphereInstance(geometry, aladdinmaterial, 14, 10, 3, 1, true),

		// // makeCylinderInstance(geometry, new THREE.MeshPhongMaterial({ color: 0xaa8844 }), 3, 0, 0, 1, true),
		// makeCylinderInstance(geometry, donaldmaterial, -30, 2, -15, 4, true),
		// // makeCylinderInstance(geometry, mcqueenmaterial, 7, 2, 10, 4, true),
		// makeCylinderInstance(geometry, buzzmaterial, 10, 15, -5, 4, true),
		// makeCylinderInstance(geometry, cinderellamaterial, -10, 10, 10, 2, true),
		// makeCylinderInstance(geometry, ursulamaterial, 0, 12, 0, 2, true),
		// makeCylinderInstance(geometry, mufasamaterial, 0, 3, 10, 2, true),

	];



	// const backgroundloader = new THREE.TextureLoader();
	// const bgTexture = backgroundloader.load( 'https://threejs.org/manual/examples/resources/images/daikanyama.jpg' );
	// bgTexture.colorSpace = THREE.SRGBColorSpace;
	// scene.background = bgTexture;

	// castle2.png
	const backgroundloader = new THREE.TextureLoader();
	const bgTexture = backgroundloader.load( 
		'sky.jpg', 
		() => {
			bgTexture.mapping = THREE.EquirectangularReflectionMapping;
			bgTexture.colorSpace = THREE.SRGBColorSpace;
			scene.background = bgTexture;
		});


	let reachedMaxPositionX = false;
	
	let angle = 0;
	const gullradius = 23;

	let lastPosition = { x: gullradius * Math.cos(angle), z: gullradius * Math.sin(angle) };


	let rotationAngle = 0;

	// Sun movement parameters
	const sunSpeed = 0.1; // Adjust this value for desired speed
	let sunDirection = 1; // 1 for moving right, -1 for moving left


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



		// Calculate the position of Iron Man based on time
		const amplitude = 10; // adjust the amplitude as needed
		const frequency = 1; // adjust the frequency as needed
		const offsetX = Math.sin(time * frequency) * amplitude;

		const maxPositionX = 9;
		const minX = -9;



		// Define circular motion parameters
		const radius = 10;  // Radius of the circular path
		const speed = 1;    // Speed of rotation

		if (ironMan) {

			ironMan.rotation.x = -30;
			

			ironMan.rotation.y = -25.15;
			
			ironMan.rotation.z = 11;

			ironMan.position.x = offsetX;
			const area = ironMan.position.x;


			if (ironMan.position.x >= maxPositionX) {
				ironMan.position.x = area;
				ironMan.rotation.z = Math.PI * 2 / 4; // 180 degrees in radians
				reachedMaxPositionX = true;
			} else if (reachedMaxPositionX && ironMan.position.x < maxPositionX && ironMan.position.x > minX) {
				ironMan.rotation.z = Math.PI * 2 / 4;
			} else if (reachedMaxPositionX && ironMan.position.x <= minX) {
				ironMan.rotation.z = 0;
				reachedMaxPositionX = false; // Reset the flag
				ironMan.position.x = area;

			}
			
			

        }

		soldiers.forEach((soldier) => {
			soldier.rotation.z = time;
		});
	


		// Move the sun left to right
		sunMesh.position.x += sunSpeed * sunDirection;

		// Reverse direction if the sun reaches the boundaries
		if (sunMesh.position.x > 20 || sunMesh.position.x < -20) {
			sunDirection *= -1;
		}

		rotationAngle += 0.05; // Adjust the rotation speed as needed
		// Update sunray positions based on the new sun position
		for (let i = 0; i < sunraysCount; i++) {
			const sunrayMesh = sunrayMeshes[i];
			const angle = (i / sunraysCount) * Math.PI * 2;
			sunrayMesh.position.set(
			sunMesh.position.x + Math.cos(angle + rotationAngle) * sunraysRadius,
			sunMesh.position.y,
			sunMesh.position.z + Math.sin(angle + rotationAngle) * sunraysRadius
			);
		}

		if (gull) {

			angle += 0.01; 

			// Calculate the new position
			const newPosition = {
				x: gullradius * Math.cos(angle),
				z: gullradius * Math.sin(angle)
			};

			// Calculate the direction vector
			const direction = {
				x: newPosition.x - lastPosition.x,
				z: newPosition.z - lastPosition.z
			};

			// Calculate the rotation around the Y-axis based on the direction of movement
			const rotationY = Math.atan2(direction.x, direction.z);

			// Update the gull's position and rotation
			gull.position.x = newPosition.x;
			gull.position.z = newPosition.z;
			gull.rotation.y = rotationY;

			// Update the last position
			lastPosition = newPosition;
					
		}
		

		// Calculate the new fog parameters
		const near = 5 + Math.sin(time) * 10; // adjust the near distance dynamically
		const far = 70 + Math.cos(time) * 10; // adjust the far distance dynamically

		// Update the fog
		scene.fog.near = near;
		scene.fog.far = far;


		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

// main();
window.onload = main;

