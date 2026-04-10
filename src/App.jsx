import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

import content from '../content.json'
import NavBar from './components/NavBar'
import Preloader from './components/Preloader'
import IntroReveal from './components/IntroReveal'
import AboutSection from './components/AboutSection'
import SportScene from './components/SportScene'
import TravelSection from './components/TravelSection'
import FengShuiSection from './components/FengShuiSection'
import CareerTimeline from './components/CareerTimeline'
import NetworkSection from './components/NetworkSection'
import ReferralSection from './components/ReferralSection'
import SloganSection from './components/SloganSection'
import ClosingSection from './components/ClosingSection'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

export default function App() {
  const [lang, setLang] = useState('cn')
  const mainRef = useRef(null)

  // Language switch with GSAP fade
  const handleLangSwitch = (newLang) => {
    if (newLang === lang) return
    const el = mainRef.current
    gsap.to(el, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setLang(newLang)
        gsap.to(el, { opacity: 1, duration: 0.35, delay: 0.05 })
      },
    })
  }

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.style.colorScheme = 'dark'
  }, [])

  const introDelay = 2.2

  return (
    <>
      <Preloader />
      <NavBar
        lang={lang}
        setLang={handleLangSwitch}
        content={content}
        revealDelay={2.65}
      />
      <main ref={mainRef} id="main-content">
        <IntroReveal lang={lang} content={content} entryDelay={introDelay} />
        <AboutSection lang={lang} content={content} />
        <SportScene lang={lang} content={content} theme="dark" />
        <TravelSection lang={lang} content={content} />
        <FengShuiSection lang={lang} content={content} />
        <CareerTimeline lang={lang} content={content} />
        <NetworkSection lang={lang} content={content} />
        <ReferralSection lang={lang} content={content} />
        <SloganSection lang={lang} content={content} />
        <ClosingSection lang={lang} content={content} />
      </main>
    </>
  )
}
