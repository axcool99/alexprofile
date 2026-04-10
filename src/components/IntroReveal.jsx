import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Lightweight canvas particles
function Particles({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const particles = []
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.35 + 0.05,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 92, 40, ${p.a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [canvasRef])
  return null
}

export default function IntroReveal({ lang, content, entryDelay = 0.2 }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const line1Ref = useRef(null)   // "Alex"
  const line2Ref = useRef(null)   // "Khoo"
  const labelRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: entryDelay })

      // Line 1: "Alex" — clip-path wipe from left
      tl.fromTo(
        line1Ref.current,
        { clipPath: 'inset(0 100% 0 0)', y: 0 },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.inOut' },
        0
      )
      // Line 2: "Khoo" — slight delay, wipe from right
      tl.fromTo(
        line2Ref.current,
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'expo.inOut' },
        0.15
      )
      // Label fades in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.9
      )
      // Scroll hint
      tl.fromTo(
        hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        1.4
      )

      gsap.fromTo(
        '.intro-kaleidoscope-wrap',
        { opacity: 0.35, scale: 0.92 },
        { opacity: 0.95, scale: 1, duration: 1.8, ease: 'power2.out' }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [entryDelay])

  const isCn = lang === 'cn'

  return (
    <section id="intro" ref={sectionRef} className="intro-section with-noise">
      <div className="intro-kaleidoscope-wrap" aria-hidden="true">
        <div className="intro-kaleidoscope" />
      </div>

      {/* Particle bg */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
      />
      <Particles canvasRef={canvasRef} />

      <div className="intro-vignette" aria-hidden="true" />

      {/* Main Name */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', userSelect: 'none' }}>
        <div
          ref={line1Ref}
          style={{
            clipPath: 'inset(0 100% 0 0)',
            fontFamily: 'var(--font-en-display)',
            fontWeight: 800,
            fontSize: 'clamp(6rem, 22vw, 22rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.05em',
            color: 'var(--orange)',
            display: 'block',
          }}
        >
          Alex
        </div>
        <div
          ref={line2Ref}
          style={{
            clipPath: 'inset(0 0 0 100%)',
            fontFamily: 'var(--font-en-display)',
            fontWeight: 800,
            fontSize: 'clamp(6rem, 22vw, 22rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.05em',
            color: 'var(--white)',
            display: 'block',
          }}
        >
          Khoo
        </div>

        {/* Label */}
        <p
          ref={labelRef}
          className="intro-label"
          style={{ marginTop: '2rem' }}
        >
          {isCn
            ? 'Jextures · 创始人 & 数字体验总监'
            : 'Jextures · Founder & Digital Experience Director'}
        </p>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="intro-scroll-hint">
        <span>{isCn ? '向下滚动' : 'Scroll'}</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
