<script setup lang="ts">
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, useTemplateRef, onUnmounted, ref } from 'vue'

// 导入动画库
import gsap from 'gsap'

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
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2 // 用于存储鼠标归一化坐标
let isDoorOpen = false

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

  // gui.add(pointLight.position, 'x').min(-5).max(5).step(0.1)

  // gui.add(pointLight, 'distance').min(0).max(100).step(0.001)
  // gui.add(pointLight, 'decay').min(0).max(5).step(0.01)

  sphere.add(pointLight)
  sphere.name = 'lightSphere'
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  scene.add(sphere)
}

// 初始刷物体
const initObject = () => {
  const group = new THREE.Group()
  group.name = 'group1'

  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    side: THREE.DoubleSide,
  })
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
  initDoor()
}

// 初始化门
const initDoor = () => {
  const textureLoader = new THREE.TextureLoader()
  const doorTexture = textureLoader.load('./textures/door/color.jpg')
  const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')

  const normalTexture = textureLoader.load('./textures/door/normal.jpg')

  // 环境贴图 -- 环境遮挡图
  const aoTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')

  const doorGeometry = new THREE.BoxGeometry(10, 10, 0.5)
  const doorMaterials = [
    new THREE.MeshStandardMaterial({ color: 'transparent' }), // 右
    new THREE.MeshStandardMaterial({ color: 'transparent' }), // 左
    new THREE.MeshStandardMaterial({ color: 'transparent' }), // 顶
    new THREE.MeshStandardMaterial({ color: 'transparent' }), // 底
    new THREE.MeshStandardMaterial({
      // 前（正面）
      map: doorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      normalMap: normalTexture,
      aoMap: aoTexture,
    }),
    new THREE.MeshStandardMaterial({
      // 后（背面）
      map: doorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      normalMap: normalTexture,
      aoMap: aoTexture,
    }),
  ]
  const door = new THREE.Mesh(doorGeometry, doorMaterials)
  door.position.set(5, 0, 0.1) // 让左侧为旋转轴
  door.name = 'door'

  // 创建pivot对象作为旋转轴
  const doorPivot = new THREE.Object3D()
  doorPivot.position.set(-5, 0, 5) // 门原本的位置
  doorPivot.name = 'doorPivot'
  doorPivot.add(door)
  scene.add(doorPivot)
}
// 开门动画
const initAnimation = (targetY: number) => {
  const doorPivot = scene.getObjectByName('doorPivot')
  if (doorPivot) {
    gsap.to(doorPivot.rotation, {
      y: targetY,
      duration: 1,
      ease: 'power2.inOut',
    })
  }
}

const onClick = (event: MouseEvent) => {
  if (!renderer || !camera || !controls) return

  // 获取 canvas 的尺寸和位置
  const rect = renderer.domElement.getBoundingClientRect()
  // 计算鼠标在 canvas 上的归一化坐标
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const door = scene.getObjectByName('door')
  const intersects = raycaster.intersectObjects([door].filter(Boolean) as THREE.Object3D[])
  if (intersects.length > 0) {
    if (!isDoorOpen) {
      initAnimation(-Math.PI / 4)
      isDoorOpen = true
    } else {
      initAnimation(0)
      isDoorOpen = false
    }
  }

  // // 获取所有小球对象
  // const sphere1 = scene.getObjectByName('sphereMesh')
  // const sphere2 = scene.getObjectByName('sphereMesh2')
  // const intersects = raycaster.intersectObjects(
  //   [sphere1, sphere2].filter(Boolean) as THREE.Object3D[],
  // )

  // if (intersects.length > 0) {
  //   // 命中小球，切换 OrbitControls 的 target
  //   const targetPos = intersects[0].object.position
  //   controls.target.copy(targetPos)
  //   controls.update()
  // }
}

const init = async () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  clock = new THREE.Clock()
  gui = new dat.GUI()
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
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
    requestAnimationFrame(renderFun)
  }
  renderFun()
}

onMounted(() => {
  init()
})
window.addEventListener('click', onClick)
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
