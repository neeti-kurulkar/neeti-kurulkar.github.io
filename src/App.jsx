import { useCallback, useEffect, useRef, useState } from 'react'
import Scene from './three/Scene'
import NameSwarm from './ui/NameSwarm'
import { Hero, Background, Projects, Skills, Achievements, Contact, ProjectSheet } from './ui/Sections'
import { attachPointer, pointer, telemetry } from './lib/pointer'
import { sectionLines, greetings } from './content'
import { useIsPhone } from './lib/useIsPhone'

const MOODS = { Idle: 'calm', Wave: 'pleased', Scared: 'rattled' }

export default function App() {
  const phone = useIsPhone()
  const [bubble, setBubble] = useState(null)
  const bubbleUntil = useRef(0)
  const bubblePrio = useRef(0)

  /* One bubble at a time, with a priority so the ghost's own reactions
     outrank the section lines, and a newer section line replaces an older
     one instead of waiting behind it. */
  const say = useCallback((payload, { prio = 1, ms = 1600 } = {}) => {
    const now = performance.now()
    if (now < bubbleUntil.current && prio < bubblePrio.current) return
    bubbleUntil.current = now + ms
    bubblePrio.current = prio
    setBubble(payload)
    window.clearTimeout(say._t)
    say._t = window.setTimeout(() => {
      setBubble(null)
      bubblePrio.current = 0
    }, ms)
  }, [])

  const ghostSay = useCallback(
    (payload) => {
      if (payload) say(payload, { prio: payload.hurt ? 4 : 2, ms: payload.hurt ? 1700 : 1300 })
    },
    [say],
  )
  const [open, setOpen] = useState(null)
  const bubbleRef = useRef(null)
  const readout = useRef({})

  useEffect(() => attachPointer(), [])

  /* Say hi on every load. Wait until the ghost has actually been placed on
     screen (the model loads async), then give him a beat to settle in. */
  useEffect(() => {
    let t = 0
    const poll = window.setInterval(() => {
      if (telemetry.ghostSX <= -999) return
      window.clearInterval(poll)
      t = window.setTimeout(() => {
        say({ text: greetings[(Math.random() * greetings.length) | 0], hurt: false }, { prio: 3, ms: 2200 })
      }, 700)
    }, 100)
    return () => { window.clearInterval(poll); window.clearTimeout(t) }
  }, [say])

  /* Say a line as each section arrives, once per visit.

     This deliberately does not use intersectionRatio: Projects is taller
     than the viewport, so its ratio can never reach a sensible threshold and
     it was the one section that never spoke. Whichever section covers the
     middle of the screen is the one we are looking at, whatever its height. */
  const activeSection = useRef(null)
  useEffect(() => {
    let raf = 0
    let acc = 0
    let t0 = performance.now()
    const tick = (now) => {
      acc += now - t0
      t0 = now
      if (acc > 260) {
        acc = 0
        const mid = window.innerHeight * 0.45
        let found = null
        let nearest = null
        let nearestD = Infinity
        for (const el of document.querySelectorAll('section.station[id]')) {
          const r = el.getBoundingClientRect()
          if (r.top <= mid && r.bottom >= mid) { found = el.id; break }
          // the last section cannot reach the midline at the foot of the page,
          // so fall back to whichever one is closest to it
          const d = Math.abs((r.top + r.bottom) / 2 - mid)
          if (r.bottom > 0 && r.top < window.innerHeight && d < nearestD) {
            nearestD = d
            nearest = el.id
          }
        }
        if (!found) found = nearest
        // at the very foot of the page the last section can never reach the
        // midline, so hand it the floor outright
        const atBottom =
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8
        if (atBottom) {
          const all = document.querySelectorAll('section.station[id]')
          if (all.length) found = all[all.length - 1].id
        }
        if (found !== activeSection.current) {
          activeSection.current = found
          const lines = found && sectionLines[found]
          if (lines) say({ text: lines[(Math.random() * lines.length) | 0], hurt: false }, { prio: 1, ms: 2800 })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [say])

  // deep links: /#project/finsql
  useEffect(() => {
    const read = () => {
      const m = window.location.hash.match(/^#project\/(.+)$/)
      setOpen(m ? m[1] : null)
    }
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])

  const openProject = useCallback((id) => { window.location.hash = `project/${id}` }, [])
  const closeProject = useCallback(() => {
    if (window.location.hash.startsWith('#project/')) window.history.back()
    else setOpen(null)
  }, [])

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape' && open) closeProject() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open, closeProject])

  /* one rAF loop for the DOM: card tilt, the speech bubble, the readout */
  useEffect(() => {
    if (phone) return // no cursor on a phone: no tilt, no floating bubble, no readout
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let acc = 0
    let lastT = performance.now()

    const loop = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now

      if (!reduce) {
        const tiles = document.querySelectorAll('.tilt')
        for (const el of tiles) {
          const r = el.getBoundingClientRect()
          if (r.bottom < -80 || r.top > window.innerHeight + 80) continue
          const a = (pointer.sx - (r.left + r.width / 2)) / Math.max(1, r.width)
          const b = (pointer.sy - (r.top + r.height / 2)) / Math.max(1, r.height)
          el.style.transform = `rotateX(${(Math.max(-1, Math.min(1, b)) * -6).toFixed(2)}deg) rotateY(${(Math.max(-1, Math.min(1, a)) * 6).toFixed(2)}deg)`
        }
      }

      if (bubbleRef.current) {
        bubbleRef.current.style.left = `${telemetry.ghostSX}px`
        bubbleRef.current.style.top = `${telemetry.ghostSY}px`
      }

      acc += dt
      if (acc > 0.1) {
        acc = 0
        const r = readout.current
        if (r.act) r.act.textContent = telemetry.ghostAct
        if (r.clip) r.clip.textContent = MOODS[telemetry.ghostClip] || telemetry.ghostClip
        if (r.bar) r.bar.style.width = `${Math.round(telemetry.ghostCalm * 100)}%`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [phone])

  return (
    <>
      <Scene onGhostSay={ghostSay} explaining={!!open} phone={phone} />
      {!phone && <NameSwarm />}

      <main className="page">
        <Hero phone={phone} />
        <Background />
        <Projects onOpen={openProject} />
        <Skills />
        <Achievements />
        <Contact />
      </main>

      {!phone && (
        <>
          <aside className="readout" aria-hidden="true">
            <h6>The ghost</h6>
            <div className="row2"><span>doing</span><i ref={(e) => (readout.current.act = e)}>loading</i></div>
            <div className="row2"><span>feeling</span><i ref={(e) => (readout.current.clip = e)}>&mdash;</i></div>
            <div className="row2"><span>patience</span><b><span className="bar"><span ref={(e) => (readout.current.bar = e)} /></span></b></div>
            <p className="readout__hint">poke him</p>
          </aside>

          <div ref={bubbleRef} className={`bubble${bubble ? ' on' : ''}${bubble?.hurt ? ' hurt' : ''}`}>
            {bubble?.text}
          </div>
        </>
      )}

      {open && <ProjectSheet id={open} onClose={closeProject} />}
    </>
  )
}
