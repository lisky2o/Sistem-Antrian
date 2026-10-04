import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, CheckCircle2, Maximize2, Moon, Volume2, ShieldCheck } from 'lucide-react'
import type { QueueData, QueueTicket } from '../../types/queue'
import { speakQueueCall } from '../../utils/audio'
import { formatDate, formatTime } from '../../utils/formatters'
import { findService } from '../../utils/queue'

type TvDisplayProps = {
  data: QueueData
  now: Date
}

export function TvDisplay({ data, now }: TvDisplayProps) {
  const [fullscreen, setFullscreen] = useState(false)
  const seenCalls = useRef<Record<string, number> | null>(null)
  const calls = useMemo(() => data.counters
    .filter((counter) => counter.active)
    .map((counter) => ({
      counter,
      ticket: data.tickets
        .filter((ticket) => ticket.status === 'called' && ticket.counterId === counter.id)
        .sort((first, second) => (second.calledAt ?? 0) - (first.calledAt ?? 0))[0],
    })), [data])
  const waiting = data.tickets
    .filter((ticket) => ticket.status === 'waiting')
    .sort((first, second) => first.createdAt - second.createdAt)

  useEffect(() => {
    const activeCalls = data.tickets.filter((ticket) => ticket.status === 'called')
    if (seenCalls.current === null) {
      seenCalls.current = Object.fromEntries(activeCalls.map((ticket) => [ticket.id, ticket.calledAt ?? 0]))
      return
    }

    const changedCalls = activeCalls.filter((ticket) => seenCalls.current?.[ticket.id] !== (ticket.calledAt ?? 0))
    for (const ticket of activeCalls) seenCalls.current[ticket.id] = ticket.calledAt ?? 0
    const latestCall = changedCalls.sort((first, second) => (second.calledAt ?? 0) - (first.calledAt ?? 0))[0]
    if (!latestCall || !data.soundEnabled) return

    const counterName = data.counters.find((counter) => counter.id === latestCall.counterId)?.name ?? 'loket pelayanan'
    speakQueueCall(latestCall.number, counterName)
  }, [data])

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
      else await document.exitFullscreen()
    } catch {
      setFullscreen(false)
    }
  }

  const testVoice = () => speakQueueCall('A-123', 'Loket 01')
  const visibleCalls = calls.slice(0, 4)

  return (
    <div className="tv-page">
      <header className="tv-header">
        <div className="tv-brand"><div className="tv-brand-icon"><ShieldCheck size={26} /></div><div><span>KANTOR PELAYANAN PAJAK</span><strong>SISTEM ANTRIAN</strong></div></div>
        <div className="tv-live"><span className="live-dot" /> PELAYANAN BERLANGSUNG</div>
        <div className="tv-date"><strong>{formatTime(now.getTime())}</strong><span>{formatDate(now)}</span></div>
      </header>

      <main className="tv-main">
        <div className="tv-title">
          <div><div className="tv-eyebrow">INFORMASI PELAYANAN</div><h1>Nomor Antrian <em>Dipanggil</em></h1><p>Silakan menuju loket yang tertera pada layar.</p></div>
          <div className="tv-title-actions">
            <button className="tv-fullscreen" onClick={testVoice} title="Uji suara pengumuman"><Volume2 size={17} /> Tes Suara</button>
            <button className="tv-fullscreen" onClick={toggleFullscreen}><Maximize2 size={17} /> {fullscreen ? 'Keluar layar penuh' : 'Layar penuh'}</button>
          </div>
        </div>

        <section className="tv-call-grid">
          {visibleCalls.map(({ counter, ticket }) => <TvCallCard key={counter.id} counterName={counter.name} ticket={ticket} data={data} />)}
        </section>

        <section className="tv-bottom">
          <div className="tv-waiting">
            <div className="tv-section-heading">
              <div><span>DAFTAR TUNGGU</span><strong>Antrian Berikutnya</strong></div>
              <div className="tv-total"><b>{waiting.length}</b><span>MENUNGGU</span></div>
            </div>
            {waiting.length ? (
              <div className="tv-waiting-list">
                {waiting.slice(0, 6).map((ticket, index) => <div className="tv-waiting-item" key={ticket.id}><span className="tv-order">{String(index + 1).padStart(2, '0')}</span><strong>{ticket.number}</strong><span>{findService(data, ticket.serviceId)?.name}</span></div>)}
              </div>
            ) : <div className="tv-empty"><CheckCircle2 size={20} /> Tidak ada antrian yang menunggu</div>}
          </div>
          <div className="tv-notice">
            <div className="tv-notice-icon"><Bell size={20} /></div>
            <div><span>INFORMASI</span><p>{data.announcement || 'Terima kasih telah menunggu. Mohon perhatikan nomor antrian Anda.'}</p></div>
            <div className="tv-notice-decoration"><Moon size={40} /></div>
          </div>
        </section>
      </main>

      <footer className="tv-footer">
        <div><span className="live-dot" /> INFORMASI ANTRIAN DIPERBARUI OTOMATIS</div>
        <div><Volume2 size={15} /> MOHON PERHATIKAN PANGGILAN NOMOR ANDA</div>
        <span>{formatDate(now)}</span>
      </footer>
    </div>
  )
}

function TvCallCard({ counterName, ticket, data }: { counterName: string; ticket?: QueueTicket; data: QueueData }) {
  return (
    <div className={`tv-call-card ${ticket ? 'has-call' : ''}`}>
      <div className="tv-call-top"><span>{counterName}</span><span className="tv-call-status"><i />{ticket ? 'SILAKAN MENUJU' : 'MENUNGGU'}</span></div>
      <div className="tv-number">{ticket?.number ?? '— — —'}</div>
      <div className="tv-service-name">{ticket ? findService(data, ticket.serviceId)?.name : 'Loket siap melayani'}</div>
      {ticket && <div className="tv-call-time">Dipanggil pukul {formatTime(ticket.calledAt ?? ticket.createdAt)}</div>}
    </div>
  )
}
