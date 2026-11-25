import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { OysterDrawing } from './MarineMotif'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sceneRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduced) video.pause()
    else video.play().catch(() => {})
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      if (sceneRef.current) {
        const y = Math.min(window.scrollY, window.innerHeight)
        sceneRef.current.style.setProperty('--hero-shift', `${y * 0.16}px`)
        sceneRef.current.style.setProperty('--hero-fade', `${Math.max(0.25, 1 - y / window.innerHeight)}`)
      }
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  return (
    <section className="hero" ref={sceneRef} aria-label="Инвестиционная презентация фермы">
      <div className="hero-media" aria-hidden="true">
        <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster="./media/hero-poster.jpg">
          <source src="./media/hero-sunset.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <svg className="hero-currents" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-80 610C212 516 384 676 650 588C920 499 1122 504 1510 628" />
        <path d="M-100 654C188 565 411 720 681 632C963 541 1190 557 1530 675" />
        <path d="M-80 700C211 623 427 757 716 684C1001 612 1223 616 1510 714" />
      </svg>
      <div className="hero-depth" aria-hidden="true"><span>00</span><i /><span>06</span><i /><span>12</span><small>м</small></div>
      <div className="hero-specimen" aria-hidden="true">
        <OysterDrawing />
        <span>OSTREA · MYTILUS<br />BLACK SEA / 2026</span>
      </div>
      <div className="hero-content shell">
        <div className="hero-topline">
          <span>Малый Утриш · Чёрное море</span>
          <span>Investment pitch · Data room · 2026</span>
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">Действующая мидийно-устричная ферма</p>
          <p className="hero-intro">Инфраструктура, биологический актив, три рыбоводных участка и 15 лет клиентской базы — в одной прозрачной инвестиционной ведомости.</p>
        </div>
      </div>
    </section>
  )
}
