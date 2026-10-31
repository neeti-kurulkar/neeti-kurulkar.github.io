import { useEffect, useRef } from 'react'
import { pointer, heroExit, telemetry } from '../lib/pointer'
import { person } from '../content'

/* The name, as particles, on its own 2D canvas.

   Two states, same particles:
     hero   - they hold the letterforms, lean toward the cursor from a
              distance, shove apart and bruise dark when you push through
     past it- they unravel onto the trail of a LEAD point, which chases the
              cursor but always stops short of it. That standoff is why the
              tail never pools into a ring around a still mouse and never
              covers what is under the pointer. */

const BASE = [
  [0.30, 0.55, 0.80],
  [0.37, 0.60, 0.83],
  [0.47, 0.70, 0.88],
  [0.58, 0.76, 0.90],
  [0.66, 0.80, 0.92],
]
const DARK = [0.07, 0.13, 0.22]
const TRAIL = 110

export default function NameSwarm({ font = 'Bricolage Grotesque' }) {
  const cv = useRef(null)

  useEffect(() => {
    const canvas = cv.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dpr = 1
    let pts = []
    const trX = new Float32Array(TRAIL)
    const trY = new Float32Array(TRAIL)
    let head = 0
    let ready = false
    let leadX = 0
    let leadY = 0
    let leadInit = false
    let swirl = 0
    let drift = 0
    let activity = 0
    let raf = 0
    let last = performance.now()

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      const W = canvas.width
      const H = canvas.height

      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const o = off.getContext('2d')
      o.fillStyle = '#fff'
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      const size = Math.min(W * 0.134, H * 0.2)
      o.font = `800 ${size}px "${font}", sans-serif`
      const cx = W * 0.5
      const cy = H * 0.47
      o.fillText(person.first, cx, cy - size * 0.54)
      o.fillText(person.last, cx, cy + size * 0.54)

      const d = o.getImageData(0, 0, W, H).data
      const found = []
      const gap = Math.max(4, Math.round(5 * dpr))
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (d[(y * W + x) * 4 + 3] > 130) found.push(x, y)
        }
      }

      pts = []
      const n = found.length / 2
      for (let i = 0; i < n; i++) {
        const t = Math.pow(Math.random(), 0.7)
        // a filled disc, not a fixed radius: collapsed this is a blob, not a ring
        const a = Math.random() * 6.283
        const r = Math.sqrt(Math.random())
        pts.push({
          hx: found[i * 2],
          hy: found[i * 2 + 1],
          x: found[i * 2] + (Math.random() - 0.5) * 240,
          y: found[i * 2 + 1] + (Math.random() - 0.5) * 240,
          vx: 0,
          vy: 0,
          c: (Math.random() * BASE.length) | 0,
          slot: 6 + t * (TRAIL - 9),
          ox: Math.cos(a) * r * (10 + t * 78),
          oy: Math.sin(a) * r * (10 + t * 78),
          spin: (0.25 + Math.random() * 0.7) * (Math.random() < 0.5 ? -1 : 1),
        })
      }
    }

    /* The lead hovers a set distance from the pointer, in the direction it
       came from. When you stop moving it keeps drifting in a slow wide arc,
       so the trail stays spread out and the tail never collapses to a blob. */
    function updateLead(d) {
      const mx = pointer.sx * dpr
      const my = pointer.sy * dpr
      if (!leadInit) { leadX = mx; leadY = my + 170 * dpr; leadInit = true }
      const STANDOFF = 168 * dpr

      // ramps to 1 after about a second of stillness
      const calm = Math.max(0, Math.min(1, (pointer.idle - 0.45) / 1.1))
      drift += d * (0.9 - calm * 0.52)

      let dx = mx - leadX
      let dy = my - leadY
      let dist = Math.hypot(dx, dy)
      if (dist < 0.001) { dx = 0; dy = 1; dist = 1 }
      let tx = mx - (dx / dist) * STANDOFF
      let ty = my - (dy / dist) * STANDOFF

      // A wide, slow figure-of-eight while you are still. The two
      // frequencies are deliberately incommensurate so the lead never
      // retraces its own circle and the trail keeps its length.
      const amp = calm * 185 * dpr
      tx += Math.sin(drift) * amp
      ty += Math.sin(drift * 0.61 + 1.1) * amp * 0.5

      const f = Math.min(1, d * 4.2)
      leadX += (tx - leadX) * f
      leadY += (ty - leadY) * f

      if (!ready) {
        for (let i = 0; i < TRAIL; i++) { trX[i] = leadX; trY[i] = leadY }
        ready = true
        return
      }
      head = (head + 1) % TRAIL
      trX[head] = leadX
      trY[head] = leadY
    }

    function draw(free, d) {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)
      const mx = pointer.sx * dpr
      const my = pointer.sy * dpr
      const R = 122 * dpr
      const R2 = R * R
      const PULL = 430 * dpr
      const PULL2 = PULL * PULL
      const k = Math.min(2.2, d * 60)
      const radMul = (0.78 + activity * 0.34) * dpr
      const alpha = 1 - free * 0.3
      const KEEP = 140 * dpr
      const KEEP2 = KEEP * KEEP

      for (let i = 0; i < pts.length; i++) {
        const q = pts[i]
        let hx = q.hx
        let hy = q.hy

        if (free > 0.001 && ready) {
          const idx = (head - (q.slot | 0) + TRAIL * 2) % TRAIL
          const a = swirl * q.spin
          const ca = Math.cos(a)
          const sa = Math.sin(a)
          let tx = trX[idx] + (q.ox * ca - q.oy * sa) * radMul
          let ty = trY[idx] + (q.ox * sa + q.oy * ca) * radMul * 0.8
          const ddx = tx - mx
          const ddy = ty - my
          const dd2 = ddx * ddx + ddy * ddy
          if (dd2 < KEEP2) {
            const dd = Math.sqrt(dd2) || 1
            tx = mx + (ddx / dd) * KEEP
            ty = my + (ddy / dd) * KEEP
          }
          hx += (tx - hx) * free
          hy += (ty - hy) * free
        }

        const dx = q.x - mx
        const dy = q.y - my
        const d2 = dx * dx + dy * dy
        if (pointer.inside) {
          if (d2 < R2) {
            const dist = Math.sqrt(d2) || 1
            const f = (1 - dist / R) * 6.2
            q.vx += (dx / dist) * f * k
            q.vy += (dy / dist) * f * k
          } else if (free < 0.5 && d2 < PULL2) {
            const dist = Math.sqrt(d2) || 1
            const f = (1 - dist / PULL) * 0.55 * (1 - free * 2)
            q.vx -= (dx / dist) * f * k
            q.vy -= (dy / dist) * f * k
          }
        }

        const spring = (0.05 - free * 0.016) * k
        q.vx += (hx - q.x) * spring
        q.vy += (hy - q.y) * spring
        const damp = Math.pow(0.86, k)
        q.vx *= damp
        q.vy *= damp
        q.x += q.vx * k
        q.y += q.vy * k

        const t = Math.min(1, (Math.abs(q.x - hx) + Math.abs(q.y - hy)) / (70 * dpr))
        const b = BASE[q.c]
        const r = Math.round((b[0] + (DARK[0] - b[0]) * t) * 255)
        const g = Math.round((b[1] + (DARK[1] - b[1]) * t) * 255)
        const bl = Math.round((b[2] + (DARK[2] - b[2]) * t) * 255)
        ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`
        ctx.fillRect(q.x, q.y, 2 * dpr, 2 * dpr)
      }
    }

    function frame(now) {
      const d = Math.min(0.05, (now - last) / 1000)
      last = now
      const free = heroExit()
      const want = Math.min(1, pointer.speed / 9)
      activity += (want - activity) * Math.min(1, d * (want > activity ? 9 : 2.2))
      swirl += d * (0.26 + activity * 1.2)
      updateLead(d)
      draw(free, d)
      telemetry.swarm = free < 0.12 ? 'your name' : free > 0.88 ? (activity > 0.08 ? 'tail' : 'settled') : 'unravelling'
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => build()
    build()
    window.addEventListener('resize', onResize)

    if (reduce) {
      draw(0, 0.016)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [font])

  return <canvas ref={cv} className="swarm" aria-hidden="true" />
}
