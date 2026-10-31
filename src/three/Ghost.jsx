import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { pointer, telemetry } from '../lib/pointer'

/* Arsyuta777's ghost, CC BY 4.0.

   He lives on a lane around the edge of the window, worked out from the real
   content column so he is never over the text. He does not chase the cursor:
   he wanders the lane at his own pace, capped speed, with pauses. You can
   still poke him. */

const HURT = ['ouch!', 'hey!', 'ow.', 'rude.', 'eek!']
const GLAD = ['boo', 'hi!', '♪', 'hehe']

const MAX_SPEED = 2.4 // world units per second along the lane

export default function Ghost({ onSay }) {
  const url = `${import.meta.env.BASE_URL}models/ghost.glb`
  const { scene, animations } = useGLTF(url)
  const group = useRef()
  const { actions } = useAnimations(animations, group)
  const { viewport, size } = useThree()
  const [clip, setClip] = useState('Idle')

  /* Use the loaded scene directly rather than cloning it. scene.clone() does
     NOT clone a skeleton: the clone stays bound to the original bones, and a
     skinned mesh renders from its bone matrices, so the group transform is
     ignored and it draws at the origin. There is only ever one ghost.
     Bind-pose geometry spans y 0.174..0.740, so shift down by its centre. */
  const model = useMemo(() => {
    scene.position.y = -0.457
    scene.traverse((m) => {
      if (m.isMesh || m.isSkinnedMesh) m.frustumCulled = false
    })
    return scene
  }, [scene])

  const mats = useMemo(() => {
    const list = []
    model.traverse((m) => {
      if ((m.isMesh || m.isSkinnedMesh) && m.material?.color) {
        list.push({ mat: m.material, base: m.material.color.clone() })
      }
    })
    return list
  }, [model])

  const st = useRef({
    s: 0, targetS: 0, vs: 0, roam: 0, pause: 0,
    stress: 0, hitT: 0, bubble: 0, act: 'drifting', seeded: false,
  })

  useEffect(() => {
    const next = actions?.[clip]
    if (!next) return
    next.reset().setEffectiveWeight(1).fadeIn(0.26).play()
    Object.entries(actions).forEach(([k, a]) => {
      if (k !== clip && a) a.fadeOut(0.26)
    })
    telemetry.ghostClip = clip
  }, [clip, actions])

  /* the lane, in world units on the z = 0 plane */
  const lane = useMemo(() => {
    const px2w = viewport.width / size.width
    const contentPx = Math.min(1020, size.width - 36)
    const gutterPx = (size.width - contentPx) / 2
    const sides = gutterPx >= 110
    const halfW = viewport.width / 2
    const halfH = viewport.height / 2
    const leftX = sides ? -halfW + (gutterPx * px2w) / 2 : -halfW + 0.85
    const rightX = sides ? halfW - (gutterPx * px2w) / 2 : halfW - 0.85
    const bottomY = -halfH + 0.9
    const topY = halfH - 1.9
    const L = sides ? topY - bottomY : 0
    const B = rightX - leftX
    return { leftX, rightX, bottomY, topY, L, B, total: L + B + L, sides }
  }, [viewport.width, viewport.height, size.width])

  const at = useMemo(
    () => (s, out) => {
      const v = Math.max(0, Math.min(lane.total, s))
      if (v < lane.L) {
        out.x = lane.leftX
        out.y = lane.topY - v
      } else if (v < lane.L + lane.B) {
        out.x = lane.leftX + (v - lane.L)
        out.y = lane.bottomY
      } else {
        out.x = lane.rightX
        out.y = lane.bottomY + (v - lane.L - lane.B)
      }
      return out
    },
    [lane],
  )

  const tmp = useMemo(() => ({ x: 0, y: 0 }), [])
  const grey = useMemo(() => new THREE.Color('#5c6672'), [])
  const screenV = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g || lane.total <= 0) return
    const s = st.current
    const d = Math.min(0.05, dt)
    s.hitT = Math.max(0, s.hitT - d)
    if (!s.seeded) {
      s.s = lane.total * 0.45
      s.targetS = s.s
      s.seeded = true
    }

    const cwx = (pointer.nx * viewport.width) / 2
    const cwy = (pointer.ny * viewport.height) / 2
    at(s.s, tmp)

    /* He wanders. He does not follow you. */
    if (s.stress > 0.6) {
      // the one exception: edge away from whoever just hit him
      s.targetS = cwx > tmp.x ? 0 : lane.total
      s.pause = 0
    } else if (s.pause > 0) {
      s.pause -= d
      s.targetS = s.s
    } else {
      s.roam -= d
      if (s.roam <= 0) {
        s.roam = 3.2 + Math.random() * 4.5
        // a short hop along the lane, never a dash across the window
        const span = lane.total * (0.1 + Math.random() * 0.22)
        s.targetS = Math.max(0, Math.min(lane.total, s.s + (Math.random() < 0.5 ? -span : span)))
        if (Math.random() < 0.3) s.pause = 1.4 + Math.random() * 2.6
      }
    }

    // ease toward the target, but never faster than MAX_SPEED
    const gap = s.targetS - s.s
    const want = Math.abs(gap) < 0.05 ? 0 : Math.sign(gap) * Math.min(MAX_SPEED, Math.abs(gap) * 1.1)
    s.vs += (want - s.vs) * Math.min(1, d * 2.2)
    s.vs = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, s.vs))
    s.s = Math.max(0, Math.min(lane.total, s.s + s.vs * d))

    at(s.s, tmp)
    const bob = Math.sin(state.clock.elapsedTime * 1.5) * 0.075
    g.position.set(tmp.x, tmp.y + bob, 0.4)

    // poking still works
    const pd = Math.hypot(cwx - tmp.x, cwy - tmp.y)
    if (pd < 1.0 && pointer.inside) {
      const impact = pointer.speed * 0.011 * (1 - pd / 1.0)
      if (impact > 0.02) {
        const before = s.stress
        s.stress = Math.min(1.8, s.stress + impact)
        s.hitT = 1.2
        if (s.bubble <= 0 && s.stress > before + 0.05) {
          s.bubble = 1.5
          onSay?.({ text: HURT[(Math.random() * HURT.length) | 0], hurt: true })
        }
      }
    }
    s.stress = Math.max(0, s.stress - d * 0.2)
    if (s.bubble > 0) {
      s.bubble -= d
      if (s.bubble <= 0) onSay?.(null)
    }

    // a recent hit always wins, so the bubble and the face never disagree
    let mood
    if (s.stress > 0.7) mood = 'scared'
    else if (s.hitT > 0 || s.stress > 0.25) mood = 'startled'
    else if (pd < 2.0 && pointer.speed < 8 && pointer.inside) mood = 'pleased'
    else mood = 'content'

    if (mood === 'pleased' && s.bubble <= 0 && Math.random() < d * 0.3) {
      s.bubble = 1.1
      onSay?.({ text: GLAD[(Math.random() * GLAD.length) | 0], hurt: false })
    }

    const wantClip =
      mood === 'scared' || mood === 'startled' ? 'Scared' : mood === 'pleased' ? 'Wave' : 'Idle'
    if (wantClip !== clip) setClip(wantClip)

    const amt = Math.min(1, s.stress * 0.8)
    for (const m of mats) m.mat.color.copy(m.base).lerp(grey, amt)

    // face his direction of travel; turn his back when he has had enough
    let ry = Math.abs(s.vs) > 0.25 ? (s.vs > 0 ? 0.45 : -0.45) : cwx > tmp.x ? 0.25 : -0.25
    if (s.stress > 0.7) ry = cwx > tmp.x ? -2.1 : 2.1
    const cur = g.rotation.y
    g.rotation.y = cur + Math.atan2(Math.sin(ry - cur), Math.cos(ry - cur)) * Math.min(1, d * 3.5)
    g.rotation.z += (-s.vs * 0.02 - g.rotation.z) * Math.min(1, d * 3.5)

    s.act =
      s.stress > 0.7 ? 'sulking'
      : s.hitT > 0 ? 'startled'
      : mood === 'pleased' ? 'saying hello'
      : s.pause > 0 ? 'dozing'
      : Math.abs(s.vs) > 0.3 ? 'wandering'
      : 'drifting'
    telemetry.ghostAct = s.act
    telemetry.ghostCalm = 1 - Math.min(1, s.stress / 1.2)

    screenV.set(g.position.x, g.position.y + 0.55, g.position.z).project(state.camera)
    telemetry.ghostSX = (screenV.x * 0.5 + 0.5) * size.width
    telemetry.ghostSY = (-screenV.y * 0.5 + 0.5) * size.height
  })

  return (
    <group ref={group} scale={1.35}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/ghost.glb`)
