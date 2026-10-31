// One shared pointer store. Components read it inside useFrame so that
// moving the mouse never triggers a React re-render.
export const pointer = {
  sx: -9999, sy: -9999,      // screen pixels
  nx: 0, ny: 0,              // -1..1, normalised device coords
  speed: 0,                  // smoothed px per move
  idle: 99,                  // seconds since the last move
  inside: false,
  down: false,
}

let lx = 0, ly = 0, has = false

export function attachPointer() {
  const move = (e) => {
    pointer.sx = e.clientX
    pointer.sy = e.clientY
    pointer.nx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1)
    if (has) {
      pointer.speed = pointer.speed * 0.68 + Math.hypot(e.clientX - lx, e.clientY - ly) * 0.32
    }
    lx = e.clientX; ly = e.clientY; has = true
    pointer.idle = 0
    pointer.inside = true
  }
  const leave = () => { pointer.inside = false }
  const down = () => { pointer.down = true }
  const up = () => { pointer.down = false }

  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerleave', leave)
  window.addEventListener('pointerdown', down)
  window.addEventListener('pointerup', up)
  return () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerleave', leave)
    window.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerup', up)
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
