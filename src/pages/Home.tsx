import { useCallback, useEffect, useState } from 'react'
import { ArrowUp, Menu, Waves, X } from 'lucide-react'
import Hero from '../components/Hero'
import Valuation from '../components/Valuation'
import Technology from '../components/Technology'
import Facility from '../components/Facility'
import Registry from '../components/Registry'
import Methodology from '../components/Methodology'
import SourceRequestDialog, { type RequestTopic } from '../components/SourceRequestDialog'

const navigation = [
  { label: 'Тезис', href: '#thesis', id: 'thesis' },
  { label: 'Акватория', href: '#marine', id: 'marine' },
  { label: 'База', href: '#base', id: 'base' },
  { label: 'Реестр', href: '#registry', id: 'registry' },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [query, setQuery] = useState('')
  const [registryKey, setRegistryKey] = useState(0)
  const [requestTopic, setRequestTopic] = useState<RequestTopic | null>(null)
  const closeRequest = useCallback(() => setRequestTopic(null), [])

  useEffect(() => {
    document.body.classList.add('motion-ready')
    const onScroll = () => {
      setScrolled(window.scrollY > 32)
      const progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id)
      })
    }, { rootMargin: '-20% 0px -70% 0px' })
    navigation.forEach((item) => {
      const node = document.getElementById(item.id)
      if (node) observer.observe(node)
    })
    return () => {
      document.body.classList.remove('motion-ready')
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const openRegistry = (value: string) => {
    setQuery(value)
    setRegistryKey((key) => key + 1)
    requestAnimationFrame(() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <>
      <a className="skip-link" href="#thesis">Перейти к содержанию</a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="ocean-atmosphere" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-100 180 C240 20 440 360 760 160 S1260 40 1540 240" />
          <path d="M-120 300 C180 120 480 450 790 250 S1260 150 1560 350" />
          <path d="M-100 570 C240 400 420 690 760 520 S1260 410 1540 590" />
        </svg>
        <div className="marine-snow">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
      </div>

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="Малый Утриш — в начало">
          <Waves size={24} />
          <span><strong>УТРИШ</strong><small>MARICULTURE ASSET</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map((item) => <a key={item.id} className={active === item.id ? 'is-active' : ''} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-data-link" href="#registry">Data room <span>↗</span></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню" aria-expanded={menuOpen}><Menu size={23} /></button>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Навигация">
          <button className="menu-backdrop" type="button" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню" />
          <div className="mobile-menu-panel">
            <div className="mobile-menu-top"><span>Разделы презентации</span><button type="button" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню"><X size={24} /></button></div>
            <nav>
              {navigation.map((item, index) => <a key={item.id} href={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</a>)}
              <a href="#documents" onClick={() => setMenuOpen(false)}><span>05</span>Документы</a>
            </nav>
          </div>
        </div>
      )}

      <main id="top">
        <Hero />
        <Valuation onRequestSource={() => setRequestTopic('inventory')} />
        <Technology onRequestCollectors={() => setRequestTopic('collectors')} />
        <Facility onOpenRegistry={openRegistry} />
        <Registry key={registryKey} query={query} setQuery={setQuery} onRequestExport={() => setRequestTopic('registry')} />
        <Methodology onRequestDocuments={() => setRequestTopic('documents')} />
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div className="footer-brand"><Waves size={22} /><span>Малый Утриш<br /><small>Мидийно-устричная ферма · 2026</small></span></div>
          <p>Инвестиционная презентация и цифровая data room<br />по итоговой ведомости 2026.</p>
          <div className="footer-links"><a href="#documents">Документы</a><a href="#top" aria-label="Наверх"><ArrowUp size={18} /></a></div>
        </div>
      </footer>
      {requestTopic && <SourceRequestDialog topic={requestTopic} onClose={closeRequest} />}
    </>
  )
}
