import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const CODE_LINES = [
  'profile = {',
  "  focus: 'digital presence',",
  "  craft: 'user experience',",
  "  goal: 'brand perception'",
  '}',
]

export default function Preloader() {
  const rootRef = useRef(null)
  const progressRef = useRef(null)
  const [percent, setPercent] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const state = { value: 0 }

      gsap.timeline({
        onComplete: () => {
          setHidden(true)
        },
      })
        .to(state, {
          value: 100,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => {
            setPercent(Math.round(state.value))
          },
        }, 0)
        .to(progressRef.current, {
          width: '100%',
          duration: 2,
          ease: 'power2.inOut',
        }, 0)
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut',
          pointerEvents: 'none',
        }, '+=0.15')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  if (hidden) return null

  return (
    <div ref={rootRef} className="preloader-root" aria-hidden="true">
      <div className="preloader-content">
        <div className="preloader-code-text">
          {CODE_LINES.map((line, index) => (
            <span key={line} className="preloader-code-line" style={{ animationDelay: `${0.12 + index * 0.16}s` }}>
              {line}
            </span>
          ))}
        </div>

        <div className="preloader-spinner-wrapper">
          <div className="preloader-spinner" />
        </div>

        <div className="preloader-progress-wrapper">
          <div ref={progressRef} className="preloader-progress-bar" />
        </div>

        <div className="preloader-percentage">{percent}%</div>
      </div>
    </div>
  )
}
