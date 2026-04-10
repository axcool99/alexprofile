import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LineIcon from './LineIcon'

gsap.registerPlugin(ScrollTrigger)

// Position a node around a circle
function orbitPosition(index, total, radius) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

export default function NetworkSection({ lang, content }) {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const orbitRef = useRef(null)
  const nodeRefs = useRef([])
  const lineRefs = useRef([])
  const centerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Heading
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
        }
      )

      mm.add('(min-width: 1101px)', () => {
        // Center pulse
        gsap.fromTo(centerRef.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)',
            scrollTrigger: { trigger: orbitRef.current, start: 'top 75%' },
          }
        )

        // Lines draw in
        lineRefs.current.forEach((line, i) => {
          if (!line) return
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1, duration: 0.6, delay: 0.3 + i * 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: orbitRef.current, start: 'top 75%' },
            }
          )
        })

        // Nodes stagger in
        nodeRefs.current.forEach((node, i) => {
          if (!node) return
          gsap.fromTo(node,
            { opacity: 0, scale: 0 },
            {
              opacity: 1, scale: 1,
              duration: 0.7, delay: 0.5 + i * 0.1, ease: 'back.out(2)',
              scrollTrigger: { trigger: orbitRef.current, start: 'top 75%' },
            }
          )
        })

        // Slow orbit ring rotation
        gsap.to('.orbit-ring-anim', {
          rotation: 360, duration: 40, ease: 'none', repeat: -1,
        })
      })

      mm.add('(max-width: 1100px)', () => {
        const mobileCards = nodeRefs.current
          .map((node) => node?.querySelector('.orbit-node-card'))
          .filter(Boolean)

        gsap.fromTo(mobileCards,
          { opacity: 0, y: 42, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: 'expo.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: orbitRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const isCn = lang === 'cn'
  const { nodes, sectionTitle, desc } = content.network
  const RADIUS = 290

  return (
    <section id="network" ref={sectionRef} className="section-base" style={{ background: 'var(--bg)' }}>
      <div className="max-container">
        {/* Header */}
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: '5rem', opacity: 0 }}>
          <p className="text-label" style={{ marginBottom: '1rem' }}>
            {isCn ? '跨界连接' : 'Industries'}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-en-display)', fontWeight: 800,
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--white)',
            marginBottom: '1.25rem',
          }}>
            {isCn ? sectionTitle.cn : sectionTitle.en}
          </h2>
          <p style={{ color: 'var(--gray)', maxWidth: '55ch', margin: '0 auto', lineHeight: 1.7 }}>
            {isCn ? desc.cn : desc.en}
          </p>
        </div>

        {/* Orbit graph */}
        <div ref={orbitRef} className="network-stage">
          {/* Orbit rings */}
          <div
            className="orbit-ring orbit-ring-anim orbit-ring-lg"
            style={{ width: `${RADIUS * 2 + 180}px`, height: `${RADIUS * 2 + 180}px` }}
          />
          <div
            className="orbit-ring orbit-ring-md"
            style={{ width: `${RADIUS * 2 + 110}px`, height: `${RADIUS * 2 + 110}px` }}
          />
          <div
            className="orbit-ring orbit-ring-sm"
            style={{ width: `${RADIUS * 2 + 36}px`, height: `${RADIUS * 2 + 36}px` }}
          />

          {/* SVG for connection lines */}
          <svg
            className="network-lines"
            style={{
              width: `${RADIUS * 2 + 320}px`, height: `${RADIUS * 2 + 320}px`,
            }}
          >
            {nodes.map((node, i) => {
              const pos = orbitPosition(i, nodes.length, RADIUS)
              return (
                <line
                  key={node.id}
                  ref={(el) => (lineRefs.current[i] = el)}
                  x1={RADIUS + 160} y1={RADIUS + 160}
                  x2={RADIUS + 160 + pos.x} y2={RADIUS + 160 + pos.y}
                  stroke="var(--line-accent)" strokeWidth="1.2"
                  style={{ transformOrigin: `${RADIUS + 160}px ${RADIUS + 160}px`, transform: 'scaleX(0)' }}
                />
              )
            })}
          </svg>

          {/* Center "Alex" node */}
          <div ref={centerRef} className="network-hub-wrap" style={{ position: 'absolute', zIndex: 10, opacity: 0 }}>
            <div className="orbit-center network-hub" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-en-display)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>
                  Alex
                </div>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', opacity: 0.78, textTransform: 'uppercase' }}>
                  Digital Network
                </div>
              </div>
            </div>
          </div>

          {/* Orbit nodes */}
          {nodes.map((node, i) => {
            const pos = orbitPosition(i, nodes.length, RADIUS)
            return (
              <div
                key={node.id}
                ref={(el) => (nodeRefs.current[i] = el)}
                className="orbit-node"
                style={{
                  position: 'absolute',
                  left: '50%', top: '50%',
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                  opacity: 0,
                }}
              >
                <div className="orbit-node-card">
                  <div className="orbit-node-icon">
                    <LineIcon name={node.icon} className="line-icon" aria-hidden="true" />
                  </div>
                  <div className="orbit-node-label">
                    {isCn ? node.label.cn : node.label.en}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
