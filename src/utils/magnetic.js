import { gsap } from 'gsap'

/**
 * Attach magnetic hover to element.
 * @param {HTMLElement} el – the magnetic element
 * @param {number} strength – 0–1 pull factor (default 0.35)
 */
export function attachMagnetic(el, strength = 0.35) {
  if (!el) return

  const onMove = (e) => {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
  }

  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}

/**
 * Attach 3D tilt effect to element.
 * @param {HTMLElement} el
 * @param {number} maxDeg – max rotation in degrees (default 12)
 */
export function attachTilt(el, maxDeg = 12) {
  if (!el) return

  const onMove = (e) => {
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 … 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    gsap.to(el, {
      rotationY: x * maxDeg * 2,
      rotationX: -y * maxDeg * 2,
      transformPerspective: 900,
      ease: 'power2.out',
      duration: 0.4,
    })
  }

  const onLeave = () => {
    gsap.to(el, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}
