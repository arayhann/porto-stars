import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(-30);
camera.position.setX(-3);

renderer.render(scene, camera);

/**
 * Sizes
 */
 const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

const material = new THREE.MeshStandardMaterial({
  color: 0xFF6437,
  wireframe: true,
});

const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
scene.background = spaceTexture;


const wiwitTexture = new THREE.TextureLoader().load('wiwit.png');

const wiwit = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({
    map: wiwitTexture,
    
  })
);


wiwit.position.z = -5;
wiwit.position.x = 2;

scene.add(wiwit);

const moonTexture = new THREE.TextureLoader().load('moon.jpeg');
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

moon.position.z = 30;
moon.position.x = -10;


scene.add(moon);

let rotateY = 0
let rotateZ = 0

let targetY = 0
let targetZ = 0

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  rotateY += 0.01;
  rotateZ += 0.01;

  if (t * -0.01 > 0) {
    camera.position.z = t * -0.01;
  } else {
    camera.position.z = 0.1
  }
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

  console.log(camera.position)
}

document.body.onscroll = moveCamera;
moveCamera();

// THE LOOP

const clock = new THREE.Clock()


function animate() {
  requestAnimationFrame(animate);

  targetY = rotateY * 0.001;
  targetZ = rotateZ * 0.001;

  const elapsedTime = clock.getElapsedTime()

    // Update objects
  wiwit.rotation.y = .5 * elapsedTime
  wiwit.rotation.z = .5 * elapsedTime

  wiwit.rotation.y += .5 * (targetY - wiwit.rotation.y)
  wiwit.rotation.z += .5 * (targetZ - wiwit.rotation.z)

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
