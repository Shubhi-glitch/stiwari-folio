"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

/**
 * The intro's centrepiece: a wireframe icosahedron caged inside a rotating
 * point cloud, both scaling in as the loader progresses.
 */
function Core({ progress }: { progress: number }) {
  const wire = useRef<THREE.LineSegments>(null)
  const cloud = useRef<THREE.Points>(null)
  const inner = useRef<THREE.Mesh>(null)

  const wireGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 1)
    return new THREE.WireframeGeometry(geo)
  }, [])

  const cloudGeometry = useMemo(() => {
    const count = 1400
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // even distribution on a sphere shell with slight thickness
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.3 + Math.random() * 0.35
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const p = Math.min(progress / 100, 1)

    if (wire.current) {
      wire.current.rotation.y += delta * 0.35
      wire.current.rotation.x = Math.sin(t * 0.3) * 0.25
      const s = 0.2 + p * 0.8
      wire.current.scale.setScalar(s)
    }
    if (cloud.current) {
      cloud.current.rotation.y -= delta * 0.12
      cloud.current.rotation.z += delta * 0.04
      cloud.current.scale.setScalar(0.4 + p * 0.6)
    }
    if (inner.current) {
      inner.current.scale.setScalar(0.1 + p * 0.55 + Math.sin(t * 2) * 0.02)
    }
  })

  return (
    <group>
      <lineSegments ref={wire} geometry={wireGeometry}>
        <lineBasicMaterial color="#3aa876" transparent opacity={0.55} />
      </lineSegments>

      <points ref={cloud} geometry={cloudGeometry}>
        <pointsMaterial
          size={0.022}
          color="#6bcf9f"
          transparent
          opacity={0.75}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <mesh ref={inner}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#2f8a63" transparent opacity={0.08} />
      </mesh>
      <mesh scale={0.14}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#eae8e2" />
      </mesh>
    </group>
  )
}

export function IntroScene({ progress }: { progress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Core progress={progress} />
    </Canvas>
  )
}
