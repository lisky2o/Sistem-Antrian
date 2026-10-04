import { Monitor } from 'lucide-react'
import type { QueueData, QueueCounter, QueueTicket } from '../../types/queue'
import { findService } from '../../utils/queue'
import { formatTime } from '../../utils/formatters'

type CounterCardProps = {
  counter: QueueCounter
  ticket?: QueueTicket
  data: QueueData
}

export function CounterCard({ counter, ticket, data }: CounterCardProps) {
  const service = ticket ? findService(data, ticket.serviceId) : undefined

  return (
    <div className={`counter-card ${ticket ? 'occupied' : ''}`}>
      <div className="counter-card-top">
        <div className="counter-icon"><Monitor size={17} /></div>
        <span className={counter.active ? 'status-active' : 'status-inactive'}>
          <i />{counter.active ? ticket ? 'Melayani' : 'Siap' : 'Tutup'}
        </span>
      </div>
      <span className="counter-name">{counter.name}</span>
      {ticket ? (
        <>
          <strong className="counter-number">{ticket.number}</strong>
          <span className="counter-service">{service?.name} · Dipanggil {formatTime(ticket.calledAt ?? ticket.createdAt)}</span>
        </>
      ) : (
        <div className="counter-idle">{counter.active ? 'Menunggu pemohon berikutnya' : 'Loket tidak beroperasi'}</div>
      )}
    </div>
  )
}
