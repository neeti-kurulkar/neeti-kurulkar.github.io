import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { pointer, telemetry } from '../lib/pointer'
import { pokeLines } from '../content'

/* Arsyuta777's ghost, CC BY 4.0.

   He hovers in one of the gutters beside the content column, drifting slowly
   up and down. Every half minute or so he floats across to the other side,
   behind the cards. He does not chase the cursor. You can still poke him. */

const GLAD = ['boo', 'hi!', '♪', 'hehe']
const EXPLAIN = ['this one’s good', 'read this bit', 'she likes this one', 'ooh, this one']

const HOVER_SPEED = 0.22 // world units per second while hovering up and down
const CROSS_SPEED = 1.3 // when he drifts over to the other side
const ESCAPE_SPEED = 2.6 // rising back out from behind the readout box
const FLEE_SPEED = 11 // when he has been poked too hard: he bolts
const CROSS_EVERY = 30 // seconds, roughly, between crossings

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
    x: 0, y: 0, vx: 0, vy: 0, side: -1, yT: 0, yTimer: 0, crossT: 30,
    stress: 0, hitT: 0, bubble: 0, act: 'hovering', seeded: false,
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

  /* His two homes, in world units on the z = 0 plane: the middle of the left
     gutter and the middle of the right one. On a narrow screen there are no
     gutters, so he keeps to the two bottom corners instead. */
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
    const topY = sides ? halfH - 1.9 : bottomY + 0.4
    return { leftX, rightX, bottomY, topY, sides, ok: rightX > leftX }
  }, [viewport.width, viewport.height, size.width])

  /* The readout box is DOM painted over the canvas, so parking him there
     really does hide him. We want that on purpose when he sulks, and never
     by accident while he is just hovering. */
  const readoutAt = useMemo(() => () => {
    const el = document.querySelector('.readout')
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return null
    const toX = (px) => (px / size.width * 2 - 1) * (viewport.width / 2)
    const toY = (py) => -(py / size.height * 2 - 1) * (viewport.height / 2)
    return {
      cx: toX(r.left + r.width / 2),
      cy: toY(r.top + r.height / 2),
      left: toX(r.left),
      top: toY(r.top),
    }
  }, [size.width, size.height, viewport.width, viewport.height])

  const grey = useMemo(() => new THREE.Color('#5c6672'), [])
  const screenV = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g || !lane.ok) return
    const s = st.current
    const d = Math.min(0.05, dt)
    s.hitT = Math.max(0, s.hitT - d)
    if (!s.seeded) {
      s.side = -1
      s.x = lane.leftX
      s.y = (lane.topY + lane.bottomY) / 2
      s.yT = s.y
      s.crossT = CROSS_EVERY * (0.85 + Math.random() * 0.3)
      s.seeded = true
    }

    s.boxTick = (s.boxTick || 0) - d
    if (s.boxTick <= 0) {
      s.boxTick = 0.4
      s.box = readoutAt()
    }

    // on the right he keeps above the readout box unless he means to hide
    const clearY = s.box ? s.box.top + 0.75 : -Infinity
    const minYFor = (side) =>
      side > 0 ? Math.min(lane.topY, Math.max(lane.bottomY, clearY)) : lane.bottomY
    const homeX = (side) => (side > 0 ? lane.rightX : lane.leftX)

    const cwx = (pointer.nx * viewport.width) / 2
    const cwy = (pointer.ny * viewport.height) / 2

    let tx
    let ty
    let speed = HOVER_SPEED
    if (explaining) {
      // park beside the overlay, a little below the middle of the left side
      s.side = -1
      tx = lane.leftX
      ty = lane.sides ? lane.topY - (lane.topY - lane.bottomY) * 0.42 : lane.bottomY
      s.yT = ty
      speed = CROSS_SPEED
      if (!s.explained) {
        s.explained = true
        s.bubble = 2.4
        onSay?.({ text: EXPLAIN[(Math.random() * EXPLAIN.length) | 0], hurt: false })
      }
    } else if (s.fleeing && s.box) {
      /* Poked too hard. This is a latched state, not a stress reading: he
         commits to the run, hides behind the readout box for five seconds,
         and cannot be poked again until he comes back out. */
      tx = s.box.cx
      ty = s.box.cy
      speed = FLEE_SPEED
      const home = Math.hypot(s.x - tx, s.y - ty) < 0.35
      if (home && s.hideHold <= 0 && !s.hidDone) s.hideHold = 5
      if (s.hideHold > 0) {
        s.hideHold -= d
        if (s.hideHold <= 0) {
          s.hideHold = 0
          s.hidDone = true
          s.fleeing = false
          s.stress = 0
          // come back out on the right, above the box, and settle in
          s.side = 1
          s.yT = minYFor(1) + Math.random() * Math.max(0, lane.topY - minYFor(1)) * 0.5
          s.crossT = CROSS_EVERY * (0.85 + Math.random() * 0.3)
        }
      }
    } else {
      if (s.fleeing) {
        // nowhere to hide (narrow screen): just back off to the far corner
        s.side = cwx > s.x ? -1 : 1
        speed = FLEE_SPEED
        if (s.hitT <= 0) { s.fleeing = false; s.stress = Math.min(s.stress, 0.5) }
      }

      // every half minute or so he drifts over to the other side
      // the clock only runs while he is settled at home, not mid-crossing
      if (Math.abs(homeX(s.side) - s.x) < 0.3) s.crossT -= d
      if (s.crossT <= 0) {
        s.side = -s.side
        s.crossT = CROSS_EVERY * (0.85 + Math.random() * 0.3)
        s.yTimer = 0
      }

      // otherwise he just hovers, picking a new height now and then
      s.yTimer -= d
      if (s.yTimer <= 0) {
        s.yTimer = 6 + Math.random() * 5
        const lo = minYFor(s.side)
        s.yT = lo + Math.random() * Math.max(0, lane.topY - lo)
      }
      s.yT = Math.max(minYFor(s.side), Math.min(lane.topY, s.yT))
      tx = homeX(s.side)
      ty = s.yT
      if (Math.abs(tx - s.x) > 0.3) speed = CROSS_SPEED

      /* Heading right while still low: hold short of the readout box until
         he has risen above it, so he never slips behind it by accident. */
      if (s.box && tx > s.x && s.y < clearY - 0.05) {
        tx = Math.min(tx, s.box.left - 0.9)
      }

      /* The box is only for hiding. If he is ever behind it when he is not
         sulking (coming back out after a hide, or the window was resized),
         he rises straight up out of it, briskly, instead of hovering there. */
      if (s.box && s.x > s.box.left - 0.9 && s.y < clearY - 0.05) {
        ty = Math.max(ty, clearY + 0.3)
        s.yT = Math.max(s.yT, ty)
        speed = ESCAPE_SPEED
      }
    }

    // ease toward the target with a soft speed cap, so he glides rather than darts
    const gx = tx - s.x
    const gy = ty - s.y
    // when he bolts he skips the gentle easing: snaps up to speed and only
    // brakes right at the end
    const fleeing = speed === FLEE_SPEED
    const gainX = fleeing ? 4 : 0.8
    const gainY = fleeing ? 4 : speed === ESCAPE_SPEED ? 2 : 0.6
    const wantX = Math.abs(gx) < 0.02 ? 0 : Math.sign(gx) * Math.min(speed, Math.abs(gx) * gainX)
    const yCap = speed === HOVER_SPEED ? HOVER_SPEED : fleeing || speed === ESCAPE_SPEED ? speed : Math.max(HOVER_SPEED, speed * 0.6)
    const wantY = Math.abs(gy) < 0.02 ? 0 : Math.sign(gy) * Math.min(yCap, Math.abs(gy) * gainY)
    const k = Math.min(1, d * (fleeing ? 9 : 1.4))
    s.vx += (wantX - s.vx) * k
    s.vy += (wantY - s.vy) * k
    s.x += s.vx * d
    s.y += s.vy * d
    if (!(s.fleeing || explaining)) {
      s.x = Math.max(lane.leftX - 0.2, Math.min(lane.rightX + 0.2, s.x))
    }
    s.vs = s.vx

    const tmp = s
    const bob = Math.sin(state.clock.elapsedTime * 0.9) * 0.08
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
      // a poke always gets a reaction, even over a hello he was mid-way through
      s.bubble = 1.5
      onSay?.({ text: pokeLines[(Math.random() * pokeLines.length) | 0], hurt: true })
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
      : Math.abs(s.vx) > 0.3 ? 'drifting across'
      : 'hovering'
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
