import { useEffect, useState } from 'react'

/* Three tiers, because the toys on this page each want something different.

     desktop   a pointer that hovers. Everything is on, including card tilt.
     tablet    a big touch screen. The ghost and the name swarm are on and
               are driven by your finger instead; nothing tilts, because
               there is no hover to tilt toward.
     phone     too small for the ghost to have anywhere to stand. Starfield
               and cards, which is the whole of the content anyway.

   A phone held sideways is a coarse pointer on a wide screen, so the tablet
   test asks for height as well as width. A narrow desktop window keeps its
   fine pointer and still gets the phone layout, which is what it wants. */
const TABLET = '(pointer: coarse) and (min-width: 768px) and (min-height: 600px)'
const COARSE = '(pointer: coarse)'
const NARROW = '(max-width: 860px)'

function read() {
  if (typeof window === 'undefined') return { tier: 'desktop', touch: false }
  const m = (q) => window.matchMedia(q).matches
  const touch = m(COARSE)
  const tier = touch && m(TABLET) ? 'tablet' : touch || m(NARROW) ? 'phone' : 'desktop'
  return { tier, touch }
}

export function useDevice() {
  const [dev, setDev] = useState(read)
  useEffect(() => {
    const qs = [TABLET, COARSE, NARROW].map((q) => window.matchMedia(q))
    // keep the same object while nothing has actually changed, so a resize
    // does not re-render the page for no reason
    const on = () =>
      setDev((prev) => {
        const next = read()
        return next.tier === prev.tier && next.touch === prev.touch ? prev : next
      })
    on()
    qs.forEach((q) => q.addEventListener('change', on))
    return () => qs.forEach((q) => q.removeEventListener('change', on))
  }, [])
  return dev
}
