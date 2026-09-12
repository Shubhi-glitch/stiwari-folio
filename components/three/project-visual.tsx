"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import type { Project } from "@/lib/site-data"

const VIOLET = "#2f8a63"
const SKY = "#3aa876"
const PALE = "#6bcf9f"

/* ── neural: nodes joined by edges, signal pulses along them ── */

function Neural({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null)
  const pulses = useRef<THREE.Points>(null)

  const { nodes, lineGeometry, pulseGeometry, pulsePaths } = useMemo(() => {
    // three layers, like a tiny MLP
    const layers = [4, 6, 5, 3]
    const pts: THREE.Vector3[] = []
    const layerIndex: number[][] = []

    layers.forEach((count, li) => {
      const idx: number[] = []
      for (let i = 0; i < count; i++) {
        pts.push(new THREE.Vector3((li - (layers.length - 1) / 2) * 1.15, (i - (count - 1) / 2) * 0.62, 0))
        idx.push(pts.length - 1)
      }
      layerIndex.push(idx)
    })

    const linePositions: number[] = []
    const paths: [THREE.Vector3, THREE.Vector3][] = []
    for (let li = 0; li < layerIndex.length - 1; li++) {
      for (const a of layerIndex[li]) {
        for (const b of layerIndex[li + 1]) {
          linePositions.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z)
          if (Math.random() > 0.62) paths.push([pts[a], pts[b]])
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))

    const pulseGeo = new THREE.BufferGeometry()
    pulseGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(paths.length * 3), 3))

    return { nodes: pts, lineGeometry: lineGeo, pulseGeometry: pulseGeo, pulsePaths: paths }
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.25) * 0.4 + (active ? 0.25 : 0)
      group.current.rotation.x = Math.sin(t * 0.18) * 0.12
    }
    if (pulses.current) {
      const attr = pulses.current.geometry.getAttribute("position") as THREE.BufferAttribute
      const speed = active ? 1.5 : 0.6
      for (let i = 0; i < pulsePaths.length; i++) {
        const [a, b] = pulsePaths[i]
        const p = (t * speed + i * 0.21) % 1
        attr.setXYZ(i, a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, a.z + (b.z - a.z) * p)
      }
      attr.needsUpdate = true
    }
  })

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={VIOLET} transparent opacity={0.16} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color={i % 3 === 0 ? SKY : VIOLET} />
        </mesh>
      ))}
      <points ref={pulses} geometry={pulseGeometry}>
        <pointsMaterial
          color={PALE}
          size={0.09}
          sizeAttenuation
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}

/* ── lattice: instanced bar chart wave ── */

function Lattice({ active }: { active: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const size = 10
  const count = size * size
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorA = useMemo(() => new THREE.Color(VIOLET), [])
  const colorB = useMemo(() => new THREE.Color(SKY), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime * (active ? 1.4 : 0.7)
    let i = 0
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const dx = x - size / 2 + 0.5
        const dz = z - size / 2 + 0.5
        const dist = Math.hypot(dx, dz)
        const h = 0.25 + (Math.sin(dist * 0.9 - t * 1.6) * 0.5 + 0.5) * 1.7

        dummy.position.set(dx * 0.34, h / 2 - 0.6, dz * 0.34)
        dummy.scale.set(0.2, h, 0.2)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)

        tmp.copy(colorA).lerp(colorB, THREE.MathUtils.clamp(h / 2, 0, 1))
        mesh.current.setColorAt(i, tmp)
        i++
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.35 + 0.6
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

/* ── flow: streaming ribbons of points ── */

function Flow({ active }: { active: boolean }) {
  const points = useRef<THREE.Points>(null)
  const count = 1800

  const { geometry, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const s = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      s[i * 3] = Math.random()
      s[i * 3 + 1] = (Math.random() - 0.5) * 2
      s[i * 3 + 2] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return { geometry: geo, seeds: s }
  }, [])

  useFrame((state) => {
    if (!points.current) return
    const t = state.clock.elapsedTime * (active ? 0.9 : 0.45)
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const prog = (seeds[i * 3] + t * 0.16) % 1
      const band = seeds[i * 3 + 1]
      const phase = seeds[i * 3 + 2]

      const x = (prog - 0.5) * 5.2
      const y = Math.sin(prog * Math.PI * 2 + phase) * 0.55 + band * 0.5
      const z = Math.cos(prog * Math.PI * 3 + phase) * 0.7
      attr.setXYZ(i, x, y, z)
    }
    attr.needsUpdate = true
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color={SKY}
        size={0.032}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ── orbit: nested rings with travelling bodies ── */

function Orbit({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null)
  const bodies = useRef<THREE.Group>(null)

  const config = useMemo(
    () => [
      { r: 1.0, speed: 1.0, tilt: 0.2, color: SKY },
      { r: 1.6, speed: -0.7, tilt: -0.5, color: VIOLET },
      { r: 2.2, speed: 0.45, tilt: 0.8, color: PALE },
    ],
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * (active ? 1.6 : 0.8)
    if (group.current) group.current.rotation.y += delta * 0.12
    if (bodies.current) {
      bodies.current.children.forEach((child, i) => {
        const c = config[i % config.length]
        child.position.set(Math.cos(t * c.speed) * c.r, Math.sin(t * c.speed) * c.r * Math.sin(c.tilt), Math.sin(t * c.speed) * c.r * Math.cos(c.tilt))
      })
    }
  })

  return (
    <group ref={group} rotation={[0.4, 0, 0.2]}>
      {config.map((c, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, c.tilt]}>
          <torusGeometry args={[c.r, 0.006, 8, 128]} />
          <meshBasicMaterial color={c.color} transparent opacity={0.35} />
        </mesh>
      ))}
      <group ref={bodies}>
        {config.map((c, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.07 + i * 0.02, 16, 16]} />
            <meshBasicMaterial color={c.color} />
          </mesh>
        ))}
      </group>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color={VIOLET} />
      </mesh>
    </group>
  )
}

