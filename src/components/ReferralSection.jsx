import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LineIcon from './LineIcon'

gsap.registerPlugin(ScrollTrigger)

export default function ReferralSection({ lang, content }) {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const boxRef = useRef(null)
  const textRef = useRef(null)
  const cueRef = useRef(null)
  const cardRefs = useRef([])
  const [typed, setTyped] = useState('')

  const isCn = lang === 'cn'
  const { trigger, cue, signals, sectionTitle } = content.referral

  // Typewriter effect
  useEffect(() => {
    let tween
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: boxRef.current,
        start: 'top 70%',
        once: true,
        onEnterBack: () => {
          if (typed) return
          setTyped(isCn ? trigger.cn : trigger.en)
          gsap.to(cueRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
          gsap.to(cardRefs.current.filter(Boolean), {
            opacity: 1, y: 0, duration: 0.4, ease: 'power3.out',
          })
        },
        onEnter: () => {
          // Typewriter
          setTyped('')
          const fullText = isCn ? trigger.cn : trigger.en
          let i = 0
          const interval = setInterval(() => {
            if (i < fullText.length) {
              setTyped(fullText.slice(0, i + 1))
              i++
            } else {
              clearInterval(interval)
              // Cue line fades in
              gsap.to(cueRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
              // Signal cards stagger in
              gsap.to(cardRefs.current.filter(Boolean), {
                opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'expo.out', delay: 0.2,
              })
            }
          }, 20)
        },
      })

      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)

    return () => { ctx.revert() }
  }, [lang])

  return (
    <section id="referral" ref={sectionRef} className="section-base" style={{ background: 'var(--bg-2)' }}>
      <div className="max-container">
        {/* Header */}
        <div ref={headRef} style={{ marginBottom: '4rem', opacity: 0 }}>
          <h2 style={{
            fontFamily: 'var(--font-en-display)', fontWeight: 800,
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--orange)',
            maxWidth: '18ch',
          }}>
            {isCn ? sectionTitle.cn : sectionTitle.en}
          </h2>
          <div className="accent-line" style={{ marginTop: '1.5rem', background: 'var(--white)' }} />
        </div>

        {/* Typewriter box */}
        <div
          ref={boxRef}
          className="referral-trigger-box"
          style={{ marginBottom: '3rem', position: 'relative' }}
        >
          {/* Quote marks */}
          <div style={{
            position: 'absolute', top: '-1.5rem', left: '2rem',
            fontFamily: 'Georgia, serif', fontSize: '6rem',
            color: 'var(--orange)', opacity: 0.15, lineHeight: 1,
          }}>"</div>

          <div
            ref={textRef}
            className="referral-trigger-text"
            style={{
              fontFamily: isCn ? "'Noto Serif SC', serif" : 'var(--font-en-display)',
              fontWeight: isCn ? 600 : 700,
              minHeight: '4rem',
            }}
          >
            {typed}
            <span style={{
              display: 'inline-block', width: '2px', height: '1em',
              background: 'var(--orange)', marginLeft: '2px',
              animation: 'blink 1s step-end infinite',
              verticalAlign: 'text-bottom',
            }} />
          </div>
        </div>

        {/* Cue line */}
        <p
          ref={cueRef}
          style={{
            opacity: 0, transform: 'translateY(16px)',
            fontFamily: 'var(--font-en-display)', fontWeight: 700,
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            color: 'var(--orange)',
            marginBottom: '3.5rem',
          }}
        >
          {isCn ? cue.cn : cue.en}
        </p>

        {/* Signal cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {signals.map((signal, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="signal-card"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
            >
              <div className="mark-badge signal-mark">
                <LineIcon name={signal.icon || 'SIG'} className="line-icon" aria-hidden="true" />
              </div>
              <p style={{
                fontFamily: 'var(--font-en-display)', fontWeight: 700,
                color: 'var(--white)', fontSize: '0.95rem',
              }}>
                {isCn ? signal.cn : signal.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
