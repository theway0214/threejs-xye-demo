<script setup lang="ts">
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, useTemplateRef, onUnmounted, ref } from 'vue'

// 导入dat.gui
import * as dat from 'dat.gui'

const boxRef = useTemplateRef<HTMLDivElement>('boxRef')

// 声明全局变量以便在 resize 函数中访问
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let gui: dat.GUI
let clock: THREE.Clock

// 相机位置列表
const positionList = [
  {
    x: 100,
    y: 0,
    z: 0,
  },
  {
    x: 0,
    y: 20,
    z: 50,
  },
  {
    x: 0,
    y: 30,
    z: 100,
  },
  {
    x: 0,
    y: 0,
    z: 0,
  },
]

const handleResize = () => {
  if (camera && renderer) {
    // 更新相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // 更新渲染器尺寸
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 更新控制器
    if (controls) {
      controls.update()
    }
  }
}
// 初始化灯光
const initLight = () => {
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.set(18, 18, 18)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  // light.position.set(20, 20, 20)

  pointLight.castShadow = true

  pointLight.castShadow = true

  // 设置阴影贴图模糊度
  pointLight.shadow.radius = 20
  // 设置阴影贴图的分辨率
  pointLight.shadow.mapSize.set(512, 512)

  // 设置阴影贴图模糊度
  pointLight.shadow.radius = 20
  // 设置阴影贴图的分辨率
  pointLight.shadow.mapSize.set(512, 512)
  pointLight.decay = 0

  gui = new dat.GUI()

  gui.add(pointLight.position, 'x').min(-5).max(5).step(0.1)

  gui.add(pointLight, 'distance').min(0).max(100).step(0.001)
  gui.add(pointLight, 'decay').min(0).max(5).step(0.01)

  sphere.add(pointLight)
  sphere.name = 'lightSphere'

  scene.add(sphere)
}

// 初始刷物体
const initObject = () => {
  const group = new THREE.Group()
  group.name = 'group1'

  const geometry = new THREE.SphereGeometry(5, 32, 16)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)

  const axesHelper = new THREE.AxesHelper(100)
  cube.add(axesHelper)

  // 投射阴影
  cube.castShadow = true
  cube.name = 'ballCube'
  group.add(cube)

  const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 'gray' })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -Math.PI / 2
  plane.position.set(0, -5, 0)
  plane.receiveShadow = true
  group.add(plane)

  scene.add(group)
}

// 控制灯光滚动
const controlLight = () => {
  const lightSphere = scene.getObjectByName('lightSphere')

  const ballCube = scene.getObjectByName('ballCube')

  if (lightSphere) {
    lightSphere.position.x = Math.cos(clock.getElapsedTime()) * 10
    lightSphere.position.z = Math.sin(clock.getElapsedTime()) * 10
    lightSphere.position.y = Math.sin(clock.getElapsedTime()) * 5 + 5
  }

  if (ballCube) {
    // ballCube.position.x = ballCube.position.y + 1
  }
}

const init = async () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  clock = new THREE.Clock()
  camera.position.set(positionList[0].x, positionList[0].y, positionList[0].z)
  scene.add(camera)

  window.scene = scene

  await initLight()
  await initObject()

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true

  boxRef.value?.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enabled = true

  // 添加 resize 事件监听器
  window.addEventListener('resize', handleResize)

  const renderFun = () => {
    controls.update()
    renderer.render(scene, camera)
    controlLight()
    requestAnimationFrame(renderFun)
  }
  renderFun()
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <div ref="boxRef" class="box"></div>
</template>
<style scoped lang="less">
.box {
  width: 100%;
  height: 100%;
}
</style>
