import { person, education, projects, internships, skills, awards, credits } from '../content'

/* Cards tilt toward the pointer. Plain DOM, driven by a rAF loop in App. */
export function Hero() {
  return (
    <section className="station hero" id="top">
      <h1 className="vh">{person.name}</h1>
      <p className="hero__line">{person.line}</p>
      <p className="hero__meta">{person.where}</p>
      <div className="tips">
        <span>drag through the name</span>
        <span>hover near the edges</span>
        <span>then poke him</span>
      </div>
    </section>
  )
}

export function Education() {
  return (
    <section className="station" id="education">
      <span className="eyebrow">01</span>
      <h2>Education</h2>
      <ul className="rows">
        {education.map((e) => (
          <li className="row" key={e.school}>
            <div>
              <h3 className="row__title">{e.school}</h3>
              <p className="row__sub">{e.degree}</p>
            </div>
            <div className="row__meta">
              {e.detail && <span className="num">{e.detail}</span>}
              <span className="num dim">{e.period}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Projects({ onOpen }) {
  return (
    <section className="station" id="projects">
      <span className="eyebrow">02</span>
      <h2>Projects</h2>
      <div className="grid">
        {projects.map((p) => (
          <article className="card tilt" key={p.id}>
            <div className="card__top">
              <h3 className="card__name">{p.name}</h3>
              <span className="num dim">{p.year}</span>
            </div>
            <p className="card__stat num">{p.stat}</p>
            <p className="card__statnote">{p.statNote}</p>
            <p className="card__blurb">{p.blurb}</p>
            <ul className="chips">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="card__links">
              <button type="button" className="linklike" onClick={() => onOpen(p.id)}>
                Read more
              </button>
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Internships() {
  return (
    <section className="station" id="internships">
      <span className="eyebrow">03</span>
      <h2>Internships</h2>
      <ol className="jobs">
        {internships.map((j) => (
          <li className="job" key={j.company}>
            <div className="job__when">
              <span className="num">{j.period}</span>
              <span className="dim">{j.place}</span>
            </div>
            <div>
              <h3 className="row__title">{j.role}</h3>
              <p className="row__sub">{j.company}</p>
              <ul className="bullets">
                {j.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Skills() {
  return (
    <section className="station" id="skills">
      <span className="eyebrow">04</span>
      <h2>Skills</h2>
      <div className="skills">
        <ul className="skills__list">
          {skills.map((s) => (
            <li key={s.group}>
              <span className="skills__group">{s.group}</span>
              <span className="skills__items">{s.items}</span>
            </li>
          ))}
        </ul>
        <div className="awards tilt">
          <h3 className="awards__title">Awards</h3>
          <ul>
            {awards.map((a) => (
              <li key={a.name}>
                <span>{a.name}</span>
                <span className="num">{a.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="station" id="contact">
      <span className="eyebrow">05</span>
      <h2>Contact</h2>
      <ul className="contact">
        <li>
          <span className="dim">Email</span>
          <a href={`mailto:${person.email}`}>{person.email}</a>
        </li>
        <li>
          <span className="dim">GitHub</span>
          <a href={person.github} target="_blank" rel="noreferrer">
            github.com/neeti-kurulkar
          </a>
        </li>
        <li>
          <span className="dim">LinkedIn</span>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            in/neeti-kurulkar
          </a>
        </li>
      </ul>
      <p className="credits">
        Ghost model:{' '}
        {credits.map((c, i) => (
          <span key={c.title}>
            {i > 0 && ' · '}
            <a href={c.href} target="_blank" rel="noreferrer">
              {c.title}
            </a>{' '}
            by {c.author} ({c.licence})
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
        <span className="eyebrow">
          {p.year} · {p.tags.join(' · ')}
        </span>
        <h2>{p.name}</h2>
        <p className="sheet__stat num">{p.stat}</p>
        <p className="card__statnote">{p.statNote}</p>
        <p className="sheet__p">{p.blurb}</p>
        <p className="sheet__p">{p.detail}</p>
        <ul className="chips">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="card__links">
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
