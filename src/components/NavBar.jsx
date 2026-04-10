import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function NavBar({ lang, setLang, content, revealDelay = 2.8 }) {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Entrance
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: revealDelay }
    )

    // Scroll class
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [revealDelay])

  const isCn = lang === 'cn'

  return (
    <nav ref={navRef} className={`nav-root ${scrolled ? 'scrolled' : ''}`} style={{ opacity: 0 }}>
      {/* Logo */}
      <a href="#intro" className="nav-logo">
        <span style={{ color: 'var(--orange)' }}>Alex</span>
        <span> Khoo</span>
      </a>

      {/* CTA + Lang */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <a
          href={content.cta.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'none',
            padding: '0.55rem 1.4rem',
            borderRadius: '999px',
            background: 'var(--orange)',
            color: 'var(--text-on-accent)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
          className="lg:block"
        >
          {isCn ? '一对一' : '121'}
        </a>

        <div className="lang-pill" style={{ '--pill-x': lang === 'en' ? '100%' : '0%' }}>
          <span className="lang-indicator" aria-hidden="true" />
          <button className={`lang-btn ${lang === 'cn' ? 'active' : ''}`} onClick={() => setLang('cn')}>
            中
          </button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
            EN
          </button>
        </div>
      </div>
    </nav>
  )
}
