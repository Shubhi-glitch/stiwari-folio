"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr, Grid, Preload } from "@react-three/drei"
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { FBM_3D, PALETTE, SIMPLEX_3D } from "@/lib/glsl"

/* ────────────────────────────────────────────────────────────
   The manifold: an icosphere whose surface is displaced by fbm
   noise and shaded with a fresnel rim that shifts violet → sky.
   ──────────────────────────────────────────────────────────── */

const manifoldVertex = /* glsl */ `
uniform float uTime;
uniform float uAmplitude;
uniform float uPointer;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vDisplacement;

${SIMPLEX_3D}
${FBM_3D}

void main() {
  vec3 pos = position;

  // layered noise, slowly drifting through time
  float n = fbm(pos * 1.15 + vec3(0.0, uTime * 0.14, uTime * 0.08));
  float ripple = snoise(pos * 3.4 - uTime * 0.5) * 0.14;

  float amount = uAmplitude * (1.0 + uPointer * 0.7);
  float displacement = n * amount + ripple * amount * 0.5;

  pos += normal * displacement;
  vDisplacement = displacement;

  // recompute a usable normal by sampling two nearby offsets
  float eps = 0.035;
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)) + 1e-5);
  vec3 bitangent = normalize(cross(normal, tangent));

  vec3 pA = position + tangent * eps;
  vec3 pB = position + bitangent * eps;
  float nA = fbm(pA * 1.15 + vec3(0.0, uTime * 0.14, uTime * 0.08)) * amount;
  float nB = fbm(pB * 1.15 + vec3(0.0, uTime * 0.14, uTime * 0.08)) * amount;
  vec3 dA = (pA + normal * nA) - pos;
  vec3 dB = (pB + normal * nB) - pos;

  vNormal = normalize(normalMatrix * normalize(cross(dA, dB)) * -1.0);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

const manifoldFragment = /* glsl */ `
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vDisplacement;

${PALETTE}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);

  // fresnel rim
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);

  // key light
  vec3 lightDir = normalize(vec3(0.6, 0.9, 0.7));
  float diffuse = clamp(dot(n, lightDir), 0.0, 1.0);
  float spec = pow(clamp(dot(reflect(-lightDir, n), v), 0.0, 1.0), 28.0);

  // colour driven by displacement: peaks go sky blue, valleys stay violet
  float mixer = clamp(vDisplacement * 2.2 + 0.5, 0.0, 1.0);
  vec3 base = mix(COL_VIOLET * 0.42, COL_SKY * 0.72, mixer);

  vec3 color = COL_DEEP * 0.9;
  color += base * (0.25 + diffuse * 0.85);
  color += mix(COL_VIOLET, COL_SKY, 0.35 + 0.35 * sin(uTime * 0.4)) * fresnel * 1.5;
  color += COL_PALE * spec * 0.6;

  gl_FragColor = vec4(color, 1.0);
}
`

function Manifold() {
  const mesh = useRef<THREE.Mesh>(null)
  const cage = useRef<THREE.Mesh>(null)
  const pointerStrength = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.34 },
      uPointer: { value: 0 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t

    // pointer distance from centre drives extra turbulence
    const dist = Math.min(1, Math.hypot(state.pointer.x, state.pointer.y))
    pointerStrength.current += (dist - pointerStrength.current) * 0.05
    uniforms.uPointer.value = pointerStrength.current

    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.1
      mesh.current.rotation.z = Math.sin(t * 0.15) * 0.12
    }
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.06
      cage.current.rotation.x += delta * 0.03
    }
  })

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.5, 48]} />
        <shaderMaterial
          vertexShader={manifoldVertex}
          fragmentShader={manifoldFragment}
          uniforms={uniforms}
        />
      </mesh>

      {/* wireframe cage */}
      <mesh ref={cage} scale={1.42}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#3aa876" wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  )
}

/* ────────────────────────────────────────────────────────────
   Orbiting particle field driven entirely on the GPU
   ──────────────────────────────────────────────────────────── */

const fieldVertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
attribute float aScale;
attribute float aSpeed;
attribute float aOffset;
varying float vAlpha;

void main() {
  vec3 pos = position;

  // rotate each particle around Y at its own rate
  float angle = uTime * aSpeed * 0.25 + aOffset;
  float c = cos(angle);
  float s = sin(angle);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // gentle vertical bob
  pos.y += sin(uTime * 0.6 + aOffset * 3.0) * 0.18;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * (12.0 / -mv.z);

  vAlpha = smoothstep(14.0, 3.0, -mv.z) * 0.85;
}
`

const fieldFragment = /* glsl */ `
varying float vAlpha;
${PALETTE}

void main() {
  // round, soft point
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float falloff = smoothstep(0.5, 0.0, d);
  vec3 color = mix(COL_SKY, COL_VIOLET, gl_PointCoord.y);
  gl_FragColor = vec4(color, falloff * vAlpha);
}
`

function ParticleField({ count = 2600 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // distribute in a flattened disc shell around the manifold
      const radius = 2.4 + Math.pow(Math.random(), 0.6) * 5.5
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 4.2 * (1 - radius / 9)

      positions[i * 3] = Math.cos(theta) * radius
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(theta) * radius

      scales[i] = 0.35 + Math.random() * 1.5
      speeds[i] = 0.25 + Math.random() * 1.3
      offsets[i] = Math.random() * Math.PI * 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1))
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1))

    return {
      geometry: geo,
      uniforms: { uTime: { value: 0 }, uSize: { value: 2.6 } },
    }
  }, [count])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <points ref={points} geometry={geometry}>
      <shaderMaterial
        vertexShader={fieldVertex}
        fragmentShader={fieldFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ────────────────────────────────────────────────────────────
   Thin orbital rings, tilted on different axes
   ──────────────────────────────────────────────────────────── */

function Rings() {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.08
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })

  const rings = [
    { r: 2.6, tilt: [Math.PI / 2.1, 0, 0.2], color: "#3aa876", opacity: 0.32 },
    { r: 3.3, tilt: [Math.PI / 1.7, 0.4, 0], color: "#6bcf9f", opacity: 0.24 },
    { r: 4.2, tilt: [Math.PI / 2.6, -0.5, 0.6], color: "#2f8a63", opacity: 0.2 },
  ] as const

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.tilt as unknown as [number, number, number]}>
          <torusGeometry args={[ring.r, 0.004, 8, 220]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  )
}

/* ────────────────────────────────────────────────────────────
   Camera that drifts toward the pointer
   ──────────────────────────────────────────────────────────── */

function CameraRig() {
  const { camera, pointer } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.001, delta) // frame-rate independent lerp
    target.set(pointer.x * 1.1, 0.35 + pointer.y * 0.7, 7.2)
    camera.position.lerp(target, k)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ──────────────────────────────────────────────────────────── */

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.35, 7.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#0a0a0a", 8, 20]} />
      <ambientLight intensity={0.4} />

      <Manifold />
      <ParticleField />
      <Rings />

      {/* infinite technical floor */}
      <Grid
        position={[0, -2.6, 0]}
        args={[30, 30]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1a1a1a"
        sectionSize={2.5}
        sectionThickness={0.8}
        sectionColor="#3aa876"
        fadeDistance={22}
        fadeStrength={1.6}
        infiniteGrid
      />

      <CameraRig />
      <AdaptiveDpr pixelated />
      <Preload all />

      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={0.85} luminanceThreshold={0.22} luminanceSmoothing={0.5} mipmapBlur radius={0.7} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
