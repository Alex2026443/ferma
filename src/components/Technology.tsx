import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, FileVideo, Gift, Pause, Play } from 'lucide-react'
import { collectors, rvuSites } from '../data/content'
import { GlassPanel, Reveal, SectionHeading } from './Common'
import { SpecimenPair } from './MarineMotif'
import { compactMoney, money } from '../lib/format'
import { useReducedMotion } from '../hooks/use-reduced-motion'

const tabs = [
  { id: 'biology', label: 'Биоактив и учёт' },
  { id: 'installation', label: 'Монтаж коллекторов' },
  { id: 'transfer', label: 'Что передаётся' },
] as const

type TabId = typeof tabs[number]['id']
type Phase = 'forward' | 'reverse'

export default function Technology({ onRequestCollectors }: { onRequestCollectors: () => void }) {
  const [tab, setTab] = useState<TabId>('biology')
  const [nearVideo, setNearVideo] = useState(false)
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState<Phase>('forward')
  const [playing, setPlaying] = useState(false)
  const forwardRef = useRef<HTMLVideoElement>(null)
  const reverseRef = useRef<HTMLVideoElement>(null)
  const phaseRef = useRef<Phase>('forward')
  const reduced = useReducedMotion()

  useEffect(() => {
    const frame = document.getElementById('underwater-cinema')
    if (!frame) return
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
      if (entry.isIntersecting) setNearVideo(true)
    }, { rootMargin: '300px 0px' })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const forward = forwardRef.current
    const reverse = reverseRef.current
    if (!forward || !reverse) return
    if (!inView || reduced) {
      forward.pause()
      reverse.pause()
      return
    }
    const current = phaseRef.current === 'forward' ? forward : reverse
    current.play().catch(() => setPlaying(false))
  }, [inView, nearVideo, reduced])

  const switchPhase = () => {
    const nextPhase: Phase = phaseRef.current === 'forward' ? 'reverse' : 'forward'
    const next = nextPhase === 'forward' ? forwardRef.current : reverseRef.current
    phaseRef.current = nextPhase
    setPhase(nextPhase)
    if (next && inView) {
      next.currentTime = 0
      next.play().catch(() => setPlaying(false))
    }
  }

  const togglePlayback = () => {
    const current = phaseRef.current === 'forward' ? forwardRef.current : reverseRef.current
    if (!current) return
    if (current.paused) current.play().catch(() => setPlaying(false))
    else current.pause()
  }

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const index = tabs.findIndex((item) => item.id === tab)
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length
    setTab(tabs[next].id)
    document.getElementById(`tab-${tabs[next].id}`)?.focus()
  }

  return (
    <>
      <section id="marine" className="section section--marine">
        <div className="marine-contours" aria-hidden="true" />
        <div className="shell">
          <Reveal>
            <SectionHeading eyebrow="Морская акватория" />
          </Reveal>

          <Reveal className="underwater-frame" >
            <div id="underwater-cinema" className="underwater-cinema">
              <video
                ref={forwardRef}
                className={phase === 'forward' ? 'is-current' : ''}
                src={nearVideo ? './media/collector-underwater.mp4' : undefined}
                muted
                playsInline
                preload={nearVideo ? 'metadata' : 'none'}
                poster="./media/underwater-poster.jpg"
                aria-label="Подводная съёмка коллекторов фермы, прямое воспроизведение"
                onEnded={switchPhase}
                onPlay={() => {
                  if (phaseRef.current === 'forward') setPlaying(true)
                }}
                onPause={() => {
                  if (phaseRef.current === 'forward') setPlaying(false)
                }}
              />
              <video
                ref={reverseRef}
                className={phase === 'reverse' ? 'is-current' : ''}
                src={nearVideo ? './media/collector-underwater-reverse.mp4' : undefined}
                muted
                playsInline
                preload={nearVideo ? 'metadata' : 'none'}
                poster="./media/underwater-poster.jpg"
                aria-hidden="true"
                onEnded={switchPhase}
                onPlay={() => {
                  if (phaseRef.current === 'reverse') setPlaying(true)
                }}
                onPause={() => {
                  if (phaseRef.current === 'reverse') setPlaying(false)
                }}
              />
              <div className="water-sheen" aria-hidden="true" />
              <button className="video-playback" type="button" onClick={togglePlayback} aria-label={playing ? 'Поставить подводное видео на паузу' : 'Воспроизвести подводное видео'}>
                {playing ? <Pause size={19} /> : <Play size={19} />}
              </button>
              <div className="video-sequence" aria-hidden="true"><span>Прямой ход</span><i /><span>Обратный ход</span></div>
            </div>
          </Reveal>

          <Reveal className="collector-evidence">
            <figure className="collector-photo">
              <img src="./media/collector-underwater-photo.jpg" alt="Подвесные коллекторы мидийно-устричной фермы под водой" loading="lazy" />
              <figcaption><span>Коллекторная система · под водой</span><small>Фактическая съёмка акватории</small></figcaption>
            </figure>
            <div className="collector-evidence-copy">
              <p className="eyebrow">Не рендер. Рабочая акватория.</p>
              <h3>Загляните туда,<br />где растёт урожай.</h3>
              <p>Подвесные линии уходят в глубину, а коллекторы формируют единую производственную систему. На этом кадре — сама морская инфраструктура, без постановочных декораций.</p>
              <button className="button button--primary" type="button" onClick={onRequestCollectors}>
                <FileVideo size={18} /> Запросить полный видеообзор всех коллекторов
              </button>
            </div>
          </Reveal>

          <div className="collector-grid">
            {collectors.map((collector, index) => (
              <Reveal key={collector.name} delay={index * 90}>
                <GlassPanel className="collector-card">
                  <div className="collector-card-top"><span>0{index + 1}</span>{collector.price === null && <Gift size={18} />}</div>
                  <div className="collector-length" aria-hidden="true"><i /><span>{index === 0 ? '280' : index === 1 ? '340' : '150'} м</span><i /></div>
                  <h3>{collector.name}</h3>
                  <strong className="collector-price">{collector.price === null ? 'В подарок' : money(collector.price)}</strong>
                  <p className="collector-capacity">{collector.capacity}</p>
                  <p>{collector.detail}</p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>

          <Reveal className="technology-details">
            <div className="tabs" role="tablist" aria-label="Детали технологии" onKeyDown={onTabKeyDown}>
              {tabs.map((item) => (
                <button
                  id={`tab-${item.id}`}
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={tab === item.id ? 0 : -1}
                  onClick={() => setTab(item.id)}
                >{item.label}</button>
              ))}
            </div>
            <div className="tab-panel" id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
              {tab === 'biology' && (
                <div className="biology-tab">
                  <div className="tab-two-col">
                    <div><h3>Устрица</h3><p>Товарная и предтоварная устрица расположена на трёх коллекторах. После реализации 80% устриц с первого коллектора в сезоне 2026 года его комплектация садками снова составляет 100%. Текущее количество устриц превышает количество, проданное в 2026 году.</p></div>
                    <div><h3>Мидия</h3><p>Вес на коллекторе 280 м оценивался выборочно: мидии с двух метров центрального каната взвешены, вес разделён на 2 и умножен на 250. Аналогично взвешены мидии с двух буев и получен средний вес для всех буёв; затем учтены поперечные крепления, канаты пригрузов и промежуточных якорей.</p></div>
                  </div>
                  <SpecimenPair />
                </div>
              )}
              {tab === 'installation' && (
                <div className="tab-two-col">
                  <div><h3>5 млн ₽ · работы под ключ</h3><p>Оценка подводно-технической организации для коллекторов 280 м и 340 м: изготовление, доставка в Утриш и установка по схемам и координатам. В цену не входят сами коллекторы, буи и канаты на промежуточные якоря и пригрузы.</p></div>
                  <div><h3>Якорная система</h3><p>Мёртвые якоря 3,5 т — 2 шт. и 4,5 т — 1 шт.; клетки или иной груз из бетона/металла 600–700 кг — 12 шт.; пригрузы около 300 кг — 5 шт. и около 400 кг — 6 шт. Возможно более дешёвое самостоятельное изготовление; технологии передаются в составе актива.</p></div>
                </div>
              )}
              {tab === 'transfer' && (
                <div className="tab-two-col">
                  <div><h3>170 000 шт. молоди устрицы</h3><p>Завоз 2026 года оценён в 400 000 ₽: закупка, доставка из Москвы, культивация и работы по высадке на коллекторы. Отдельно учтены 40 садков с молодью устриц 2026 года.</p></div>
                  <div><h3>Дополнительный актив без цены</h3><p>Старый коллектор 150 м и молодь мидии на буях коллекторов 280 м и 340 м передаются в подарок. В реестре также сохранены неоценённые канаты, садки, материалы и оборудование.</p></div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal className="ras-feature">
            <div className="ras-video-shell">
              <video
                src="./media/ras-mussels.mp4"
                poster="./media/ras-mussels-poster.jpg"
                controls
                playsInline
                preload="none"
                aria-label="Мидии в контейнере УЗВ и оборудование берегового контура"
              />
              <div className="ras-video-meta" aria-hidden="true"><span>52 секунды</span><i />Съёмка в контейнере УЗВ</div>
            </div>
            <div className="ras-copy">
              <p className="eyebrow">УЗВ · береговая передержка</p>
              <h3>Свежесть,<br />которой можно управлять.</h3>
              <p className="ras-lead">После подъёма из моря мидия не оказывается на суше без воды — она попадает в рабочий береговой контур. На видео крупно показаны сами моллюски, ёмкость передержки и инженерное оборудование.</p>
              <div className="ras-benefits">
                <div><span>01</span><p><strong>Гибче отгрузка.</strong> Передержка помогает разделить момент сбора урожая и подготовку товарной партии.</p></div>
                <div><span>02</span><p><strong>Всё под контролем.</strong> Циркуляция и очистка воды объединены в один технологический контур.</p></div>
                <div><span>03</span><p><strong>Продукт в фокусе.</strong> Ролик показывает реальное содержимое контейнера, а не иллюстрацию оборудования.</p></div>
              </div>
              <small className="ras-note">УЗВ — возможность организации передержки и подготовки к отгрузке. Объёмы реализации и коммерческие результаты по видео не оцениваются.</small>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="rights" className="section section--rights">
        <div className="shell">
          <Reveal>
            <div className="rights-heading-row">
              <SectionHeading eyebrow="Правовой и береговой контур" />
              <div className="rvu-benchmark"><span>Ориентир нового РВУ на 25 лет</span><strong>≈ 500 000 ₽</strong><small>аукцион, формирование границ, согласования и сопутствующие расходы</small></div>
            </div>
          </Reveal>
          <div className="rvu-grid">
            {rvuSites.map((site, index) => (
              <Reveal key={site.name} delay={index * 80}>
                <GlassPanel className="rvu-card">
                  <div className="rvu-top"><span>РВУ</span><ArrowUpRight size={20} /></div>
                  <h3>{site.name}</h3>
                  <div className="rvu-years"><strong>{site.years}</strong><span>лет<br />остаток пользования</span></div>
                  <div className="years-track"><i style={{ transform: `scaleX(${site.years / 25})` }} /></div>
                  <p>{site.description}</p>
                  <strong className="rvu-value">{compactMoney(site.value)}</strong>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
          <Reveal className="rights-footnotes">
            <details>
              <summary>Как в источнике оценен новый участок</summary>
              <p>Около 100 000 ₽ — официальная часть аукциона; 300 000 ₽ — «Н О» (аббревиатура сохранена без расшифровки); ещё 100 000–150 000 ₽ — формирование границ, согласования, транспорт и прочие расходы. Средняя оценка нового РВУ на 25 лет — 500 000 ₽.</p>
            </details>
            <details>
              <summary>Территория лодочной станции</summary>
              <p>3 сотки; проект, постановление и договор с правом пролонгации на 5 или 10 лет. В итоговую оценку включено 500 000 ₽. В другой строке источника указана стоимость 1,5 млн ₽ при договоре на 5 лет — расхождение сохранено и требует уточнения.</p>
            </details>
            <details>
              <summary>Сверка стоимости трёх РВУ</summary>
              <p>400 000 + 460 000 + 200 000 = 1 060 000 ₽. В итоговой структуре цены стоимость трёх участков округлена до 1 000 000 ₽.</p>
            </details>
          </Reveal>
        </div>
      </section>
    </>
  )
}
