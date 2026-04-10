import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { attachTilt } from '../utils/magnetic'
import LineIcon from './LineIcon'

gsap.registerPlugin(ScrollTrigger)

function WaveFieldBackground({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let width = 0
    let height = 0
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.tx = (event.clientX - rect.left) / rect.width
      pointer.ty = (event.clientY - rect.top) / rect.height
    }

    const drawGlow = (x, y, radius, color, alpha) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, `${color}${alpha})`)
      gradient.addColorStop(1, `${color}0)`)
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const render = (time) => {
      const t = time * 0.001
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(10, 10, 12, 0.12)'
      ctx.fillRect(0, 0, width, height)

      drawGlow(width * 0.28, height * 0.36, width * 0.28, 'rgba(201, 168, 76, ', 0.08)
      drawGlow(width * 0.75, height * 0.24, width * 0.2, 'rgba(161, 115, 255, ', 0.05)
      drawGlow(width * pointer.x, height * pointer.y, width * 0.14, 'rgba(255, 244, 235, ', 0.08)

      const waves = [
        { offset: -height * 0.18, amp: 18, freq: 0.015, speed: 0.9, color: '255,188,116', alpha: 0.7, width: 2.2 },
        { offset: 0, amp: 24, freq: 0.013, speed: 0.7, color: '178,145,255', alpha: 0.5, width: 1.9 },
        { offset: height * 0.18, amp: 20, freq: 0.016, speed: 1.1, color: '122,179,255', alpha: 0.45, width: 1.7 },
      ]

      waves.forEach((wave, index) => {
        ctx.beginPath()
        for (let x = -30; x <= width + 30; x += 3) {
          const y =
            height * 0.5 +
            wave.offset +
            Math.sin(x * wave.freq + t * wave.speed + index) * wave.amp +
            Math.sin(x * wave.freq * 0.45 + t * wave.speed * 1.6) * (wave.amp * 0.45) +
            (pointer.y - 0.5) * 24

          if (x === -30) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${wave.color}, ${wave.alpha})`
        ctx.lineWidth = wave.width
        ctx.shadowBlur = 18
        ctx.shadowColor = `rgba(${wave.color}, 0.45)`
        ctx.stroke()
      })

      ctx.shadowBlur = 0
      for (let i = 0; i < 36; i++) {
        const px = ((i * 127.1) % width + t * (i % 3 === 0 ? 6 : 3)) % width
        const py = ((i * 83.7) % height + Math.sin(t * 0.6 + i) * 8 + height) % height
        const size = 0.8 + (i % 3) * 0.5
        ctx.fillStyle = `rgba(255, 247, 235, ${0.18 + (Math.sin(t + i) + 1) * 0.12})`
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [canvasRef])

  return null
}

export default function FengShuiSection({ lang, content }) {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const shimmerRef = useRef(null)
  const textRef = useRef(null)
  const waveCanvasRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text slides in from left
      gsap.fromTo(textRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1, x: 0, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )

      // Card clip-path reveal + shimmer
      gsap.fromTo(cardRef.current,
        { opacity: 0, scale: 0.85, clipPath: 'inset(100% 0% 0% 0%)' },
        {
          opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.6, ease: 'expo.inOut',
          scrollTrigger: { trigger: cardRef.current, start: 'top 120%',
            onEnter: () => {
              gsap.fromTo(shimmerRef.current,
                { x: '-150%', skewX: -15 },
                { x: '250%', skewX: -15, duration: 2, ease: 'power2.inOut', delay: 0.6 }
              )
            },
          },
        }
      )
    }, sectionRef)

    // 3D Tilt on card
    const cleanTilt = attachTilt(cardRef.current, 12)

    return () => {
      ctx.revert()
      if (cleanTilt) cleanTilt()
    }
  }, [])

  const isCn = lang === 'cn'
  const fs = content.hobbies.fengshui

  return (
    <section id="fengshui" ref={sectionRef} className="section-base fengshui-section">
      <div className="fengshui-wavefield" aria-hidden="true">
        <canvas ref={waveCanvasRef} className="fengshui-wavefield-canvas" />
        <WaveFieldBackground canvasRef={waveCanvasRef} />
      </div>
      <div className="fengshui-wavefield-overlay" aria-hidden="true" />
      <div className="max-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}
          className="lg-grid">

          {/* Left — Certificate Card */}
          <div className="fengshui-media" style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              ref={cardRef}
              className="fengshui-cert-card"
              style={{
                opacity: 0,
                width: 'min(400px, 90vw)',
                aspectRatio: '3/4',
                clipPath: 'inset(100% 0% 0% 0%)',
              }}
            >
              {/* Shimmer sweep */}
              <div ref={shimmerRef} style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)',
                transform: 'translateX(-150%) skewX(-15deg)',
                pointerEvents: 'none', zIndex: 5,
              }} />

              <img
                src="/cert2.jpg"
                alt={isCn ? 'Alex Khoo 风水证书' : 'Alex Khoo Feng Shui certificate'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Corner decorations */}
              {[['top:1.5rem','left:1.5rem','borderTop','borderLeft'],
                ['top:1.5rem','right:1.5rem','borderTop','borderRight'],
                ['bottom:1.5rem','left:1.5rem','borderBottom','borderLeft'],
                ['bottom:1.5rem','right:1.5rem','borderBottom','borderRight']].map(([pos1, pos2, b1, b2], i) => {
                const style = {
                  position: 'absolute', width: '2rem', height: '2rem',
                  [b1]: '1px solid var(--gold-border-strong)',
                  [b2]: '1px solid var(--gold-border-strong)',
                }
                const [k1, v1] = pos1.split(':')
                const [k2, v2] = pos2.split(':')
                style[k1] = v1; style[k2] = v2
                return <div key={i} style={style} />
              })}
            </div>
          </div>

          {/* Right — Text */}
          <div ref={textRef} className="fengshui-text" style={{ opacity: 0 }}>
            <p className="text-label" style={{ marginBottom: '1.25rem', color: 'var(--gold)' }}>
              {isCn ? '爱好 · 风水' : 'Hobbies · Feng Shui'}
            </p>
            <h2 style={{
              fontFamily: isCn ? "'Noto Serif SC', serif" : 'var(--font-en-display)',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
              lineHeight: 1.0, letterSpacing: isCn ? '0' : '-0.04em',
              color: 'var(--white)', marginBottom: '1.5rem',
            }}>
              {isCn ? fs.title.cn : fs.title.en}
            </h2>
            <div style={{ width: '3rem', height: '2px', background: 'var(--gold)', marginBottom: '2rem' }} />
            <p style={{ color: 'var(--gray)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '46ch' }}>
              {isCn ? fs.desc.cn : fs.desc.en}
            </p>

            {/* Insight cards */}
            {[
              { icon: 'BL', title: isCn ? '平衡' : 'Balance', desc: isCn ? '阴阳调和，万物归正。' : 'Harmony in opposites.' },
              { icon: 'FL', title: isCn ? '流动' : 'Flow', desc: isCn ? '气之流转，即 UX 之核心。' : 'Movement is what makes UX feel natural.' },
              { icon: 'PX', title: isCn ? '精准' : 'Precision', desc: isCn ? '每一像素，皆有其意义。' : 'Every detail carries intention.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                padding: '1.25rem 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <div className="mark-badge mark-badge-gold">
                  <LineIcon name={item.icon} className="line-icon" aria-hidden="true" />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-en-display)', fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {item.title}
                  </p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 900px) {
          .lg-grid { grid-template-columns: 1fr !important; }
          .fengshui-text { order: 1; }
          .fengshui-media { order: 2; }
        }
      `}</style>
    </section>
  )
}
