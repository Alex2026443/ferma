import { useState } from 'react'
import { ArrowRight, Zap, Droplets, Container } from 'lucide-react'
import { facilityHotspots } from '../data/content'
import { Reveal, SectionHeading } from './Common'

export default function Facility({ onOpenRegistry }: { onOpenRegistry: (query: string) => void }) {
  const [activeId, setActiveId] = useState(1)
  const active = facilityHotspots.find((spot) => spot.id === activeId)!

  return (
    <section id="base" className="section section--base">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Береговая производственная база"
            title={<>Семь модулей.<br /><em>Один рабочий организм.</em></>}
          />
        </Reveal>

        <Reveal className="facility-layout">
          <div className="facility-map">
            <img src="./media/shore-base.jpg" alt="Береговая база с семью интерактивными производственными модулями" loading="lazy" />
            <div className="facility-photo-wash" aria-hidden="true" />
            <svg className="network-overlay" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
              <path d="M460 198H540H720M460 198V300H440V409M440 409H550H660H800" />
              <path d="M540 180V250H550V409M720 180V300H660V409" />
              <path d="M440 350H800" className="network-secondary" />
            </svg>
            {facilityHotspots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                className={`map-hotspot ${activeId === spot.id ? 'is-active' : ''}`}
                style={{ top: spot.top, left: spot.left }}
                onClick={() => setActiveId(spot.id)}
                aria-label={`${spot.id}. ${spot.name}`}
                aria-pressed={activeId === spot.id}
              >
                <span>{spot.id}</span>
              </button>
            ))}
          </div>
          <aside className="facility-info" aria-live="polite">
            <div className="facility-index">0{active.id} / 07</div>
            <h3>{active.name}</h3>
            <p>{active.text}</p>
            <button className="button button--ghost" type="button" onClick={() => onOpenRegistry(active.query)}>
              Показать имущество <ArrowRight size={17} />
            </button>
          </aside>
        </Reveal>

        <div className="infrastructure-grid">
          <Reveal>
            <div className="infrastructure-item">
              <Droplets size={23} />
              <span>Водопровод</span><strong>100 000 ₽</strong>
              <p>Около 150 м трубы ПНД 25 мм под землёй, работа трактора, 2 насоса, 2 автоматики, гидроаккумулятор и комплектующие.</p>
            </div>
          </Reveal>
          <Reveal delay={70}>
            <div className="infrastructure-item">
              <Zap size={23} />
              <span>Электроснабжение</span><strong>200 000 ₽</strong>
              <p>380 В · 20 кВт · 4 пользователя. Бронированный кабель более 100 м в защитной трубе ПНД, траншея около 70 см, жила 32 мм², второй счётчик, СИП 24, электрощит, автоматы, защита и разводка.</p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="infrastructure-item">
              <Container size={23} />
              <span>Канализация</span><strong>50 000 ₽</strong>
              <p>Трубы, септик объёмом около 2 м³, работа трактора и монтаж. Водопровод, электричество и канализация включены в итоговую оценку отдельными строками.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
