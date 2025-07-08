<script setup lang="ts">
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, useTemplateRef } from 'vue'

const boxRef = useTemplateRef<HTMLDivElement>('boxRef')

const initScene = () => {
  // 1、创建场景
  const scene = new THREE.Scene()

  // 2、创建相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

  // 设置相机位置
  camera.position.set(0, 0, 10)
  scene.add(camera)
  // 导入纹理
  const textureLoader = new THREE.TextureLoader()
  // 颜色贴图
  const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
  // 透明贴图
  const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
  // 环境贴图 -- 环境遮挡图
  const aoTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
  // 法线贴图 -- 控制法线
  const normalTexture = textureLoader.load('./textures/door/normal.jpg')
  // 高光贴图 -- 控制高光
  const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
  // 金属度贴图 -- 控制金属度
  const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg')

  // 替换贴图 -- 增加凹凸感 厚度
  const displacementTexture = textureLoader.load('./textures/door/height.jpg')

  console.log(doorColorTexture)
  //
  // const light = new THREE.AmbientLight(0xffffff, 0.5)
  // scene.add(light)
  // 点光源
  // const pointLight = new THREE.PointLight(0xffffff, 1, 0)
  // pointLight.position.set(50, 50, 50)
  // scene.add(pointLight)

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(0, 200, 200)
  scene.add(directionalLight)

  // // 环境光
  // const ambientLight = new THREE.AmbientLight(0x404040, 1)
  // scene.add(ambientLight)

  // 添加物体
  const cubeGeometry = new THREE.BoxGeometry(10, 10, 10, 200, 200, 200)
  // 材质
  const basicMaterial = new THREE.MeshStandardMaterial({
    color: '#ffff00',
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: aoTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    roughness: 0,
    metalnessMap: metalnessTexture,
    metalness: 0.3,
    displacementMap: displacementTexture,
    // displacementScale: 0.5,
    // 启用透明度
    transparent: true,
    // 设置透明度测试阈值
    // alphaTest: 0.1,
    // 设置双面渲染
    side: THREE.DoubleSide,
  })
  const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
  scene.add(cube)

  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer()
  // 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // console.log(renderer);
  // 将webgl渲染的canvas内容添加到body
  if (boxRef.value) {
    boxRef.value.appendChild(renderer.domElement)
  }

  // // 使用渲染器，通过相机将场景渲染进来
  // renderer.render(scene, camera);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
  controls.enableDamping = true

  // 添加坐标轴辅助器
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  // 设置时钟
  const clock = new THREE.Clock()

  function render() {
    controls.update()
    renderer.render(scene, camera)
    //   渲染下一帧的时候就会调用render函数
    requestAnimationFrame(render)
  }

  render()

  // 监听画面变化，更新渲染画面
  window.addEventListener('resize', () => {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix()

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
  })
}

onMounted(() => {
  initScene()
})
</script>

<template>
  <div class="box text-size-30px" ref="boxRef"></div>
</template>

<style scoped>
.box {
  width: 100vw;
  height: 100vh;
}
</style>
