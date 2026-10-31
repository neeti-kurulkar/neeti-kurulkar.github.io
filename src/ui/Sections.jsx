import { useState } from 'react'
import {
  person, education, internships, projects, archive, skills, spoken, achievements, credits,
} from '../content'

/* Everything reads like a panel on the same instrument: a ruled header with a
   channel number, monospace keys on the left, values right-aligned. */

function Head({ n, title, note }) {
  return (
    <header className="head">
      <span className="head__n">{n}</span>
      <h2 className="head__t">{title}</h2>
      <span className="head__rule" aria-hidden="true" />
      {note && <span className="head__note">{note}</span>}
    </header>
  )
}

export function Hero({ phone }) {
  /* On desktop the name is drawn in particles behind the page, so the h1 is
     there for screen readers only. On a phone there is no swarm, so the h1
     has to carry it and is set properly. */
  return (
    <section className="station hero" id="top">
      <h1 className={phone ? 'hero__name' : 'vh'}>{person.name}</h1>
      <p className="hero__line">{person.line}</p>
      <p className="hero__meta">{person.where}</p>
    </section>
  )
}

/* education and internships share a screen: neither needs a whole one */
export function Background() {
  return (
    <section className="station" id="background">
      <Head n="01" title="Background" />
      <div className="twoup">
        <div className="panel">
          <h3 className="panel__t">Education</h3>
          {education.map((e) => (
            <div className="entry" key={e.school}>
              <div className="entry__top">
                <span className="entry__name">{e.school}</span>
                <span className="entry__when num">{e.period}</span>
              </div>
              <div className="entry__sub">
                <span>{e.degree}</span>
                {e.detail && <span className="num hi">{e.detail}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3 className="panel__t">Internships</h3>
          {internships.map((j) => (
            <div className="entry" key={j.company}>
              <div className="entry__top">
                <span className="entry__name">{j.company}</span>
                <span className="entry__when num">{j.period}</span>
              </div>
              <div className="entry__sub">
                <span>{j.role}</span>
                <span className="num">{j.detail}</span>
              </div>
              <ul className="entry__points">
                {j.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* the section the page is really for */
export function Projects({ onOpen }) {
  const [more, setMore] = useState(false)
  return (
    <section className="station projects" id="projects">
      <Head n="02" title="Projects" note={`${projects.length} in focus · ${archive.length} more`} />

      <div className="pgrid">
        {projects.map((p) => (
          <article className="proj tilt" key={p.id}>
            <div className="proj__head">
              <h3 className="proj__name">{p.name}</h3>
              <span className="proj__year num">{p.year}</span>
            </div>

            <ul className="proj__tags">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <dl className="readings">
              {p.readings.map((r) => (
                <div className="reading" key={r.k}>
                  <dt>{r.k}</dt>
                  <dd className="num">{r.v}</dd>
                </div>
              ))}
            </dl>

            <p className="proj__blurb">{p.blurb}</p>

            <ul className="chips">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <div className="proj__foot">
              <button type="button" className="btn btn--ghost" onClick={() => onOpen(p.id)}>
                Read more
              </button>
              {p.demo && (
                <a className="btn btn--go" href={p.demo.href} target="_blank" rel="noreferrer">
                  {p.demo.label} <Arrow />
                </a>
              )}
              <a className="btn btn--quiet" href={p.code} target="_blank" rel="noreferrer">
                Code <Arrow />
              </a>
            </div>
          </article>
        ))}
      </div>

      <button type="button" className="more" aria-expanded={more} onClick={() => setMore((v) => !v)}>
        {more ? '— hide earlier work' : `+ see ${archive.length} earlier projects`}
      </button>

      {more && (
        <ul className="archive">
          {archive.map((a) => (
            <li className="arch" key={a.name}>
              <span className="arch__y num">{a.year}</span>
              <div>
                <h4 className="arch__n">{a.name}</h4>
                <p className="arch__note">{a.note}</p>
              </div>
              <div className="arch__links">
                {a.demo && (
                  <a href={a.demo} target="_blank" rel="noreferrer">
                    Live
                  </a>
                )}
                {a.code && (
                  <a href={a.code} target="_blank" rel="noreferrer">
                    Code
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function Skills() {
  return (
    <section className="station" id="skills">
      <Head n="03" title="Skills" />
      <div className="twoup">
        <div className="panel">
          <h3 className="panel__t">Technical</h3>
          {skills.map((s) => (
            <div className="kv" key={s.group}>
              <span className="kv__k">{s.group}</span>
              <span className="kv__v">{s.items}</span>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3 className="panel__t">Spoken</h3>
          <dl className="readings">
            {spoken.map((l) => (
              <div className="reading" key={l.name}>
                <dt>{l.name}</dt>
                <dd className="num">{l.level}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export function Achievements() {
  return (
    <section className="station" id="achievements">
      <Head n="04" title="Achievements" />
      <ul className="awards">
        {achievements.map((a) => (
          <li className="award tilt" key={a.name}>
            <span className="award__place num">{a.place}</span>
            <h3 className="award__name">{a.name}</h3>
            <p className="award__of">{a.of}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---- contact: real tiles with real marks, not a list of links ---- */
function Arrow() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" className="arr">
      <path d="M3 9L9 3M9 3H4.2M9 3v4.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MARKS = {
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.17 9.05 7.57 10.52.55.1.76-.24.76-.53v-2.07c-3.08.67-3.73-1.3-3.73-1.3-.5-1.29-1.23-1.63-1.23-1.63-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.46-.28-5.05-1.23-5.05-5.48 0-1.21.43-2.2 1.14-2.98-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.14a10.5 10.5 0 0 1 5.56 0c2.12-1.44 3.04-1.14 3.04-1.14.61 1.53.23 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.6 5.2-5.07 5.47.4.35.76 1.03.76 2.08v3.08c0 .3.2.64.77.53 4.4-1.47 7.56-5.62 7.56-10.52C23.1 5.33 18.27.5 12 .5Z"
      />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.44-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
      />
    </svg>
  ),
}

export function Contact() {
  const links = [
    { key: 'mail', label: 'Email', value: person.email, href: `mailto:${person.email}` },
    { key: 'github', label: 'GitHub', value: 'neeti-kurulkar', href: person.github },
    { key: 'linkedin', label: 'LinkedIn', value: 'in/neeti-kurulkar', href: person.linkedin },
  ]
  return (
    <section className="station" id="contact">
      <Head n="05" title="Contact" note="open to talk" />
      <ul className="tiles">
        {links.map((l) => (
          <li key={l.key}>
            <a className="tile tilt" href={l.href} target={l.key === 'mail' ? undefined : '_blank'} rel="noreferrer">
              <span className="tile__mark">{MARKS[l.key]}</span>
              <span className="tile__label">{l.label}</span>
              <span className="tile__value">{l.value}</span>
              <span className="tile__go" aria-hidden="true">
                <Arrow />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="credits">
        {credits.map((c) => (
          <span key={c.title}>
            <a href={c.href} target="_blank" rel="noreferrer">
              {c.title}
            </a>{' '}
            by {c.author}, {c.licence}, via Sketchfab.
          </span>
        ))}
      </p>
    </section>
  )
}

export function ProjectSheet({ id, onClose }) {
  const p = projects.find((x) => x.id === id)
  if (!p) return null
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="sheet__scrim" onClick={onClose} />
      <div className="sheet__body">
        <button type="button" className="sheet__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <span className="sheet__eye">
          {p.year} · {p.tags.join(' · ')}
        </span>
        <h2 className="sheet__h">{p.name}</h2>

        <dl className="readings readings--wide">
          {p.readings.map((r) => (
            <div className="reading" key={r.k}>
              <dt>{r.k}</dt>
              <dd className="num">{r.v}</dd>
            </div>
          ))}
        </dl>

        <p className="sheet__p">{p.blurb}</p>
        <p className="sheet__p">{p.detail}</p>

        <ul className="chips">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <div className="proj__foot">
          {p.demo && (
            <a className="btn btn--go" href={p.demo.href} target="_blank" rel="noreferrer">
              {p.demo.label} <Arrow />
            </a>
          )}
          <a className="btn btn--quiet" href={p.code} target="_blank" rel="noreferrer">
            Code <Arrow />
          </a>
        </div>
      </div>
    </div>
  )
}