/* ── terrain: wireframe surface, like a loss landscape ── */

function Terrain({ active }: { active: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  const marker = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => new THREE.PlaneGeometry(5, 5, 48, 48), [])
  const base = useMemo(() => Float32Array.from(geometry.attributes.position.array), [geometry])

  const height = (x: number, y: number, t: number) =>
    Math.sin(x * 1.1 + t * 0.5) * 0.28 + Math.cos(y * 1.3 - t * 0.35) * 0.24 + Math.sin((x + y) * 0.7) * 0.2

  useFrame((state) => {
    const t = state.clock.elapsedTime * (active ? 1.2 : 0.6)
    if (mesh.current) {
      const attr = mesh.current.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < attr.count; i++) {
        const x = base[i * 3]
        const y = base[i * 3 + 1]
        attr.setZ(i, height(x, y, t))
      }
      attr.needsUpdate = true
      mesh.current.rotation.z += 0.0008
    }
    if (marker.current) {
      // a marker wandering downhill across the surface
      const mx = Math.sin(t * 0.4) * 1.8
      const my = Math.cos(t * 0.33) * 1.8
      marker.current.position.set(mx, my, height(mx, my, t) + 0.12)
    }
  })

  return (
    <group rotation={[-1.05, 0, 0.35]} position={[0, -0.2, 0]}>
      <mesh ref={mesh} geometry={geometry}>
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.42} />
      </mesh>
      <mesh ref={marker}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={SKY} />
      </mesh>
    </group>
  )
}

/* ── prism: cluster of faceted solids ── */

function Prism({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null)

  const shapes = useMemo(
    () => [
      { pos: [0, 0, 0], scale: 1, detail: 0 },
      { pos: [1.5, 0.6, -0.5], scale: 0.42, detail: 0 },
      { pos: [-1.4, -0.5, 0.4], scale: 0.55, detail: 1 },
      { pos: [0.8, -1.2, 0.6], scale: 0.3, detail: 0 },
    ],
    [],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    const speed = active ? 2 : 1
    group.current.rotation.y += delta * 0.2 * speed
    group.current.children.forEach((child, i) => {
      child.rotation.x += delta * 0.3 * speed * (i % 2 === 0 ? 1 : -1)
      child.rotation.z += delta * 0.15 * speed
      child.position.y += Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.0016
    })
  })

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <group key={i} position={s.pos as [number, number, number]}>
          <mesh scale={s.scale}>
            <octahedronGeometry args={[1, s.detail]} />
            <meshBasicMaterial color={i % 2 === 0 ? VIOLET : SKY} wireframe />
          </mesh>
          <mesh scale={s.scale * 0.94}>
            <octahedronGeometry args={[1, s.detail]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? VIOLET : SKY}
              transparent
              opacity={0.08}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ── dispatcher ── */

const VARIANTS = {
  neural: Neural,
  lattice: Lattice,
  flow: Flow,
  orbit: Orbit,
  terrain: Terrain,
  prism: Prism,
} as const

export function ProjectVisual({
  variant,
  active = false,
  zoom = 1,
}: {
  variant: Project["variant"]
  active?: boolean
  zoom?: number
}) {
  const Variant = VARIANTS[variant] ?? Neural

  return (
    <Canvas
      camera={{ position: [0, 0, 6 / zoom], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <ambientLight intensity={0.6} />
      <Variant active={active} />
    </Canvas>
  )
}
