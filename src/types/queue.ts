export type QueueService = {
  id: string
  name: string
  prefix: string
  color: string
}

export type QueueCounter = {
  id: string
  name: string
  active: boolean
}

export type TicketStatus = 'waiting' | 'called' | 'done' | 'skipped'

export type QueueTicket = {
  id: string
  number: string
  serviceId: string
  createdAt: number
  status: TicketStatus
  counterId?: string
  calledAt?: number
}

export type QueueData = {
  tickets: QueueTicket[]
  counters: QueueCounter[]
  services: QueueService[]
  announcement: string
  soundEnabled: boolean
}

export type AppSection = 'overview' | 'operator' | 'settings'
