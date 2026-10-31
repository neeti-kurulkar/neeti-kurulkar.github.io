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
const EXPLAIN = ['this one’s good', 'read this bit', 'she likes this one', 'ooh, this one']

const MAX_SPEED = 2.4 // world units per second along the lane

export default function Ghost({ onSay, explaining }) {
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
    hideHold: 0, fleeing: false, hidDone: false,
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
  const probe = useMemo(() => ({ x: 0, y: 0 }), [])

  /* The readout box is DOM painted over the canvas, so parking him there
     really does hide him. We want that on purpose when he sulks, and never
     by accident while he is just wandering. */
  const hideAt = useMemo(() => () => {
    const el = document.querySelector('.readout')
    if (!el || lane.total <= 0) return null
    const r = el.getBoundingClientRect()
    const wx = ((r.left + r.width / 2) / size.width * 2 - 1) * (viewport.width / 2)
    const wy = -((r.top + r.height / 2) / size.height * 2 - 1) * (viewport.height / 2)
    let best = 0
    let bestD = Infinity
    for (let i = 0; i <= 64; i++) {
      const ss = (lane.total * i) / 64
      at(ss, probe)
      const dd = Math.hypot(probe.x - wx, probe.y - wy)
      if (dd < bestD) { bestD = dd; best = ss }
    }
    return best
  }, [lane, size.width, size.height, viewport.width, viewport.height, at, probe])
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

    s.hideTick = (s.hideTick || 0) - d
    if (s.hideTick <= 0) { s.hideTick = 0.5; s.hideS = hideAt() }
    const AVOID = lane.total * 0.085

    /* He may travel the whole lane, but he only ever stops at the ends: the
       two side lanes and the corners of the bottom. The middle of the bottom
       run sits under the content column, and he gets lost behind it there. */
    const endOfBottom = lane.B * 0.16
    const restA = lane.L + endOfBottom            // end of the left-hand zone
    let restB = lane.L + lane.B - endOfBottom     // start of the right-hand zone
    /* The readout box sits at the bottom right, exactly where the right-hand
       zone begins. Without this he parks beside it, gets moved on for being
       behind it, gets snapped back to the start of the zone, and loops for
       ever. Begin the zone above the box instead. */
    if (s.hideS != null) {
      restB = Math.min(lane.total - 0.1, Math.max(restB, s.hideS + AVOID * 1.5))
    }
    const parkable = (v) => v <= restA || v >= restB

    const cwx = (pointer.nx * viewport.width) / 2
    const cwy = (pointer.ny * viewport.height) / 2
    at(s.s, tmp)

    /* He wanders. He does not follow you, with two exceptions: he edges away
       when upset, and he comes over to the sheet when you open a project. */
    if (explaining) {
      // park beside the overlay, a little above the bottom of the left lane
      s.targetS = lane.sides ? lane.L * 0.42 : lane.total * 0.2
      s.pause = 0
      if (!s.explained) {
        s.explained = true
        s.bubble = 2.4
        onSay?.({ text: EXPLAIN[(Math.random() * EXPLAIN.length) | 0], hurt: false })
      }
    } else if (s.fleeing) {
      /* Poked too hard. This is a latched state, not a stress reading: he
         commits to the run, hides behind the readout box for five seconds,
         and cannot be poked again until he comes back out. */
      s.targetS = s.hideS != null ? s.hideS : cwx > tmp.x ? 0 : lane.total
      s.pause = 0
      const home = s.hideS != null && Math.abs(s.s - s.hideS) < AVOID * 0.7
      if (home && s.hideHold <= 0 && !s.hidDone) {
        s.hideHold = 5
      }
      if (s.hideHold > 0) {
        s.hideHold -= d
        if (s.hideHold <= 0) {
          s.hideHold = 0
          s.hidDone = true
          s.fleeing = false
          s.stress = 0
          // step back out from behind the box
          s.targetS = Math.max(0, Math.min(restA, restA * (0.3 + Math.random() * 0.6)))
        }
      }
    } else if (s.pause > 0) {
      s.pause -= d
      s.targetS = s.s
    } else {
      s.roam -= d
      if (s.roam <= 0) {
        s.roam = 3.2 + Math.random() * 4.5
        // a short hop along the lane, never a dash across the window
        // somewhere at one of the ends, never behind the box
        let t = s.s
        for (let i = 0; i < 12; i++) {
          t = Math.random() < 0.5
            ? Math.random() * restA                       // left lane and its corner
            : restB + Math.random() * (lane.total - restB) // right lane and its corner
          if (s.hideS == null || Math.abs(t - s.hideS) > AVOID) break
        }
        s.targetS = t
        if (Math.random() < 0.35) s.pause = 1.4 + Math.random() * 2.6
      }
    }

    // never let him settle in the middle, or behind the box
    if (!s.fleeing && !explaining) {
      const stuckBehindBox = s.hideS != null && Math.abs(s.s - s.hideS) < AVOID * 0.8
      const stuckInMiddle = !parkable(s.s) && Math.abs(s.vs) < 0.35
      if (stuckBehindBox) {
        s.targetS = Math.max(0, Math.min(lane.total, s.hideS + (s.s < s.hideS ? -AVOID * 1.8 : AVOID * 1.8)))
        s.pause = 0
      } else if (stuckInMiddle) {
        // carry on to whichever end he was already closer to
        s.targetS = s.s < (restA + restB) / 2 ? restA * 0.7 : restB + (lane.total - restB) * 0.3
        s.pause = 0
      }
      // and he does not pause mid-crossing
      if (!parkable(s.targetS)) s.targetS = s.targetS < (restA + restB) / 2 ? restA : restB
      if (!parkable(s.s)) s.pause = 0
    }

    // ease toward the target, but never faster than MAX_SPEED
    const gap = s.targetS - s.s
    const cap = s.stress > 0.6 ? MAX_SPEED * 2.1 : MAX_SPEED
    const want = Math.abs(gap) < 0.05 ? 0 : Math.sign(gap) * Math.min(cap, Math.abs(gap) * 1.1)
    s.vs += (want - s.vs) * Math.min(1, d * 2.2)
    s.vs = Math.max(-cap, Math.min(cap, s.vs))
    s.s = Math.max(0, Math.min(lane.total, s.s + s.vs * d))

    at(s.s, tmp)
    const bob = Math.sin(state.clock.elapsedTime * 1.5) * 0.075
    g.position.set(tmp.x, tmp.y + bob, 0.4)

    /* Poking. This has to be a deliberate swat, not something that fires
       because he happened to wander past a cursor that was drifting. So it
       needs real speed, real proximity, and a cooldown between hits. */
    const pd = Math.hypot(cwx - tmp.x, cwy - tmp.y)
    s.cool = Math.max(0, (s.cool || 0) - d)
    const POKE_SPEED = 11
    const unreachable = s.fleeing
    if (!explaining && !unreachable && pd < 0.95 && pointer.inside && pointer.speed > POKE_SPEED && s.cool <= 0) {
      s.cool = 0.55
      s.stress = Math.min(1.8, s.stress + 0.56 + Math.min(0.6, pointer.speed / 70))
      s.hitT = 1.2
      if (s.stress > 0.6) { s.fleeing = true; s.hidDone = false }
      if (s.bubble <= 0) {
        s.bubble = 1.5
        onSay?.({ text: HURT[(Math.random() * HURT.length) | 0], hurt: true })
      }
    }
    if (!explaining) s.explained = false
    if (!s.fleeing) s.stress = Math.max(0, s.stress - d * 0.2)
    if (s.bubble > 0) s.bubble -= d

    // a recent hit always wins, so the bubble and the face never disagree
    let mood
    if (s.fleeing || s.stress > 0.7) mood = 'scared'
    else if (s.hitT > 0 || s.stress > 0.3) mood = 'startled'
    else if (explaining) mood = 'pleased'
    else if (pd < 2.8 && pointer.speed < 11 && pointer.inside) mood = 'pleased'
    else mood = 'content'

    if (mood === 'pleased' && s.bubble <= 0 && Math.random() < d * 0.9) {
      s.bubble = 1.1
      onSay?.({ text: GLAD[(Math.random() * GLAD.length) | 0], hurt: false })
    }

    const wantClip =
      mood === 'scared' || mood === 'startled' ? 'Scared' : mood === 'pleased' ? 'Wave' : 'Idle'
    s.clipHold = Math.max(0, (s.clipHold || 0) - d)
    if (wantClip !== clip && s.clipHold <= 0) {
      s.clipHold = 0.35
      setClip(wantClip)
    }

    const amt = Math.min(1, s.stress * 0.8)
    for (const m of mats) m.mat.color.copy(m.base).lerp(grey, amt)

    // face his direction of travel; turn his back when he has had enough
    let ry = Math.abs(s.vs) > 0.25 ? (s.vs > 0 ? 0.45 : -0.45) : cwx > tmp.x ? 0.25 : -0.25
    if (s.stress > 0.7) ry = cwx > tmp.x ? -2.1 : 2.1
    const cur = g.rotation.y
    g.rotation.y = cur + Math.atan2(Math.sin(ry - cur), Math.cos(ry - cur)) * Math.min(1, d * 3.5)
    g.rotation.z += (-s.vs * 0.02 - g.rotation.z) * Math.min(1, d * 3.5)

    const hiding = s.hideHold > 0
    s.act =
      hiding ? `hiding (${Math.ceil(s.hideHold)}s)`
      : s.fleeing ? 'running away'
      : s.hitT > 0 ? 'startled'
      : explaining ? 'explaining'
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
