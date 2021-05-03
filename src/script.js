import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import "./style.css"
import CANNON from "./cannon.js"

// Physics
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.gravity.set(0, -9.82, 0)

// Materials
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial, {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Sphere
const sphereShape = new CANNON.Sphere(1)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 1, 0),
    shape: sphereShape
})
sphereBody.castShadow = true
sphereBody.position.z = -4
world.addBody(sphereBody)

// Box
const Shape = new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5))
const Body = new CANNON.Body({
    mass: 10000,
    position: new CANNON.Vec3(0, 0.5, 0),
    shape: Shape,
    material: defaultMaterial
})
Body.castShadow = true
world.addBody(Body)

// Plane
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
)
floorBody.receiveShadow = true
world.addBody(floorBody)

const wallF = new CANNON.Plane()
const wallBF = new CANNON.Body({
    material: defaultMaterial
})
wallBF.mass = 0
wallBF.addShape(wallF)
wallBF.position.z = -25.1
world.addBody(wallBF)

const wallB = new CANNON.Plane()
const wallBB = new CANNON.Body({
    material: defaultMaterial
})
wallBB.mass = 0
wallBB.addShape(wallB)
wallBB.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI
)
wallBB.position.z = 25
world.addBody(wallBB)

const wallL = new CANNON.Plane()
const wallLB = new CANNON.Body({
    material: defaultMaterial
})
wallLB.mass = 0
wallLB.addShape(wallL)
wallLB.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    Math.PI * 0.5
)
wallLB.position.x = -25
world.addBody(wallLB)

const wallR = new CANNON.Plane()
const wallRB = new CANNON.Body({
    material: defaultMaterial
})
wallRB.mass = 0
wallRB.addShape(wallR)
wallRB.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, -1, 0), Math.PI * 0.5
)
wallRB.position.x = 25
world.addBody(wallRB)

// Visible World

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Texture
const texture = new THREE.TextureLoader()
const base = texture.load('beachball.png')

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Box
const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.1
    })
)
box.castShadow = true
scene.add(box)

// Light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

// dir
const dir = new THREE.DirectionalLight(0xffffff, 0.5)
dir.position.set(200, -100, 400)
dir.castShadow = true
scene.add(dir)

// Helper
// scene.add(new THREE.CameraHelper(dir.shadow.camera));

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({
        map: base
    })
)
sphere.castShadow = true
scene.add(sphere)

// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
    new THREE.MeshStandardMaterial({
        wireframe: true
    })
)
plane.receiveShadow = true
plane.rotation.x = -Math.PI * 0.5
scene.add(plane)

// const planeF = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(50, 10),
//     new THREE.MeshStandardMaterial({
//         color: 0xffffff
//     })
// )
// planeF.position.z = -25.1
// planeF.position.y = 5.009
// scene.add(planeF)

// const planeB = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(50, 10),
//     new THREE.MeshStandardMaterial({
//         color: 0xffffff
//     })
// )
// planeB.position.z = 25.1
// planeB.position.y = 5.009
// scene.add(planeB)

// Grids
const grid = new THREE.GridHelper(100, 50, 0x000000, 0x000000);
grid.material.opacity = 1;
grid.material.transparent = true;
grid.material.receiveShadow = true
scene.add(grid);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.y = 5
camera.position.z = 12
scene.add(camera)

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false
controls.dampingFactor = 0.25;
controls.enableZoom = false;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

// Animation
const clock = new THREE.Clock()
let oldelapsedTime = 0

// Main
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldelapsedTime
    oldelapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)

    // Sphere Position
    sphere.position.copy(sphereBody.position)
    sphere.quaternion.copy(sphereBody.quaternion)

    // Position Update
    box.position.copy(Body.position)
    box.quaternion.copy(Body.quaternion)

    // Render
    renderer.render(scene, camera)
    renderer.shadowMap.enabled = true;
    window.requestAnimationFrame(tick)

    // Camera
    cameraUpdate()
}

tick()

var vel = 5

// Controls
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 87) { //w
        Body.velocity.z = -vel
    } else if (event.keyCode == 83) { //s
        Body.velocity.z = +vel
    } else if (event.keyCode == 65) { //a
        Body.velocity.x = -vel
    } else if (event.keyCode == 68) { //d
        Body.velocity.x = +vel
    }
})

document.addEventListener('keyup', function(event) {
    if (event.keyCode == 32) {
        if (Body.position.y < 1) {
            Body.velocity.y = +vel
        }
    }
})

// Camera Follow
function cameraUpdate() {
    var offset = new THREE.Vector3(box.position.x, box.position.y + 5, box.position.z + 12);
    camera.position.lerp(offset, 0.04);
}