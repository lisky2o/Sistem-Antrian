import type { QueueData, QueueTicket } from '../../types/queue'
import { findService } from '../../utils/queue'
import { formatTime } from '../../utils/formatters'

type QueueRowProps = {
  ticket: QueueTicket
  data: QueueData
}

export function QueueRow({ ticket, data }: QueueRowProps) {
  const service = findService(data, ticket.serviceId)

  return (
    <div className="table-row">
      <strong className={`queue-number ${service?.color ?? 'blue'}`}>{ticket.number}</strong>
      <span className="queue-service">{service?.name ?? 'Layanan'}</span>
      <span className="queue-time">{formatTime(ticket.createdAt)}</span>
      <span><i className="waiting-dot" /> Menunggu</span>
    </div>
  )
}
