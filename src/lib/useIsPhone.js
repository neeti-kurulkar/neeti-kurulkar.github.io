import { useEffect, useState } from 'react'

/* True on phones and other small touch screens. The 3D ghost, the particle
   swarm and the pointer-driven tilt all assume a cursor and a desktop GPU,
   so none of them are mounted here: the page falls back to the starfield
   and the cards, which is the whole of the content anyway. */
const QUERY = '(max-width: 860px), (pointer: coarse)'

export function useIsPhone() {
  const [phone, setPhone] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setPhone(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return phone
}
