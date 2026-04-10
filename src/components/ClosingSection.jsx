import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ClosingSection({ lang, content }) {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const headRef = useRef(null)
  const descRef = useRef(null)
  const btnRef = useRef(null)
  const phoneRef = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo([labelRef.current, headRef.current, descRef.current, btnRef.current, phoneRef.current],
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, stagger: 0.15, duration: 1.05, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
      gsap.fromTo(footerRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Magnetic on button
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const onMove = (e) => {
      const rect = btn.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.35
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' })
    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    return () => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave) }
  }, [])

  const isCn = lang === 'cn'
  const { title, desc, button, whatsapp } = content.cta

  return (
    <section id="closing" ref={sectionRef} className="closing-section with-noise" style={{ flexDirection: 'column', gap: '3rem' }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(255,92,40,0.1) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '0 clamp(1.5rem,6vw,8rem)' }}>
        <p ref={labelRef} className="text-label" style={{ marginBottom: '1.5rem', opacity: 0 }}>
          {isCn ? '下一步' : "What's Next"}
        </p>

        <h2
          ref={headRef}
          style={{
            fontFamily: 'var(--font-en-display)', fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            lineHeight: 0.9, letterSpacing: '-0.04em',
            color: 'var(--white)', marginBottom: '1.5rem', opacity: 0,
          }}
        >
          {isCn ? title.cn : title.en}
        </h2>

        <p
          ref={descRef}
          style={{ color: 'var(--gray)', maxWidth: '55ch', margin: '0 auto 3rem', lineHeight: 1.8, fontSize: '1rem', opacity: 0 }}
        >
          {isCn ? desc.cn : desc.en}
        </p>

        {/* WhatsApp CTA Button */}
        <a
          ref={btnRef}
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn"
          style={{ opacity: 0, display: 'inline-flex' }}
        >
          <span className="cta-btn-inner">
            <span className="cta-btn-icon-wrap" aria-hidden="true">
              <svg className="cta-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </span>
            <span className="cta-btn-label">{isCn ? button.cn : button.en}</span>
          </span>
        </a>

        {/* Phone number hint */}
        <p ref={phoneRef} className="closing-phone" style={{ marginTop: '1.25rem', color: 'var(--gray)', fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0 }}>
          <a href="tel:+60102549899" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 800 }}>
            +6010-254 9899 
          </a>
        </p>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="closing-footer"
        style={{
          textAlign: 'center', opacity: 0,
          borderTop: '1px solid var(--border)',
          padding: '2rem clamp(1.5rem,6vw,8rem) 0',
          margin: '2.5rem 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-en-display)', fontWeight: 800,
            fontSize: '1.1rem', letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'var(--orange)' }}>Alex</span> Khoo
          </span>
          <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
          <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>Jextures Sdn. Bhd.</span>
          <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
          <span className="closing-tagline" style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>
            {isCn ? '品牌感知是设计出来的，而非偶然。' : 'Brand perception is intentional, not incidental.'}
          </span>
          <span className="closing-tagline" style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>
            {isCn ? '人们记住的，是他们感受到的。' : 'What people feel is what they remember.'}
          </span>
        </div>
      </div>
    </section>
  )
}
