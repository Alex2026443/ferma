import { ArrowUpRight, FileText } from 'lucide-react'
import { Reveal } from './Common'

export default function Methodology({ onRequestDocuments }: { onRequestDocuments: () => void }) {
  return (
    <section id="documents" className="section section--documents">
      <div className="shell">
        <Reveal className="documents-cta">
          <div className="documents-symbol" aria-hidden="true"><FileText size={30} /></div>
          <div className="documents-copy">
            <p className="eyebrow">Следующий шаг · Data room</p>
            <h2>Готовы перейти<br /><em>к деталям актива?</em></h2>
            <p>Запросите исходную ведомость и полный пакет доступных материалов. В комментарии можно сразу указать, что важно проверить в первую очередь.</p>
          </div>
          <button className="button button--primary documents-button" type="button" onClick={onRequestDocuments}>
            Запросить полный пакет документов <ArrowUpRight size={19} />
          </button>
        </Reveal>
      </div>
    </section>
  )
}
