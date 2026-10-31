import { useCallback, useEffect, useRef, useState } from 'react'
import Scene from './three/Scene'
import NameSwarm from './ui/NameSwarm'
import { Hero, Background, Projects, Skills, Achievements, Contact, ProjectSheet } from './ui/Sections'
import { attachPointer, pointer, telemetry } from './lib/pointer'

const MOODS = { Idle: 'calm', Wave: 'pleased', Scared: 'rattled' }

export default function App() {
  const [bubble, setBubble] = useState(null)
  const [open, setOpen] = useState(null)
  const bubbleRef = useRef(null)
  const readout = useRef({})

  useEffect(() => attachPointer(), [])

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
  }, [])

  return (
    <>
      <Scene onGhostSay={setBubble} explaining={!!open} />
      <NameSwarm />

      <main className="page">
        <Hero />
        <Background />
        <Projects onOpen={openProject} />
        <Skills />
        <Achievements />
        <Contact />
      </main>

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

      {open && <ProjectSheet id={open} onClose={closeProject} />}
    </>
  )
}
