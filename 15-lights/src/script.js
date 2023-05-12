import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

const ambientLightFolder = gui.addFolder('Ambient Light')
ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.01)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
// scene.add(directionalLight)

const directionalLightFolder = gui.addFolder('Directional Light')
directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.01)
directionalLightFolder.add(directionalLight.position, 'x', -1, 1, 0.01)
directionalLightFolder.add(directionalLight.position, 'y', 0, 1, 0.01)
directionalLightFolder.add(directionalLight.position, 'z', -1, 1, 0.01)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x000fff)
// scene.add(hemisphereLight)

const hemisphereLightFolder = gui.addFolder('Hemisphere Light')
hemisphereLightFolder.add(hemisphereLight, 'intensity', 0, 1, 0.01)
hemisphereLightFolder.add(hemisphereLight.position, 'y', -1, 1, 0.01)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 0, 2)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 1
// scene.add(pointLight)

const pointLightFolder = gui.addFolder('PointLight')
pointLightFolder.add(pointLight, 'intensity', 0, 1, 0.01)
pointLightFolder.add(pointLight, 'distance', -10, 10, 0.01)
pointLightFolder.add(pointLight, 'decay', -10, 10, 0.01)
pointLightFolder.add(pointLight.position, 'x', -10, 10, 0.01)
pointLightFolder.add(pointLight.position, 'y', -10, 10, 0.01)
pointLightFolder.add(pointLight.position, 'z', -10, 10, 0.01)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 1, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3()) // Looking at the center (0,0,0)
// scene.add(rectAreaLight)

// RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial
const rectAreaLightFolder = gui.addFolder('RectAreaLight')
rectAreaLightFolder.add(rectAreaLight, 'intensity', 0, 5, 0.01)
rectAreaLightFolder.add(rectAreaLight, 'height', 1, 10, 0.01)
rectAreaLightFolder.add(rectAreaLight, 'width', 1, 10, 0.01)
rectAreaLightFolder.add(rectAreaLight.position, 'x', -10, 10, 0.01)
rectAreaLightFolder.add(rectAreaLight.position, 'y', -10, 10, 0.01)
rectAreaLightFolder.add(rectAreaLight.position, 'z', -10, 10, 0.01)

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLight)

const spotLightFolder = gui.addFolder('SpotLight')
spotLightFolder.add(spotLight, 'angle', -1, 1, 0.01)
spotLightFolder.add(spotLight, 'penumbra', -1, 1, 0.01)
spotLightFolder.add(spotLight.position, 'x', -10, 10, 0.01)
spotLightFolder.add(spotLight.position, 'y', -10, 10, 0.01)
spotLightFolder.add(spotLight.position, 'z', -10, 10, 0.01)

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
