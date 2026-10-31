import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, AdaptiveDpr } from '@react-three/drei'
import { pointer, tickPointer, scrollProgress } from '../lib/pointer'
import Ghost from './Ghost'

/* The camera never moves. Parallax is applied to the background group
   instead, so a world coordinate always maps to the same place on screen
   and the ghost's lane maths stays exact. */
function Parallax({ group }) {
  const look = useRef(0)
  useFrame((_, dt) => {
    const d = Math.min(0.05, dt)
    tickPointer(d)
    const st = scrollProgress()
    const g = group.current
    if (!g) return
    g.position.x += (-pointer.nx * 0.9 - g.position.x) * Math.min(1, d * 1.7)
    g.position.y += (-pointer.ny * 0.55 + st * 2.2 - g.position.y) * Math.min(1, d * 1.7)
    look.current += (st * 0.1 - look.current) * Math.min(1, d * 1.7)
    g.rotation.z = look.current * 0.1
  })
  return null
}

export default function Scene({ onGhostSay, explaining, phone }) {
  const bg = useRef()
  return (
    <Canvas
      className="scene"
      dpr={phone ? [1, 1.4] : [1, 1.7]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 12], fov: 45, near: 0.1, far: 240 }}
    >
      <color attach="background" args={['#0b0e13']} />
      <fogExp2 attach="fog" args={['#0b0e13', 0.0072]} />

      <ambientLight intensity={2.1} />
      <directionalLight position={[4, 7, 6]} intensity={2.1} color="#cfe2f7" />
      <directionalLight position={[-6, 1, -4]} intensity={1.3} color="#3f7fd0" />

      {/* everything that drifts lives in here; the camera stays put */}
      <group ref={bg}>
        <Stars radius={110} depth={70} count={phone ? 1200 : 3000} factor={3.4} saturation={0} fade speed={0.25} />
        <Sparkles count={phone ? 70 : 160} scale={[34, 20, 14]} position={[0, 0, -9]} size={2.6} speed={0.26} opacity={0.5} color="#9cc4ee" />
        {!phone && (
          <Sparkles count={90} scale={[22, 14, 8]} position={[0, 0, -3]} size={1.7} speed={0.4} opacity={0.35} color="#dce9f8" />
        )}
      </group>

      {/* the ghost is pinned to the viewport, never parallaxed. He wants a
          cursor and a desktop GPU, so he sits out on phones entirely. */}
      {!phone && (
        <Suspense fallback={null}>
          <Ghost onSay={onGhostSay} explaining={explaining} />
        </Suspense>
      )}

      <Parallax group={bg} />
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
