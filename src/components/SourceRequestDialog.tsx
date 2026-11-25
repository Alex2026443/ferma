import { useEffect, useRef, useState } from 'react'
import { Check, FileText, LoaderCircle, X } from 'lucide-react'
import { trpc } from '../providers/trpc'

export type RequestTopic = 'inventory' | 'collectors' | 'registry' | 'documents'

const topicContent = {
  inventory: {
    title: 'Запросить исходную ведомость',
    intro: 'Оставьте имя и удобный контакт. Заявка на исходную ведомость будет сохранена в базе для дальнейшей связи.',
    success: 'Заявка на исходную ведомость сохранена.',
  },
  collectors: {
    title: 'Запросить видеообзор коллекторов',
    intro: 'Оставьте имя и удобный контакт для получения полного видеообзора всех коллекторов фермы.',
    success: 'Заявка на полный видеообзор коллекторов сохранена.',
  },
  registry: {
    title: 'Запросить реестр в CSV',
    intro: 'Оставьте имя и удобный контакт для получения выгрузки реестра имущества в формате CSV.',
    success: 'Заявка на выгрузку реестра в CSV сохранена.',
  },
  documents: {
    title: 'Запросить полный пакет документов',
    intro: 'Оставьте контакты и укажите приоритетные материалы: ведомость, правовые документы, технические данные или медиа.',
    success: 'Заявка на полный пакет документов сохранена.',
  },
} as const

export default function SourceRequestDialog({ onClose, topic = 'inventory' }: { onClose: () => void; topic?: RequestTopic }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [requestId, setRequestId] = useState<number | null>(null)
  const createRequest = trpc.sourceRequests.create.useMutation()
  const apiCheck = trpc.ping.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })
  const backendUnavailable = apiCheck.isError
  const submitDisabled = createRequest.isPending || apiCheck.isPending || backendUnavailable
  const content = topicContent[topic]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    nameRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href]'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitDisabled) return
    const data = new FormData(event.currentTarget)
    createRequest.mutate({
      name: String(data.get('name') ?? ''),
      contact: String(data.get('contact') ?? ''),
      comment: String(data.get('comment') ?? ''),
      website: String(data.get('website') ?? ''),
      topic,
    }, {
      onSuccess: (result) => setRequestId(result.id),
    })
  }

  return (
    <div className="request-dialog" role="dialog" aria-modal="true" aria-labelledby="request-title">
      <button className="request-backdrop" type="button" onClick={onClose} aria-label="Закрыть форму запроса" />
      <div className="request-panel" ref={panelRef}>
        <button className="request-close" type="button" onClick={onClose} aria-label="Закрыть форму запроса"><X size={22} /></button>
        {requestId === null ? (
          <>
            <div className="request-symbol" aria-hidden="true"><FileText size={25} /></div>
            <p className="eyebrow">Digital data room</p>
            <h2 id="request-title">{content.title}</h2>
            <p className="request-intro">
              {backendUnavailable
                ? 'В этом статическом предпросмотре база заявок недоступна. Отправка отключена; интерфейс презентации доступен полностью.'
                : content.intro}
            </p>
            <form onSubmit={submit}>
              <label className="request-field">
                <span>Ваше имя</span>
                <input ref={nameRef} name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required placeholder="Как к вам обращаться" />
              </label>
              <label className="request-field">
                <span>Телефон или email</span>
                <input name="contact" type="text" autoComplete="email" minLength={5} maxLength={180} required placeholder="+7 ___ ___-__-__ или name@mail.ru" />
              </label>
              <label className="request-field">
                <span>Комментарий <small>необязательно</small></span>
                <textarea name="comment" rows={3} maxLength={1500} placeholder="Что важно уточнить по активу" />
              </label>
              <label className="request-consent">
                <input type="checkbox" required />
                <span>Согласен на использование контактов для ответа на этот запрос</span>
              </label>
              <label className="request-honeypot" aria-hidden="true">Сайт<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
              {createRequest.isError && <p className="request-error" role="alert">Не удалось сохранить заявку. Проверьте соединение и попробуйте ещё раз.</p>}
              <button className="button button--primary request-submit" type="submit" disabled={submitDisabled}>
                {createRequest.isPending || apiCheck.isPending ? <LoaderCircle className="spin" size={18} /> : <FileText size={18} />}
                {createRequest.isPending
                  ? 'Сохраняем заявку…'
                  : apiCheck.isPending
                    ? 'Проверяем соединение…'
                    : backendUnavailable
                      ? 'База заявок недоступна'
                      : 'Отправить запрос'}
              </button>
              <p className="request-disclosure">
                {backendUnavailable
                  ? 'Для сохранения заявок нужен серверный запуск проекта с подключённой базой данных.'
                  : 'Сохранение в базе заявок. Автоматические уведомления в Telegram и на почту пока не подключены.'}
              </p>
            </form>
          </>
        ) : (
          <div className="request-success" aria-live="polite">
            <div className="request-symbol" aria-hidden="true"><Check size={28} /></div>
            <p className="eyebrow">Заявка № {requestId}</p>
            <h2 id="request-title">Контакты сохранены</h2>
            <p>{content.success} Указанные контакты будут использованы для ответа.</p>
            <button className="button button--primary" type="button" onClick={onClose}>Вернуться к презентации</button>
          </div>
        )}
      </div>
    </div>
  )
}
