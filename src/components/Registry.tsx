import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileDown, Search, X } from 'lucide-react'
import { inventoryItems, type InventoryItem } from '../data/inventory'
import { Reveal, SectionHeading } from './Common'
import { money } from '../lib/format'

const PAGE_SIZE = 10
const categories = Array.from(new Set(inventoryItems.map((item) => item.category)))

function price(value: number | string | null, empty = '—') {
  if (typeof value === 'number') return money(value)
  if (typeof value === 'string' && value.trim()) return value
  return empty
}

export default function Registry({ query, setQuery, onRequestExport }: { query: string; setQuery: (value: string) => void; onRequestExport: () => void }) {
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const updateQuery = (value: string) => { setPage(1); setQuery(value) }
  const updateCategory = (value: string) => { setPage(1); setCategory(value) }

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ru-RU')
    return inventoryItems.filter((item) => {
      const inCategory = category === 'all' || item.category === category
      const haystack = `${item.name} ${item.category} ${item.note ?? ''} ${item.number ?? ''} ${item.sourceRow}`.toLocaleLowerCase('ru-RU')
      return inCategory && (!needle || haystack.includes(needle))
    })
  }, [category, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const assessedSum = filtered.reduce((sum, item) => sum + (typeof item.assessedPrice === 'number' ? item.assessedPrice : 0), 0)
  const newSum = filtered.reduce((sum, item) => sum + (typeof item.newPrice === 'number' ? item.newPrice : 0), 0)
  const unpriced = inventoryItems.filter((item) => item.newPrice === null && item.assessedPrice === null).length

  const changePage = (next: number) => {
    setPage(Math.max(1, Math.min(pageCount, next)))
    requestAnimationFrame(() => document.querySelector('.registry-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <section id="registry" className="section section--registry">
      <div className="registry-tide" aria-hidden="true">
        <svg viewBox="0 0 900 460" preserveAspectRatio="none"><path d="M-40 340C180 180 310 450 510 250C650 115 780 190 950 45" /><path d="M-50 390C190 235 330 490 535 295C690 150 800 235 960 90" /></svg>
        <i /><i /><i /><i />
      </div>
      <div className="shell shell--wide">
        <Reveal>
          <div className="registry-heading">
            <SectionHeading eyebrow="Digital data room" />
            <div className="registry-count"><strong>{inventoryItems.length}</strong><span>строк реестра<br />из исходного файла</span></div>
          </div>
        </Reveal>

        <Reveal className="registry-tools">
          <div className="search-field">
            <Search size={20} />
            <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Например: компрессор, катер, садки…" aria-label="Поиск по реестру имущества" />
            {query && <button type="button" onClick={() => updateQuery('')} aria-label="Очистить поиск"><X size={18} /></button>}
          </div>
          <button className="button button--ghost export-button" type="button" onClick={onRequestExport} disabled={filtered.length === 0}>
            <FileDown size={17} /> Запросить выборку · CSV
          </button>
        </Reveal>

        <div className="category-filter" aria-label="Фильтр по разделам">
          <button type="button" className={category === 'all' ? 'is-active' : ''} onClick={() => updateCategory('all')}>Все <span>{inventoryItems.length}</span></button>
          {categories.map((item) => (
            <button key={item} type="button" className={category === item ? 'is-active' : ''} onClick={() => updateCategory(item)}>
              {item} <span>{inventoryItems.filter((entry) => entry.category === item).length}</span>
            </button>
          ))}
        </div>

        <div className="registry-summary" aria-live="polite">
          <span>Найдено: <strong>{filtered.length}</strong></span>
          <span>Σ новых цен: <strong>{money(newSum)}</strong></span>
          <span>Σ указанных оценок: <strong>{money(assessedSum)}</strong></span>
          <span className="registry-page-size">На странице: <strong>{visible.length}</strong></span>
        </div>

        <div className="registry-table" role="table" aria-label="Реестр имущества" key={`${category}-${query}-${page}`}>
          <div className="registry-table-head" role="row">
            <span role="columnheader">Позиция</span><span role="columnheader">Кол-во</span><span role="columnheader">Цена нового</span><span role="columnheader">Износ</span><span role="columnheader">Оценка</span>
          </div>
          {visible.map((item: InventoryItem, index) => (
            <article className="registry-row" key={item.id} role="row" style={{ '--row-order': index } as React.CSSProperties}>
              <div className="registry-name" role="cell">
                <div className="registry-badges"><span>{item.category}</span>{item.number && <span>№ {item.number}</span>}</div>
                <h3>{item.name}</h3>
                <details className="registry-details">
                  <summary>Детали и источник</summary>
                  <div>
                    {item.note && <p>{item.note}</p>}
                    <small>Лист «акты инвентаризации» · строка {item.sourceRow}</small>
                  </div>
                </details>
              </div>
              <div className="registry-cell registry-quantity" role="cell"><span>Количество</span><strong>{item.quantity ?? '—'}</strong></div>
              <div className="registry-cell" role="cell"><span>Цена нового</span><strong>{price(item.newPrice)}</strong></div>
              <div className="registry-cell" role="cell"><span>Износ</span><strong>{item.wear === null ? '—' : `${item.wear}%`}</strong></div>
              <div className="registry-cell registry-assessed" role="cell"><span>Оценка</span><strong>{price(item.assessedPrice, 'Не оценено')}</strong></div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>Совпадений не найдено</h3><p>Измените запрос или вернитесь ко всем разделам.</p>
            <button className="button button--ghost" type="button" onClick={() => { updateQuery(''); updateCategory('all') }}>Сбросить фильтры</button>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="pagination">
            <button type="button" onClick={() => changePage(page - 1)} disabled={page === 1} aria-label="Предыдущая страница"><ChevronLeft size={19} /></button>
            <span>Страница <strong>{page}</strong> из {pageCount}</span>
            <button type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount} aria-label="Следующая страница"><ChevronRight size={19} /></button>
          </div>
        )}

        <div className="registry-footnote">
          <p>{unpriced} строк не имеют ни цены нового изделия, ни итоговой оценки. Они остаются в реестре как передаваемые позиции или уточняющие записи источника.</p>
          <p>Пустая цена не подменяется нулём. Суммы складывают только числовые значения текущей выборки и не заменяют итоговые округления ведомости.</p>
        </div>
      </div>
    </section>
  )
}
