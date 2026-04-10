import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LineIcon from './LineIcon'

gsap.registerPlugin(ScrollTrigger)

function TravelTile({ tile, lang, onOpenImage }) {
  const isCn = lang === 'cn'
  const title = isCn ? tile.title.cn : tile.title.en
  const subtitle = isCn ? tile.subtitle.cn : tile.subtitle.en

  return (
    <div
      className={`travel-orbit-card ${tile.variant || ''} ${tile.type === 'image' ? 'travel-orbit-card-clickable' : ''}`}
      onClick={tile.type === 'image' ? () => onOpenImage?.(tile) : undefined}
      role={tile.type === 'image' ? 'button' : undefined}
      tabIndex={tile.type === 'image' ? 0 : undefined}
      onKeyDown={tile.type === 'image' ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenImage?.(tile)
        }
      } : undefined}
      aria-label={tile.type === 'image' ? `${title} ${isCn ? '大图预览' : 'full image view'}` : undefined}
    >
      {tile.type === 'video' && (
        <video
          className="travel-orbit-media"
          src={tile.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={title}
        />
      )}
      {tile.type === 'image' && (
        <img
          className="travel-orbit-media"
          src={tile.src}
          alt={title}
          style={tile.objectPosition ? { objectPosition: tile.objectPosition } : undefined}
        />
      )}
      {tile.type === 'panel' && (
        <div className="travel-orbit-panel">
          <div className="travel-orbit-panel-icon">
            <LineIcon name={tile.icon} className="line-icon" aria-hidden="true" />
          </div>
          <p className="travel-orbit-panel-copy">{subtitle}</p>
        </div>
      )}

      <div className="travel-orbit-meta">
        <span className="travel-orbit-kicker">{subtitle}</span>
        <span className="travel-orbit-title">{title}</span>
      </div>
    </div>
  )
}

