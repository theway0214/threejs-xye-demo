<script setup lang="ts">
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, useTemplateRef, onUnmounted, ref } from 'vue'
import { Raycaster, Vector2 } from 'three'

const boxRef = useTemplateRef<HTMLDivElement>('boxRef')

// 声明全局变量以便在 resize 函数中访问
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let raycaster: THREE.Raycaster // 用于点击检测
let mouse: THREE.Vector2 // 用于存储鼠标归一化坐标

// 相机位置列表
const positionList = [
  {
    x: 0,
    y: 0,
    z: 50,
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

const currentIndex = ref(0)

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

const init = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(positionList[0].x, positionList[0].y, positionList[0].z)
  scene.add(camera)

  // const light = new THREE.DirectionalLight(0xffffff, 1)
  // light.position.set(0, 200, 200)
  // scene.add(light)

  // const geometry = new THREE.BoxGeometry(10, 10, 10)
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // const cube = new THREE.Mesh(geometry, material)
  // scene.add(cube)

  // 添加纹理
  const textureLoader = new THREE.CubeTextureLoader()

  const envMapTexture = textureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
  ])

  // 创建球体
  const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)

  const sphereMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.1,
    metalness: 0.5,
    // envMap: envMapTexture,
  })

  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh.name = 'sphereMesh'
  scene.add(sphereMesh)

  const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh2.name = 'sphereMesh2'
  sphereMesh2.position.set(0, 0, -500)
  scene.add(sphereMesh2)

  scene.background = envMapTexture

  scene.environment = envMapTexture

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  boxRef.value?.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enabled = true

  // 初始化 Raycaster 和鼠标向量
  raycaster = new Raycaster()
  mouse = new Vector2()

  // 添加 resize 事件监听器
  window.addEventListener('resize', handleResize)

  const renderFun = () => {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(renderFun)
  }
  renderFun()
}

// 鼠标点击事件处理函数
const onClick = (event: MouseEvent) => {
  if (!renderer || !camera || !controls) return

  // 获取 canvas 的尺寸和位置
  const rect = renderer.domElement.getBoundingClientRect()
  // 计算鼠标在 canvas 上的归一化坐标
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  // 获取所有小球对象
  const sphere1 = scene.getObjectByName('sphereMesh')
  const sphere2 = scene.getObjectByName('sphereMesh2')
  const intersects = raycaster.intersectObjects(
    [sphere1, sphere2].filter(Boolean) as THREE.Object3D[],
  )

  if (intersects.length > 0) {
    // 命中小球，切换 OrbitControls 的 target
    const targetPos = intersects[0].object.position
    controls.target.copy(targetPos)
    controls.update()
  }
}

onMounted(() => {
  init()
  // 添加鼠标点击事件监听器
  window.addEventListener('click', onClick, false)
})

// 通过键盘控制物体移动
window.addEventListener('keydown', (e) => {
  const sphereMesh = scene.getObjectByName('sphereMesh')
  if (!sphereMesh) return

  // 移动球体
  if (e.key === 'w') {
    sphereMesh.position.z -= 0.1
  }
  if (e.key === 's') {
    sphereMesh.position.z += 0.1
  }
  if (e.key === 'a') {
    sphereMesh.position.x -= 0.1
  }
  if (e.key === 'd') {
    sphereMesh.position.x += 0.1
  }

  // 相机跟随球体移动
  // camera.position.x = sphereMesh.position.x
  // camera.position.y = sphereMesh.position.y + 10 // 相机在球体上方10个单位
  // camera.position.z = sphereMesh.position.z + 20 // 相机在球体后方20个单位

  // 让相机始终看向球体
  camera.lookAt(sphereMesh.position)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', onClick, false)
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
