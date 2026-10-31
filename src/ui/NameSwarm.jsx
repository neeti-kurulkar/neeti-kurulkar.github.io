import { useEffect, useRef } from 'react'
import { pointer, heroExit } from '../lib/pointer'
import { person } from '../content'

/* The name, as particles, on its own 2D canvas.

   It does one job and then gets out of the way:

     hero        the particles hold the letterforms. They lean toward your
                 cursor from a distance, shove apart and bruise dark when you
                 push through, and heal.

     past it     the letters come apart and the particles drift outward into
                 the background and become sky. They keep moving slowly left
                 to right for the rest of the page, faint and far back. They
                 never follow the pointer and can never cover the text. */

const BASE = [
  [0.30, 0.55, 0.80],
  [0.37, 0.60, 0.83],
  [0.47, 0.70, 0.88],
  [0.58, 0.76, 0.90],
  [0.66, 0.80, 0.92],
]
const DARK = [0.07, 0.13, 0.22]

export default function NameSwarm({ font = 'Bricolage Grotesque' }) {
  const cv = useRef(null)

  useEffect(() => {
    const canvas = cv.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dpr = 1
    let pts = []
    let raf = 0
    let last = performance.now()
    let sky = 0 // how far the sky has drifted, in device pixels

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
        pts.push({
          hx: found[i * 2],
          hy: found[i * 2 + 1],
          x: found[i * 2] + (Math.random() - 0.5) * 240,
          y: found[i * 2 + 1] + (Math.random() - 0.5) * 240,
          vx: 0,
          vy: 0,
          c: (Math.random() * BASE.length) | 0,
          // where this one ends up once it has become sky
          sx: Math.random(),                        // 0..1 across the width
          sy: Math.random(),                        // 0..1 down the height
          sp: 0.25 + Math.random() * 1.1,           // its own drift speed
          bob: Math.random() * 6.283,
        })
      }
    }

    function draw(free, d, now) {
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

      // faint once it is sky, so it reads as background and nothing else
      const alpha = 1 - free * 0.82
      // the pointer only has a say while the name is still a name
      const grip = Math.max(0, 1 - free * 2.2)

      for (let i = 0; i < pts.length; i++) {
        const q = pts[i]

        // target: the letterform, blended toward its place in the sky
        let hx = q.hx
        let hy = q.hy
        if (free > 0.001) {
          const driftX = (q.sx * W + sky * q.sp) % (W + 120 * dpr) - 60 * dpr
          const driftY = q.sy * H + Math.sin(now * 0.00018 + q.bob) * 26 * dpr
          hx += (driftX - hx) * free
          hy += (driftY - hy) * free
        }

        if (grip > 0.01 && pointer.inside) {
          const dx = q.x - mx
          const dy = q.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            const dist = Math.sqrt(d2) || 1
            const f = (1 - dist / R) * 6.2 * grip
            q.vx += (dx / dist) * f * k
            q.vy += (dy / dist) * f * k
          } else if (d2 < PULL2) {
            const dist = Math.sqrt(d2) || 1
            const f = (1 - dist / PULL) * 0.55 * grip
            q.vx -= (dx / dist) * f * k
            q.vy -= (dy / dist) * f * k
          }
        }

        // looser spring once it is sky, so the drift reads as drift
        const spring = (0.05 - free * 0.034) * k
        q.vx += (hx - q.x) * spring
        q.vy += (hy - q.y) * spring
        const damp = Math.pow(0.86, k)
        q.vx *= damp
        q.vy *= damp
        q.x += q.vx * k
        q.y += q.vy * k

        // displaced particles bruise dark; only meaningful on the name
        const t = grip <= 0.01 ? 0 : Math.min(1, (Math.abs(q.x - hx) + Math.abs(q.y - hy)) / (70 * dpr))
        const b = BASE[q.c]
        const r = Math.round((b[0] + (DARK[0] - b[0]) * t) * 255)
        const g = Math.round((b[1] + (DARK[1] - b[1]) * t) * 255)
        const bl = Math.round((b[2] + (DARK[2] - b[2]) * t) * 255)
        ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`
        const s = free > 0.6 ? 1.6 * dpr : 2 * dpr
        ctx.fillRect(q.x, q.y, s, s)
      }
    }

    function frame(now) {
      const d = Math.min(0.05, (now - last) / 1000)
      last = now
      const free = heroExit()
      sky += d * 14 * dpr * free // only drifts once it has become sky
      draw(free, d, now)
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => build()
    build()
    window.addEventListener('resize', onResize)

    if (reduce) {
      draw(0, 0.016, performance.now())
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
