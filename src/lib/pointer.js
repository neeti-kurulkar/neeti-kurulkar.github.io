// One shared pointer store. Components read it inside useFrame so that
// moving the mouse never triggers a React re-render.
export const pointer = {
  sx: -9999, sy: -9999,      // screen pixels
  nx: 0, ny: 0,              // -1..1, normalised device coords
  speed: 0,                  // smoothed px per move
  idle: 99,                  // seconds since the last move
  inside: false,
  down: false,
  tap: 0,                    // counter: goes up once per deliberate tap
  tapX: -9999, tapY: -9999,  // where that tap landed, in screen pixels
}

let lx = 0, ly = 0, has = false

export function attachPointer() {
  const at = (x, y) => {
    pointer.sx = x
    pointer.sy = y
    pointer.nx = (x / window.innerWidth) * 2 - 1
    pointer.ny = -((y / window.innerHeight) * 2 - 1)
    if (has) pointer.speed = pointer.speed * 0.68 + Math.hypot(x - lx, y - ly) * 0.32
    lx = x; ly = y; has = true
    pointer.idle = 0
    pointer.inside = true
  }

  /* Mouse and pen only. Touch is handled below on its own terms, so these
     ignore it rather than report the same finger twice (two reports of the
     same position a frame apart read as a pointer that has stopped moving,
     which quietly killed the speed reading the poke depends on). */
  const mouse = (fn) => (e) => { if (e.pointerType !== 'touch') fn(e) }
  const move = mouse((e) => at(e.clientX, e.clientY))
  const leave = mouse(() => { pointer.inside = false; has = false })
  const down = mouse(() => { pointer.down = true })
  const up = mouse(() => { pointer.down = false })

  /* Touch, from the touch events rather than the pointer ones: a drag that
     scrolls the page fires pointercancel and then stops sending moves, and
     the swarm wants the whole gesture, not the first 40ms of it. Nothing
     here calls preventDefault, so the page still scrolls exactly as it did. */
  let t0 = 0, tx0 = 0, ty0 = 0, drag = 0
  const tStart = (e) => {
    const t = e.touches[0]
    if (!t) return
    t0 = performance.now()
    tx0 = t.clientX
    ty0 = t.clientY
    drag = 0
    has = false // a new finger is not a continuation of the last one
    at(t.clientX, t.clientY)
    pointer.down = true
  }
  const tMove = (e) => {
    const t = e.touches[0]
    if (!t) return
    drag = Math.max(drag, Math.hypot(t.clientX - tx0, t.clientY - ty0))
    at(t.clientX, t.clientY)
  }
  const tEnd = () => {
    pointer.down = false
    pointer.inside = false // the finger is gone: nothing is hovering anything
    has = false
    // short and still is a tap. Long, or dragged, is a scroll or a swipe.
    if (performance.now() - t0 < 450 && drag < 14) {
      pointer.tapX = tx0
      pointer.tapY = ty0
      pointer.tap += 1
    }
  }

  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerleave', leave)
  window.addEventListener('pointerdown', down)
  window.addEventListener('pointerup', up)
  window.addEventListener('touchstart', tStart, { passive: true })
  window.addEventListener('touchmove', tMove, { passive: true })
  window.addEventListener('touchend', tEnd, { passive: true })
  window.addEventListener('touchcancel', tEnd, { passive: true })
  return () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerleave', leave)
    window.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('touchstart', tStart)
    window.removeEventListener('touchmove', tMove)
    window.removeEventListener('touchend', tEnd)
    window.removeEventListener('touchcancel', tEnd)
  }
}

// Called once per frame by the scene so idle and speed decay even when still.
export function tickPointer(dt) {
  pointer.idle += dt
  pointer.speed *= 0.88
}

// Scroll progress 0..1 for the whole document.
export function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

// 0 while the hero is on screen, 1 once it has gone.
export function heroExit() {
  return Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.55)))
}

// Shared mutable state the readout panel polls.
export const telemetry = { ghostAct: 'loading', ghostClip: '-', ghostCalm: 1, swarm: 'your name', ghostSX: -999, ghostSY: -999 }