export default function TravelSection({ lang, content }) {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const stickyRef = useRef(null)
  const scalerRef = useRef(null)
  const mobileGalleryRef = useRef(null)
  const layerRefs = useRef([])
  const tileRefs = useRef([])
  const [activeImage, setActiveImage] = useState(null)

  const travel = content.hobbies.travel
  const isCn = lang === 'cn'

  const outerTiles = useMemo(() => ([
    {
      id: 'north',
      type: 'image',
      src: '/travel/northernlight1.jpg',
      title: { en: 'Scenic Views', cn: '旅途风景' },
      subtitle: { en: 'Northern Light', cn: '极光时刻' },
      objectPosition: 'center center',
    },
    {
      id: 'city-video',
      type: 'image',
      src: '/travel/bergen.web.jpg',
      title: { en: 'City Exploration', cn: '城市探索' },
      subtitle: { en: 'Bergen Streets', cn: '卑尔根街景' },
    },
    {
      id: 'qatar',
      type: 'image',
      src: '/travel/qatar.web.jpg',
      title: { en: 'Culinary Adventure', cn: '美食之旅' },
      subtitle: { en: 'Qatar Stopover', cn: '卡塔尔旅程' },
      objectPosition: 'center center',
    },
    {
      id: 'wildlife',
      type: 'image',
      src: '/travel/kangarooparkvisitwithryan-69cfe8e2f1dd0.jpeg',
      title: { en: 'Nature & Wildlife', cn: '自然与野生' },
      subtitle: { en: 'With Ryan', cn: '和 Ryan 一起' },
      objectPosition: 'center center',
    },
  ]), [])

  const innerTiles = useMemo(() => ([
    {
      id: 'boat',
      type: 'image',
      src: '/travel/boat.web.jpg',
      title: { en: 'Sailing Beyond', cn: '更广的视野' },
      subtitle: { en: 'Fjord Escape', cn: '峡湾之旅' },
      objectPosition: 'center center',
    },
    {
      id: 'culture',
      type: 'image',
      src: '/travel/hong-kong-madame-tussauds-bruce-lee-wax.web.jpg',
      title: { en: 'Cultural Experience', cn: '文化体验' },
      subtitle: { en: 'Hong Kong Moments', cn: '香港时刻' },
      objectPosition: 'center center',
    },
  ]), [])
  const mobileTiles = useMemo(() => [...outerTiles, ...innerTiles], [outerTiles, innerTiles])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      if (scalerRef.current) {
        gsap.set(scalerRef.current, { transformOrigin: 'center center', willChange: 'transform, border-radius' })
      }

      gsap.fromTo(headRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
        }
      )

      mm.add('(min-width: 1025px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        })

        tl.fromTo(
          scalerRef.current,
          {
            scale: 3.8,
            borderRadius: '0rem',
            filter: 'brightness(1.08) saturate(1.12)',
          },
          {
            scale: 1,
            borderRadius: '1.6rem',
            filter: 'brightness(1) saturate(1)',
            ease: 'power3.inOut',
            duration: 0.54,
          },
          0
        )

        layerRefs.current.forEach((layer, index) => {
          if (!layer) return
          tl.fromTo(
            layer,
            { opacity: 0, scale: 0.58, y: 40 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              ease: index === 0 ? 'power2.out' : 'power4.out',
              duration: 0.5,
            },
            index === 0 ? 0.1 : 0.16
          )
        })
      })

      mm.add('(max-width: 1024px)', () => {
        const scalerMedia = scalerRef.current?.querySelector('.travel-scaler-media')
        const scalerOverlay = scalerRef.current?.querySelector('.travel-scaler-overlay')
        const mobileGallery = mobileGalleryRef.current
        const mobileCards = mobileGallery?.querySelectorAll('.travel-orbit-card') || []
        const mobileMedia = mobileGallery?.querySelectorAll('.travel-orbit-media') || []
        const mobileMeta = mobileGallery?.querySelectorAll('.travel-orbit-meta') || []

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=35%',
            scrub: 1.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo(
          scalerRef.current,
          {
            scale: 1,
            y: 0,
            minHeight: '62vh',
            width: '100%',
            maxWidth: '100%',
            borderRadius: '1.75rem',
            filter: 'brightness(1.02) saturate(1.04)',
          },
          {
            scale: 0.8,
            y: -10,
            minHeight: '18rem',
            height: '18rem',
            width: '18rem',
            maxWidth: '18rem',
            borderRadius: '1.15rem',
            filter: 'brightness(1) saturate(1)',
            ease: 'none',
            duration: 0.78,
          }
        , 0)

        if (scalerMedia) {
          tl.fromTo(
            scalerMedia,
            { scale: 1.02, yPercent: 0 },
            {
              scale: 1.12,
              yPercent: -4,
              ease: 'none',
              duration: 0.5,
            }
          , 0)
        }

        if (scalerOverlay) {
          tl.fromTo(
            scalerOverlay,
            { opacity: 1, y: 0 },
            {
              opacity: 0.72,
              y: -8,
              ease: 'none',
              duration: 0.35,
            }
          , 0)
        }

        tl.fromTo(
          mobileGallery,
          {
            opacity: 0.22,
            y: -180,
            scale: 0.94,
            clipPath: 'inset(0 0 100% 0 round 1.35rem)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: 'inset(0 0 0% 0 round 1.35rem)',
            ease: 'none',
            duration: 0.56,
          },
          0.2
        )

        tl.fromTo(
          mobileCards,
          { opacity: 0, y: -54, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'none',
            stagger: 0.045,
            duration: 0.38,
          },
          0.26
        )

        tl.fromTo(
          mobileMedia,
          { scale: 1.14 },
          {
            scale: 1,
            ease: 'none',
            stagger: 0.03,
            duration: 0.4,
          },
          0.28
        )

        tl.fromTo(
          mobileMeta,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            stagger: 0.03,
            duration: 0.26,
          },
          0.32
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!activeImage) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveImage(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeImage])

  const openImage = (tile) => {
    const title = isCn ? tile.title.cn : tile.title.en
    const subtitle = isCn ? tile.subtitle.cn : tile.subtitle.en
    setActiveImage({
      src: tile.src,
      title,
      subtitle,
      objectPosition: tile.objectPosition,
    })
  }

  return (
    <section id="travel" ref={sectionRef} className="travel-scroll-section">
      <div className="max-container">
        <div ref={headRef} className="travel-scroll-head" style={{ opacity: 0 }}>
          <p className="text-label" style={{ marginBottom: '1rem' }}>
            {isCn ? '爱好 · 旅行' : 'Hobbies · Travel'}
          </p>
          <h2 className="travel-scroll-title">
            {isCn ? travel.title.cn : travel.title.en}
          </h2>
          <div className="accent-line" style={{ marginTop: '1.5rem' }} />
          <p className="travel-scroll-desc">
            {isCn ? travel.desc.cn : travel.desc.en}
          </p>
        </div>
      </div>

      <div className="travel-scroll-stage">
        <div ref={stickyRef} className="travel-scroll-sticky">
          <div className="travel-scroll-grid">
            <div
              ref={(el) => (layerRefs.current[0] = el)}
              className="travel-scroll-layer travel-scroll-layer-outer"
            >
              {outerTiles.map((tile, index) => (
                <div
                  key={tile.id}
                  ref={(el) => (tileRefs.current[index] = el)}
                  className={`travel-slot travel-slot-${index + 1}`}
                >
                  <TravelTile tile={tile} lang={lang} onOpenImage={openImage} />
                </div>
              ))}
            </div>

            <div
              ref={(el) => (layerRefs.current[1] = el)}
              className="travel-scroll-layer travel-scroll-layer-inner"
            >
              {innerTiles.map((tile, index) => (
                <div
                  key={tile.id}
                  ref={(el) => (tileRefs.current[outerTiles.length + index] = el)}
                  className={`travel-slot travel-slot-inner-${index + 1}`}
                >
                  <TravelTile tile={tile} lang={lang} onOpenImage={openImage} />
                </div>
              ))}
            </div>

            <div ref={scalerRef} className="travel-scaler">
              <video
                className="travel-scaler-media"
                src="/scenic_view.web.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={isCn ? '旅途风景视频' : 'Scenic travel video'}
              />
              <div className="travel-scaler-overlay">
                <span className="travel-scaler-kicker">
                  {isCn ? '旅途风景' : 'Scenic Views'}
                </span>
                <h3 className="travel-scaler-heading">
                  {isCn ? '让视野慢慢展开' : 'Let The Horizon Open Up'}
                </h3>
              </div>
            </div>

            <div ref={mobileGalleryRef} className="travel-mobile-gallery">
              {mobileTiles.map((tile) => (
                <div key={`mobile-${tile.id}`} className="travel-mobile-tile">
                  <TravelTile tile={tile} lang={lang} onOpenImage={openImage} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeImage && (
        <div
          className="travel-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            className="travel-lightbox-close"
            onClick={() => setActiveImage(null)}
            aria-label={isCn ? '关闭大图' : 'Close full image'}
          >
            ×
          </button>
          <div
            className="travel-lightbox-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="travel-lightbox-image"
              src={activeImage.src}
              alt={activeImage.title}
              style={activeImage.objectPosition ? { objectPosition: activeImage.objectPosition } : undefined}
            />
            <div className="travel-lightbox-meta">
              <span className="travel-lightbox-kicker">{activeImage.subtitle}</span>
              <h3 className="travel-lightbox-title">{activeImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
