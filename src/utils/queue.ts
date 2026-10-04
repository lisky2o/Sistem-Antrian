import type { QueueData, QueueService, QueueTicket } from '../types/queue'

export function findService(data: QueueData, serviceId: string): QueueService | undefined {
  return data.services.find((service) => service.id === serviceId)
}

export function countWaitingTickets(data: QueueData, serviceId?: string): number {
  return data.tickets.filter((ticket) => {
    return ticket.status === 'waiting' && (!serviceId || ticket.serviceId === serviceId)
  }).length
}

export function getWaitingTickets(data: QueueData): QueueTicket[] {
  return data.tickets
    .filter((ticket) => ticket.status === 'waiting')
    .sort((first, second) => first.createdAt - second.createdAt)
}

export function getCurrentCall(data: QueueData, counterId: string): QueueTicket | undefined {
  return data.tickets
    .filter((ticket) => ticket.status === 'called' && ticket.counterId === counterId)
    .sort((first, second) => (second.calledAt ?? 0) - (first.calledAt ?? 0))[0]
}

export function createTicket(data: QueueData, serviceId: string): QueueTicket {
  const prefix = findService(data, serviceId)?.prefix ?? 'A'
  const numberPattern = new RegExp(`^${prefix}-(\\d+)$`)
  const nextNumber = data.tickets.reduce((maximum, ticket) => {
    const match = ticket.number.match(numberPattern)
    return match ? Math.max(maximum, Number(match[1])) : maximum
  }, 0) + 1

  return {
    id: crypto.randomUUID(),
    number: `${prefix}-${String(nextNumber).padStart(3, '0')}`,
    serviceId,
    createdAt: Date.now(),
    status: 'waiting',
  }
}
