import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GainsSection({ lang, content }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const activeKeyRef = useRef('G')
  const cardRefs = useRef([])
  const [activeKey, setActiveKey] = useState('G')
  const [showProgress, setShowProgress] = useState(false)

  const isCn = lang === 'cn'
  const { sectionTitle, items } = content.gains
  const activeIndex = Math.max(items.findIndex((item) => item.key === activeKey), 0)
  const active = items[activeIndex]

  useEffect(() => {
    activeKeyRef.current = activeKey
  }, [activeKey])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 981px)', () => {
        const totalScroll = Math.max(items.length - 1, 1) * window.innerHeight * 0.8

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top+=70',
          end: 'bottom top+=70',
          onToggle: (self) => setShowProgress(self.isActive),
        })

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: stageRef.current,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const travel = self.progress * Math.max(items.length - 1, 1)
            const nextIndex = Math.min(
              items.length - 1,
              Math.round(travel)
            )
            const nextKey = items[nextIndex].key

            cardRefs.current.forEach((card, index) => {
              if (!card) return

              const relative = index - travel
              const isCurrent = Math.abs(relative) < 0.001
              const hidden = relative < -1 || relative > 1
              let yPercent = 0
              let scale = 1
              let opacity = 1
              let brightness = 1

              if (hidden) {
                yPercent = relative > 0 ? 100 : 0
                scale = relative > 0 ? 1 : 0.92
                opacity = 0
                brightness = 0.45
              } else if (relative < 0) {
                const settled = 1 - Math.min(Math.abs(relative), 1)
                yPercent = 0
                scale = 0.92 + settled * 0.08
                opacity = 0.68 + settled * 0.32
                brightness = 0.72 + settled * 0.28
              } else {
                const reveal = 1 - Math.min(relative, 1)
                yPercent = relative * 100
                scale = 0.92 + reveal * 0.08
                opacity = 0.48 + reveal * 0.52
                brightness = 0.55 + reveal * 0.45
              }

              gsap.set(card, {
                yPercent,
                scale,
                opacity,
                filter: `brightness(${brightness})`,
              })

              card.style.pointerEvents = isCurrent ? 'auto' : 'none'
            })

            if (nextKey !== activeKeyRef.current) {
              activeKeyRef.current = nextKey
              setActiveKey(nextKey)
            }
          },
        })
      })

      mm.add('(max-width: 980px)', () => {
        setActiveKey(items[0].key)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top+=70',
          end: 'bottom top+=70',
          onToggle: (self) => setShowProgress(self.isActive),
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [items])

  return (
    <section
      id="gains"
      ref={sectionRef}
      className="gains-section"
      style={{ '--gains-steps': items.length }}
    >
      <div ref={stageRef} className="gains-stage">
        <div className={`gains-progress-rail ${showProgress ? 'active' : ''}`} aria-hidden="true">
          <span style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }} />
        </div>

        <div className="gains-board-shell max-container">
          <div className={`gains-board ${isCn ? 'gains-board-cn' : 'gains-board-en'}`}>
            <div className="gains-selector" aria-label={isCn ? '选择 GAINS 项目' : 'Select a GAINS item'}>
              {items.map((item, index) => {
                const selected = item.key === activeKey
                return (
                  <div
                    key={item.key}
                    className={`gains-letter ${selected ? 'active' : ''}`}
                    aria-current={selected ? 'true' : 'false'}
                  >
                    <span className="gains-letter-char">{item.key}</span>
                  </div>
                )
              })}
            </div>

            <div className="gains-orbit-viewport">
              <div className="gains-orbit-track">
                {items.map((item, itemIndex) => (
                  <article
                    key={`${lang}-${item.key}`}
                    ref={(el) => (cardRefs.current[itemIndex] = el)}
                    className={`gains-detail-shell gains-orbit-card ${itemIndex === activeIndex ? 'active' : ''}`}
                  >
                    <div className="gains-detail-meta">
                      <span className="gains-detail-step">{String(itemIndex + 1).padStart(2, '0')}</span>
                      <span className="gains-detail-divider" aria-hidden="true" />
                      <span className="gains-detail-label">{isCn ? item.name.cn : item.name.en}</span>
                    </div>

                    <div className="gains-detail">
                      <div className="gains-detail-kicker">
                        <span>{item.key}</span>
                        <span>{isCn ? item.name.cn : item.name.en}</span>
                      </div>

                      <div className="gains-point-list">
                        {item.points.map((point, index) => (
                          <div
                            key={`${item.key}-${index}`}
                            className="gains-point"
                          >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <p>{isCn ? point.cn : point.en}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
