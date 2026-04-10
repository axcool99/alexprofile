import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// ── Basketball ──────────────────────────────
function Basketball({ mouse }) {
  const meshRef = useRef()
  const t = useRef(0)

  useFrame((state, delta) => {
    t.current += delta
    meshRef.current.rotation.x += 0.008
    meshRef.current.rotation.y += 0.012
    // Keep the bounce above the floor plane so it never clips through.
    const bounce = Math.abs(Math.sin(t.current * 1.9)) * 0.82
    meshRef.current.position.y = -0.8 + bounce
    // Mouse parallax
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x, mouse.current.x * 2, 0.05
    )
  })

  return (
    <mesh ref={meshRef} position={[-2, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#E87722" roughness={0.8} metalness={0.1} />
      {/* Seam lines via torus rings */}
      {[0, Math.PI / 2, Math.PI / 4].map((rot, i) => (
        <mesh key={i} rotation={[rot, 0, 0]}>
          <torusGeometry args={[1.01, 0.015, 8, 60]} />
          <meshStandardMaterial color="#1a0a00" roughness={1} />
        </mesh>
      ))}
    </mesh>
  )
}

function BallShadow() {
  const ref = useRef()

  useFrame((state) => {
    const bounce = Math.abs(Math.sin(state.clock.elapsedTime * 1.9)) * 0.82
    const squash = 1 - bounce * 0.28
    ref.current.scale.setScalar(1.1 + bounce * 0.18)
    ref.current.scale.y = squash
    ref.current.material.opacity = 0.28 - bounce * 0.12
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[-2, -1.79, 0]}>
      <circleGeometry args={[0.72, 48]} />
      <meshBasicMaterial color="#2a1204" transparent opacity={0.22} />
    </mesh>
  )
}

// ── Court Floor ──────────────────────────────
function CourtFloor({ floorColor }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = floorColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < 18; i++) {
      const x = (canvas.width / 18) * i
      ctx.fillStyle = i % 2 === 0 ? 'rgba(120, 74, 34, 0.2)' : 'rgba(255, 232, 196, 0.09)'
      ctx.fillRect(x, 0, canvas.width / 18, canvas.height)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1.2, 1.2)
    texture.anisotropy = 8
    texture.needsUpdate = true
    return texture
  }, [floorColor])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={texture} color="#efb578" roughness={0.54} metalness={0.05} />
    </mesh>
  )
}

// ── Court Markings Overlay ───────────────────
function CourtMarkings({ lineColor }) {
  const ref = useRef()
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 6
    ctx.globalAlpha = 0.92

    ctx.strokeRect(80, 80, w - 160, h - 160)

    ctx.beginPath()
    ctx.moveTo(w / 2, 80)
    ctx.lineTo(w / 2, h - 80)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 92, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeRect(80, h / 2 - 160, 170, 320)
    ctx.strokeRect(w - 250, h / 2 - 160, 170, 320)

    ctx.beginPath()
    ctx.arc(250, h / 2, 92, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(w - 250, h / 2, 92, Math.PI / 2, -Math.PI / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(250, h / 2, 230, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(w - 250, h / 2, 230, Math.PI / 2, -Math.PI / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(170, h / 2, 10, 0, Math.PI * 2)
    ctx.arc(w - 170, h / 2, 10, 0, Math.PI * 2)
    ctx.fillStyle = lineColor
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [lineColor])

  useFrame((state) => {
    ref.current.material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.79, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial map={texture} transparent opacity={0.82} />
    </mesh>
  )
}

function readSceneColors() {
  if (typeof window === 'undefined') {
    return {
      background: '#0A0A0A',
      fog: '#0A0A0A',
      floor: '#111111',
      grid: '#FF5C28',
      secondaryLight: '#ffffff',
    }
  }

  const styles = window.getComputedStyle(document.documentElement)
  return {
    background: styles.getPropertyValue('--scene-bg').trim() || '#0A0A0A',
    fog: styles.getPropertyValue('--scene-fog').trim() || '#0A0A0A',
    floor: styles.getPropertyValue('--scene-floor').trim() || '#111111',
    grid: styles.getPropertyValue('--scene-grid').trim() || '#FF5C28',
    secondaryLight: styles.getPropertyValue('--scene-secondary-light').trim() || '#ffffff',
  }
}

// ── Scene Wrapper ────────────────────────────
function Scene({ mouse, colors, showShadow }) {
  return (
    <>
      <color attach="background" args={[colors.background]} />
      <fog attach="fog" args={[colors.fog, 10, 25]} />
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={0.95} groundColor="#6d3412" color="#f7efe4" />
      <pointLight position={[5, 7, 4]} intensity={1.45} color="#ffbf8c" />
      <pointLight position={[-6, 4, -4]} intensity={0.85} color={colors.secondaryLight} />
      <spotLight position={[0, 9, 2]} angle={0.5} penumbra={0.9} intensity={1.65} color="#fff5e8" castShadow />
      <CourtFloor floorColor={colors.floor} />
      <CourtMarkings lineColor={colors.grid} />
      {showShadow && <BallShadow />}
      <Basketball mouse={mouse} />
    </>
  )
}

// ── Mouse tracker ────────────────────────────
function MouseTracker({ mouse }) {
  const { size } = useThree()
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1
      mouse.current.y = -(e.clientY / size.height) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [size])
  return null
}

// ── Main Component ───────────────────────────
export default function SportScene({ lang, content, theme }) {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const sceneColors = readSceneColors()
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const isCn = lang === 'cn'
  const sports = content.hobbies.sports

  return (
    <section id="sports" ref={sectionRef} className="sport-section" style={{ minHeight: '100vh', background: 'var(--scene-bg)' }}>
      <div className="sport-ambient-wash" aria-hidden="true" />
      {/* Three.js Canvas */}
      <div className="sport-canvas">
        <Canvas camera={{ position: [0, 1, 6], fov: 55 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
          <MouseTracker mouse={mouse} />
          <Scene key={theme} mouse={mouse} colors={sceneColors} showShadow={!isMobile} />
        </Canvas>
      </div>

      {/* Text Overlay */}
      <div ref={textRef} className="sport-content section-base" style={{ opacity: 0, width: '100%' }}>
        <div className="max-container">
          <p className="text-label" style={{ marginBottom: '1.25rem' }}>
            {isCn ? '爱好 · 运动' : 'Hobbies · Sports'}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-en-display)', fontWeight: 800,
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            lineHeight: 0.9, letterSpacing: '-0.04em',
            color: 'var(--white)', maxWidth: '14ch',
          }}>
            {isCn ? sports.title.cn : sports.title.en}
          </h2>
          <div className="accent-line" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
          <p style={{ color: 'var(--white)', maxWidth: '40ch', lineHeight: 1.7, fontSize: '1rem' }}>
            {isCn ? sports.desc.cn : sports.desc.en}
          </p>

          {/* Sport tags */}
          <div className="sport-tags">
            {['Basketball', 'Badminton', 'Pickleball'].map((tag) => (
              <span key={tag} className="sport-tag-wrap">
                <span className="sport-tag">{tag}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
