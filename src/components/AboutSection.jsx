import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LineIcon from './LineIcon'
import catCodesHtml from '../../codepensource/catcodes/source.html?raw'

gsap.registerPlugin(ScrollTrigger)

const FACTS = [
  { icon: 'SK', en: 'Seri Kembangan, originally from Klang', cn: '居于Seri Kembangan，来自巴生' },
  { icon: '38', en: '38 years old', cn: '38 岁' },
  { icon: 'MR', en: 'Married', cn: '已婚' },
  { icon: 'K7', en: '1 son, aged 7', cn: '育有一子，7 岁' },
  { icon: 'JX', en: 'Founder of Jextures Sdn. Bhd.', cn: 'Jextures Sdn. Bhd. 创始人' },
]

export default function AboutSection({ lang, content }) {
  const sectionRef = useRef(null)
  const photoWrapRef = useRef(null)
  const photoCardRef = useRef(null)
  const photoImageRef = useRef(null)
  const photoGlowRef = useRef(null)
  const photoFrameRefs = useRef([])
  const headingRef = useRef(null)
  const introRef = useRef(null)
  const quoteRef = useRef(null)
  const factRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const photoTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      photoTl
        .fromTo(photoWrapRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }
        )
        .fromTo(photoCardRef.current,
          { clipPath: 'inset(0 0 100% 0 round 1.5rem)', scale: 0.94, rotate: -2 },
          { clipPath: 'inset(0 0 0% 0 round 1.5rem)', scale: 1, rotate: 0, duration: 1.25, ease: 'expo.out' },
          0.05
        )
        .fromTo(photoImageRef.current,
          { scale: 1.18, yPercent: 10, filter: 'brightness(0.72) saturate(0.8)' },
          { scale: 1, yPercent: 0, filter: 'brightness(1) saturate(1)', duration: 1.4, ease: 'expo.out' },
          0.12
        )
        .fromTo(photoGlowRef.current,
          { xPercent: -140, opacity: 0 },
          { xPercent: 160, opacity: 1, duration: 1, ease: 'power2.inOut' },
          0.2
        )

      photoFrameRefs.current.forEach((el, i) => {
        if (!el) return
        photoTl.fromTo(el,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' },
          0.55 + i * 0.08
        )
      })

      // Heading
      gsap.fromTo(headingRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      )

      // Intro paragraph
      gsap.fromTo(introRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: introRef.current, start: 'top 85%' },
        }
      )

      // Facts stagger
      factRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, x: 30 },
          {
            opacity: 1, x: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })

      // Quote
      gsap.fromTo(quoteRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 85%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const isCn = lang === 'cn'

  return (
    <section id="about" ref={sectionRef} className="section-base">
      <div className="max-container">
        <div style={{ display: 'grid', gridTemplateColumns: '0.72fr 1.08fr 0.92fr', gap: 'clamp(1.5rem, 3.5vw, 3rem)', alignItems: 'center' }}
          className="lg-grid">

          {/* Left — Portrait */}
          <div ref={photoWrapRef} className="about-visual-stack" style={{ opacity: 0 }}>
            <div ref={photoCardRef} className="about-photo about-photo-compact">
              <img ref={photoImageRef} src="/profile.png" alt="Alex Khoo" />
              <div ref={photoGlowRef} className="about-photo-glow" />

              <div
                ref={(el) => (photoFrameRefs.current[0] = el)}
                style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '2rem', height: '2rem', borderTop: '2px solid var(--orange)', borderLeft: '2px solid var(--orange)' }}
              />
              <div
                ref={(el) => (photoFrameRefs.current[1] = el)}
                style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '2rem', height: '2rem', borderBottom: '2px solid var(--orange)', borderRight: '2px solid var(--orange)' }}
              />
            </div>
          </div>

          {/* Middle — Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Label + Heading */}
            <div ref={headingRef} style={{ opacity: 0 }}>
              <p className="text-label" style={{ marginBottom: '1rem' }}>
                {isCn ? '关于我' : 'About Me'}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-en-display)', fontWeight: 800,
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--white)',
              }}>
                {isCn ? content.metadata.nameCn : content.metadata.name}
              </h2>
            </div>

            {/* Intro paragraph */}
            <p
              ref={introRef}
              style={{ color: 'var(--gray)', lineHeight: 1.8, fontSize: '1rem', opacity: 0, maxWidth: '56ch' }}
            >
              {isCn ? content.about.intro.cn : content.about.intro.en}
            </p>

            {/* Facts */}
            <div className="about-facts-grid">
              {FACTS.map((fact, i) => (
                <div
                  key={i}
                  ref={(el) => (factRefs.current[i] = el)}
                  className="fact-item"
                  style={{ opacity: 0 }}
                >
                  <div className="fact-icon mark-badge">
                    <LineIcon name={fact.icon} className="line-icon" aria-hidden="true" />
                  </div>
                  <span style={{ color: 'var(--white)', fontSize: '0.95rem', fontWeight: 400 }}>
                    {isCn ? fact.cn : fact.en}
                  </span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <blockquote
              ref={quoteRef}
              style={{
                opacity: 0,
                borderLeft: '3px solid var(--orange)',
                paddingLeft: '1.5rem',
                fontFamily: isCn ? "'Noto Serif SC', serif" : 'var(--font-en-display)',
                fontWeight: isCn ? 600 : 700,
                color: 'var(--white)',
                fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                fontStyle: isCn ? 'normal' : 'italic',
                lineHeight: 1.5,
              }}
            >
              {isCn ? content.about.quote.cn : content.about.quote.en}
            </blockquote>
          </div>

          {/* Right — Catcodes */}
          <div className="about-catcodes-panel">
            <div className="about-catcodes-header">
              <span>{isCn ? '深夜编码模式' : 'Late Night Build Mode'}</span>
              <span>catcodes</span>
            </div>
            <div className="about-catcodes-frame">
              <iframe
                title="Catcodes animation"
                srcDoc={catCodesHtml}
                className="about-catcodes-embed"
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .lg-grid { grid-template-columns: 1fr !important; }
          .about-visual-stack { align-items: stretch !important; }
          .about-photo-compact { width: min(22rem, 100%) !important; }
          .about-facts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
