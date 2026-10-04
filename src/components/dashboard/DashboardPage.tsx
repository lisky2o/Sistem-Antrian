import { ArrowRight, Bell, CheckCircle2, Clock3, FileText, Maximize2, Monitor, Ticket } from 'lucide-react'
import type { QueueData, QueueTicket } from '../../types/queue'
import { countWaitingTickets } from '../../utils/queue'
import { StatCard } from '../shared/StatCard'
import { EmptyState } from '../shared/EmptyState'
import { CounterCard } from './CounterCard'
import { QueueRow } from './QueueRow'

type DashboardPageProps = {
  data: QueueData
  activeCounterCount: number
  waitingList: QueueTicket[]
  currentCall: (counterId: string) => QueueTicket | undefined
  onOpenKiosk: () => void
  onOpenTv: () => void
  onOpenOperator: () => void
}

export function DashboardPage({ data, activeCounterCount, waitingList, currentCall, onOpenKiosk, onOpenTv, onOpenOperator }: DashboardPageProps) {
  const calledCount = data.counters.filter((counter) => counter.active && currentCall(counter.id)).length
  const completedCount = data.tickets.filter((ticket) => ticket.status === 'done').length

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="live-dot" /> OPERASIONAL HARI INI</div>
          <h1>Ringkasan Antrian</h1>
          <p>Pantau alur pelayanan kantor pajak secara real-time.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-light" onClick={onOpenKiosk}><Ticket size={16} /> Ambil Antrian</button>
          <button className="button button-primary" onClick={onOpenTv}><Maximize2 size={16} /> Buka Layar TV</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={<Clock3 size={19} />} label="MENUNGGU" value={waitingList.length} detail="Pemohon dalam antrian" tone="blue" />
        <StatCard icon={<Bell size={19} />} label="SEDANG DIPANGGIL" value={calledCount} detail={`${activeCounterCount} loket aktif`} tone="gold" />
        <StatCard icon={<CheckCircle2 size={19} />} label="SELESAI DILAYANI" value={completedCount} detail="Hari ini" tone="green" />
        <StatCard icon={<Monitor size={19} />} label="LOKET BEROPERASI" value={`${activeCounterCount}/${data.counters.length}`} detail="Siap melayani" tone="teal" />
      </div>

      <section className="section-block">
        <div className="section-title-row">
          <div><h2>Status Loket</h2><p>Nomor antrian yang sedang dipanggil</p></div>
          <button className="text-button" onClick={onOpenOperator}>Kelola antrian <ArrowRight size={15} /></button>
        </div>
        <div className="counter-grid">
          {data.counters.map((counter) => <CounterCard key={counter.id} counter={counter} ticket={currentCall(counter.id)} data={data} />)}
        </div>
      </section>

      <div className="dashboard-lower">
        <section className="panel queue-panel">
          <div className="panel-heading">
            <div><h2>Antrian Berikutnya</h2><p>Urutan berdasarkan waktu kedatangan</p></div>
            <span className="pill pill-blue">{waitingList.length} pemohon</span>
          </div>
          {waitingList.length ? (
            <div className="queue-table">
              <div className="table-head"><span>NOMOR</span><span>JENIS LAYANAN</span><span>WAKTU</span><span>STATUS</span></div>
              {waitingList.slice(0, 5).map((ticket) => <QueueRow key={ticket.id} ticket={ticket} data={data} />)}
            </div>
          ) : <EmptyState text="Belum ada antrian menunggu." />}
        </section>

        <section className="panel services-panel">
          <div className="panel-heading">
            <div><h2>Jenis Layanan</h2><p>Antrian berdasarkan kategori</p></div>
            <FileText size={18} className="muted-icon" />
          </div>
          {data.services.map((service) => (
            <div className="service-row" key={service.id}>
              <div className={`service-icon ${service.color}`}><FileText size={16} /></div>
              <div className="service-info"><strong>{service.name}</strong><span>Nomor {service.prefix}</span></div>
              <div className="service-wait"><strong>{countWaitingTickets(data, service.id)}</strong><span>menunggu</span></div>
            </div>
          ))}
          <button className="announcement-card" onClick={onOpenTv}>
            <div className="announcement-icon"><Bell size={15} /></div>
            <span><strong>Pengumuman aktif</strong><small>Lihat pada layar TV</small></span>
            <ArrowRight size={15} />
          </button>
        </section>
      </div>
    </>
  )
}
