import { Bell, CheckCircle2, ChevronDown, Play, SkipForward, Volume2 } from 'lucide-react'
import type { QueueData, QueueTicket } from '../../types/queue'
import { findService } from '../../utils/queue'
import { formatTime } from '../../utils/formatters'
import { EmptyState } from '../shared/EmptyState'

type OperatorPageProps = {
  data: QueueData
  selectedCounter: string
  waitingList: QueueTicket[]
  selectedCall?: QueueTicket
  onSelectCounter: (counterId: string) => void
  onCallNext: () => void
  onRecall: () => void
  onFinish: (ticketId: string, status: 'done' | 'skipped') => void
}

export function OperatorPage({ data, selectedCounter, waitingList, selectedCall, onSelectCounter, onCallNext, onRecall, onFinish }: OperatorPageProps) {
  const activeCounters = data.counters.filter((counter) => counter.active)

  return (
    <div className="content-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="live-dot" /> MODE OPERATOR</div>
          <h1>Panel Operator</h1>
          <p>Panggil dan kelola antrian pemohon pada loket Anda.</p>
        </div>
        <div className="counter-select-wrap">
          <label htmlFor="counter-select">LOKET AKTIF</label>
          <div className="select-shell">
            <select id="counter-select" value={selectedCounter} onChange={(event) => onSelectCounter(event.target.value)}>
              {activeCounters.map((counter) => <option key={counter.id} value={counter.id}>{counter.name}</option>)}
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="operator-grid">
        <section className="panel current-panel">
          <div className="panel-heading">
            <div><h2>Sedang Dilayani</h2><p>{data.counters.find((counter) => counter.id === selectedCounter)?.name ?? 'Loket'}</p></div>
            <span className={selectedCall ? 'pill pill-green' : 'pill pill-neutral'}><i />{selectedCall ? 'Sedang dipanggil' : 'Loket tersedia'}</span>
          </div>
          {selectedCall ? (
            <div className="current-ticket">
              <span>NOMOR ANTRIAN</span>
              <strong>{selectedCall.number}</strong>
              <div>{findService(data, selectedCall.serviceId)?.name} <i /> Dipanggil {formatTime(selectedCall.calledAt ?? selectedCall.createdAt)}</div>
            </div>
          ) : (
            <div className="operator-empty">
              <div className="empty-icon"><Bell size={21} /></div>
              <strong>Belum ada pemohon dipanggil</strong>
              <span>Pilih “Panggil Berikutnya” untuk memulai pelayanan.</span>
            </div>
          )}
          <div className="operator-actions">
            <button className="button button-light" onClick={onRecall} disabled={!selectedCall}><Volume2 size={16} /> Panggil Ulang</button>
            <button className="button button-primary call-button" onClick={onCallNext}><Play size={16} fill="currentColor" /> Panggil Berikutnya</button>
          </div>
          {selectedCall && (
            <div className="finish-actions">
              <button onClick={() => onFinish(selectedCall.id, 'done')}><CheckCircle2 size={16} /> Selesaikan pelayanan</button>
              <button onClick={() => onFinish(selectedCall.id, 'skipped')}><SkipForward size={16} /> Lewati antrian</button>
            </div>
          )}
        </section>

        <section className="panel next-panel">
          <div className="panel-heading">
            <div><h2>Antrian Menunggu</h2><p>Pemohon dengan waktu kedatangan terlama</p></div>
            <span className="pill pill-blue">{waitingList.length}</span>
          </div>
          {waitingList.length ? (
            <div className="operator-queue">
              {waitingList.slice(0, 8).map((ticket, index) => (
                <div className="operator-queue-row" key={ticket.id}>
                  <span className="queue-position">{String(index + 1).padStart(2, '0')}</span>
                  <div><strong>{ticket.number}</strong><span>{findService(data, ticket.serviceId)?.name}</span></div>
                  <span className="queue-time">{formatTime(ticket.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState text="Semua antrian sudah dipanggil." />}
        </section>
      </div>
    </div>
  )
}
