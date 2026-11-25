import { FileText } from 'lucide-react'
import { valuationBreakdown } from '../data/content'
import { AnimatedNumber, GlassPanel, Reveal, SectionHeading } from './Common'
import { compactMoney, money } from '../lib/format'

const circumference = 2 * Math.PI * 84

export default function Valuation({ onRequestSource }: { onRequestSource: () => void }) {
  return (
    <section id="thesis" className="section section--thesis">
      <div className="shell">
        <Reveal>
          <div className="thesis-intro">
            <SectionHeading
              eyebrow="Готовый производственный контур"
              title={<em>Действующий актив.</em>}
            />
            <div className="thesis-note">
              <span className="live-dot" />
              <p>Оценка по итоговой ведомости 2026</p>
            </div>
          </div>
        </Reveal>

        <div className="valuation-layout">
          <Reveal className="valuation-main">
            <GlassPanel className="price-composition">
              <div className="panel-label">Структура оценки бизнеса</div>
              <div className="donut-wrap">
                <div className="valuation-orbit" aria-hidden="true"><i /><i /><i /></div>
                <svg className="price-donut" viewBox="0 0 220 220" role="img" aria-label="70 процентов — биоактивы, коллекторы, права и сети; 30 процентов — имущество по актам">
                  <circle cx="110" cy="110" r="84" className="donut-track" />
                  <circle
                    cx="110" cy="110" r="84"
                    className="donut-segment donut-segment--one"
                    style={{ '--dash': circumference * 0.7 } as React.CSSProperties}
                  />
                  <circle
                    cx="110" cy="110" r="84"
                    className="donut-segment donut-segment--two"
                    strokeDashoffset={-circumference * 0.7}
                    style={{ '--dash': circumference * 0.3 } as React.CSSProperties}
                  />
                </svg>
                <div className="donut-center"><strong><AnimatedNumber value={20} /></strong><span>млн ₽</span></div>
                <span className="orbit-value orbit-value--one">70 / 30</span>
              </div>
              <div className="donut-legend">
                <div><i className="legend-one" /><span>Биоактивы, коллекторы,<br />РВУ, территория и сети</span><strong>14 млн ₽</strong></div>
                <div><i className="legend-two" /><span>Имущество по актам<br />с учётом износа</span><strong>6 млн ₽</strong></div>
              </div>
            </GlassPanel>
          </Reveal>

          <Reveal className="valuation-side" delay={100}>
            <div className="valuation-quote">
              <span>Инвестиционная логика</span>
              <blockquote>Цена входа сопоставима с оценкой уже находящегося на коллекторах урожая и стоимостью воссоздания морской инфраструктуры.</blockquote>
              <p>В детальном списке первая часть оценки составляет 14,35 млн ₽ и округлена до 14 млн ₽. Вторая часть — итог по актам инвентаризации — представлена как 6 млн ₽.</p>
            </div>
            <button className="download-card" type="button" onClick={onRequestSource}>
              <FileText size={22} />
              <span><strong>Запросить исходную ведомость</strong><small>Оставьте контакты в короткой форме</small></span>
            </button>
          </Reveal>
        </div>

        <Reveal className="breakdown-block">
          <div className="breakdown-head">
            <h3>Из чего складываются 14,35 млн ₽</h3>
            <span>до округления · детализация источника</span>
          </div>
          <div className="bar-chart">
            {valuationBreakdown.map((item, index) => (
              <div className="bar-row" key={item.name}>
                <div className="bar-meta"><span><i>{String(index + 1).padStart(2, '0')}</i>{item.name}</span><strong>{compactMoney(item.value)}</strong></div>
                <div className="bar-track"><i style={{ '--bar-scale': item.value / 4_800_000, '--bar-color': item.color } as React.CSSProperties}><b /></i></div>
              </div>
            ))}
          </div>
          <div className="chart-total"><span>Детальный список</span><strong>{money(14_350_000)}</strong></div>
        </Reveal>
      </div>
    </section>
  )
}
