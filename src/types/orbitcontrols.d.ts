declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, Vector3 } from 'three'
  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement)
    enabled: boolean
    target: Vector3
    minDistance: number
    maxDistance: number
    minZoom: number
    maxZoom: number
    minPolarAngle: number
    maxPolarAngle: number
    minAzimuthAngle: number
    maxAzimuthAngle: number
    enableDamping: boolean
    dampingFactor: number
    update(): void
    reset(): void
    dispose(): void
  }
}
