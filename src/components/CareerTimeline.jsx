import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LineIcon from './LineIcon'

gsap.registerPlugin(ScrollTrigger)

export default function CareerTimeline({ lang, content }) {
  const sectionRef = useRef(null)
  const wrapRef = useRef(null)
  const lineRef = useRef(null)
  const headRef = useRef(null)
  const nodeRefs = useRef([])
  const dotRefs = useRef([])
  const cardRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Heading
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
        }
      )

      mm.add('(min-width: 769px)', () => {
        gsap.fromTo(lineRef.current,
          { height: 0 },
          {
            height: '100%', duration: 2, ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        )
      })

      mm.add('(max-width: 768px)', () => {
        gsap.fromTo(lineRef.current,
          { height: 0 },
          {
            height: '100%', duration: 2, ease: 'none',
            scrollTrigger: {
              trigger: wrapRef.current,
              start: 'top 92%',
              end: 'bottom 90%',
              scrub: 1.8,
            },
          }
        )
      })

      // Each card + node
      mm.add('(min-width: 769px)', () => {
        cardRefs.current.forEach((card, i) => {
          if (!card) return
          const node = nodeRefs.current[i]
          const dot = dotRefs.current[i]

          gsap.fromTo(node,
            { opacity: 0, scale: 0 },
            {
              opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)',
              scrollTrigger: { trigger: card, start: 'top 80%' },
            }
          )

          if (dot) {
            gsap.to(dot, {
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                onEnter: () => {
                  gsap.fromTo(dot,
                    { scale: 0.85, opacity: 0.35 },
                    {
                      scale: 1.2, opacity: 1, duration: 0.45, ease: 'power3.out',
                      onComplete: () => gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power2.out' }),
                    }
                  )
                },
                onLeaveBack: () => gsap.to(dot, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.out' }),
              },
            })
          }

          gsap.fromTo(card,
            { opacity: 0, x: 40 },
            {
              opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', delay: 0.15,
              scrollTrigger: { trigger: card, start: 'top 80%' },
            }
          )
        })
      })

      mm.add('(max-width: 768px)', () => {
        cardRefs.current.forEach((card, i) => {
          if (!card) return
          const node = nodeRefs.current[i]
          const dot = dotRefs.current[i]

          gsap.fromTo(node,
            { opacity: 0, scale: 0 },
            {
              opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)',
              scrollTrigger: { trigger: card, start: 'top 92%' },
            }
          )

          if (dot) {
            gsap.to(dot, {
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                onEnter: () => {
                  gsap.fromTo(dot,
                    { scale: 0.85, opacity: 0.35 },
                    {
                      scale: 1.2, opacity: 1, duration: 0.45, ease: 'power3.out',
                      onComplete: () => gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power2.out' }),
                    }
                  )
                },
                onLeaveBack: () => gsap.to(dot, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.out' }),
              },
            })
          }

          gsap.fromTo(card,
            { opacity: 0, x: 24, y: 18 },
            {
              opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'expo.out', delay: 0.08,
              scrollTrigger: { trigger: card, start: 'top 92%' },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const isCn = lang === 'cn'
  const { milestones, sectionTitle } = content.career

  return (
    <section id="career" ref={sectionRef} className="section-base" style={{ background: 'var(--bg-2)' }}>
      <div className="max-container">
        {/* Header */}
        <div ref={headRef} style={{ marginBottom: '5rem', opacity: 0 }}>
          <p className="text-label" style={{ marginBottom: '1rem' }}>
            {isCn ? '我的历程' : 'Career Path'}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-en-display)', fontWeight: 800,
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--white)',
          }}>
            {isCn ? sectionTitle.cn : sectionTitle.en}
          </h2>
          <div className="accent-line" style={{ marginTop: '1.5rem' }} />
        </div>

        {/* Timeline */}
        <div ref={wrapRef} className="timeline-wrap" style={{ position: 'relative', paddingLeft: '3.5rem' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '2px', height: '100%', background: 'var(--border)', borderRadius: '2px' }}>
            <div ref={lineRef} style={{
              height: 0,
              width: '100%',
              background: 'linear-gradient(to bottom, var(--orange), var(--gold))',
              borderRadius: '2px',
            }} />
          </div>

          {milestones.map((m, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: i < milestones.length - 1 ? '4rem' : 0 }}>
              {/* Node dot */}
              <div
                ref={(el) => (nodeRefs.current[i] = el)}
                style={{
                  position: 'absolute', left: '-4rem',
                  top: '1.75rem',
                  width: '1rem', height: '1rem', borderRadius: '50%',
                  background: i === milestones.length - 1 ? 'var(--orange)' : 'var(--bg-card)',
                  border: `2px solid ${i === milestones.length - 1 ? 'var(--orange)' : 'var(--border-hover)'}`,
                  boxShadow: i === milestones.length - 1 ? '0 0 20px rgba(255,92,40,0.6)' : 'none',
                  opacity: 0,
                  zIndex: 2,
                }}
              >
                <span
                  ref={(el) => (dotRefs.current[i] = el)}
                  style={{
                    position: 'absolute', inset: '-0.45rem',
                    borderRadius: '999px',
                    background: 'radial-gradient(circle, rgba(255,92,40,0.75) 0%, rgba(255,92,40,0.15) 40%, transparent 70%)',
                    boxShadow: '0 0 16px rgba(255,92,40,0.45)',
                    opacity: 0,
                    transform: 'scale(0.8)',
                  }}
                />
              </div>

              {/* Card */}
              <div
                ref={(el) => (cardRefs.current[i] = el)}
                className="timeline-card"
                style={{ opacity: 0 }}
              >
                <div className="timeline-period">{m.period}</div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1rem' }}>
                  <div className="mark-badge mark-badge-lg timeline-mark">
                    <LineIcon name={m.icon} className="line-icon" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: isCn ? "'Noto Serif SC', serif" : 'var(--font-en-display)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                      color: 'var(--white)', marginBottom: '0.25rem',
                    }}>
                      {isCn ? m.role.cn : m.role.en}
                    </h3>
                    <p style={{ color: 'var(--orange)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {m.company}
                    </p>
                  </div>
                </div>

                <p style={{ color: 'var(--gray)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                  {isCn ? m.desc.cn : m.desc.en}
                </p>

                {/* Active badge for latest */}
                {i === milestones.length - 1 && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    marginTop: '1.25rem',
                    padding: '0.35rem 0.9rem',
                    background: 'rgba(255,92,40,0.1)',
                    border: '1px solid var(--orange-border)',
                    borderRadius: '999px',
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                    color: 'var(--orange)',
                  }}>
                    <span style={{
                      width: '0.45rem', height: '0.45rem', borderRadius: '50%',
                      background: 'var(--orange)',
                      animation: 'pulse-glow 2s ease-in-out infinite',
                    }} />
                    {isCn ? '现任职位' : 'Current'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
