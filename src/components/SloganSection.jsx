import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Split text into individual character spans
function splitToChars(text, baseClass = 'slogan-char', wrapWords = false) {
  if (!wrapWords) {
    return text.split('').map((char, i) => (
      <span key={i} className={baseClass} style={{ display: 'inline-block' }}>
        {char === '\n' ? <br /> : char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  const words = text.split(' ')
  return words.map((word, wi) => (
    <span key={`word-${wi}`} className="slogan-word">
      {word.split('').map((char, i) => (
        <span key={`${wi}-${i}`} className={baseClass} style={{ display: 'inline-block' }}>
          {char}
        </span>
      ))}
      {wi < words.length - 1 && <span className="slogan-word-space">{'\u00A0'}</span>}
    </span>
  ))
}

export default function SloganSection({ lang, content }) {
  const sectionRef = useRef(null)
  const mainRef = useRef(null)
  const subCnRef = useRef(null)
  const subEnRef = useRef(null)
  const dividerRef = useRef(null)
  const bgGlowRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = mainRef.current?.querySelectorAll('.slogan-char') || []

      // Chars drop in with blur
      gsap.fromTo(chars,
        { opacity: 0, y: -60, filter: 'blur(12px)', scale: 1.3 },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
          duration: 1.0, stagger: 0.04, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )

      // Sub slogans fade in
      gsap.fromTo(subCnRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )

      gsap.fromTo(subEnRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.9,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )

      gsap.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.55,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )

      // Background glow pulse
      gsap.fromTo(bgGlowRef.current,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  const isCn = lang === 'cn'
  const { main, sub } = content.slogan

  // Main slogan — split by newline
  const lines = (isCn ? main.cn : main.en).split('\n')
  const wrapWords = !isCn

  return (
    <section ref={sectionRef} className="slogan-section" id="slogan">
      <div className="slogan-ambient slogan-ambient-left" aria-hidden="true" />
      <div className="slogan-ambient slogan-ambient-right" aria-hidden="true" />
      <div className="slogan-ribbon slogan-ribbon-a" aria-hidden="true" />
      <div className="slogan-ribbon slogan-ribbon-b" aria-hidden="true" />
      <div className="slogan-grid" aria-hidden="true" />
      <div className="slogan-noise-glow" aria-hidden="true" />

      {/* Background glow */}
      <div ref={bgGlowRef} className="slogan-core-glow" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '2rem clamp(1.5rem, 6vw, 8rem)' }}>

        {/* Main slogan */}
        <div
          ref={mainRef}
          className={`slogan-main ${isCn ? 'slogan-main-cn' : 'slogan-main-en'}`}
        >
          {lines.map((line, li) => (
            <div key={li} style={{ display: 'block' }}>
              {splitToChars(line, 'slogan-char', wrapWords)}
              {li < lines.length - 1 && <br />}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div ref={dividerRef} style={{
          width: '4rem', height: '2px',
          background: 'var(--orange)',
          margin: '2.5rem auto',
          borderRadius: '2px',
          transformOrigin: 'center',
          opacity: 0,
        }} />

        {/* Sub — Chinese */}
        <p ref={subCnRef} className="slogan-sub-cn" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', marginBottom: '0.75rem', whiteSpace: 'pre-line' }}>
          {sub.cn}
        </p>

        {/* Sub — English */}
        <p ref={subEnRef} className="slogan-en" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)' }}>
          {sub.en.split('\n').map((line, index) => (
            <span
              key={line}
              className={`slogan-sub-line ${index === 1 ? 'slogan-sub-line-tight' : ''}`}
            >
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
