import type { QueueCounter, QueueData, QueueService } from '../types/queue'

export const QUEUE_STORAGE_KEY = 'layanan-pajak-queue-v1'
export const QUEUE_CHANNEL_NAME = 'layanan-pajak-queue'

export const defaultServices: QueueService[] = [
  { id: 'umum', name: 'Pelayanan Umum', prefix: 'A', color: 'blue' },
  { id: 'konsultasi', name: 'Konsultasi', prefix: 'B', color: 'gold' },
  { id: 'pengaduan', name: 'Pengaduan', prefix: 'C', color: 'teal' },
]

export const defaultCounters: QueueCounter[] = [
  { id: 'loket-1', name: 'Loket 01', active: true },
  { id: 'loket-2', name: 'Loket 02', active: true },
  { id: 'loket-3', name: 'Loket 03', active: true },
  { id: 'loket-4', name: 'Loket 04', active: false },
]

export function createInitialQueueData(): QueueData {
  const now = Date.now()

  return {
    services: defaultServices,
    counters: defaultCounters,
    announcement: 'Mohon siapkan kartu identitas dan dokumen pendukung sebelum menuju loket.',
    soundEnabled: true,
    tickets: [
      { id: 'demo-1', number: 'A-001', serviceId: 'umum', createdAt: now - 600_000, status: 'called', counterId: 'loket-1', calledAt: now - 180_000 },
      { id: 'demo-2', number: 'B-001', serviceId: 'konsultasi', createdAt: now - 510_000, status: 'called', counterId: 'loket-2', calledAt: now - 90_000 },
      { id: 'demo-3', number: 'A-002', serviceId: 'umum', createdAt: now - 450_000, status: 'waiting' },
      { id: 'demo-4', number: 'C-001', serviceId: 'pengaduan', createdAt: now - 390_000, status: 'waiting' },
      { id: 'demo-5', number: 'A-003', serviceId: 'umum', createdAt: now - 300_000, status: 'waiting' },
      { id: 'demo-6', number: 'B-002', serviceId: 'konsultasi', createdAt: now - 240_000, status: 'waiting' },
      { id: 'demo-7', number: 'A-004', serviceId: 'umum', createdAt: now - 180_000, status: 'waiting' },
      { id: 'demo-8', number: 'C-002', serviceId: 'pengaduan', createdAt: now - 120_000, status: 'waiting' },
    ],
  }
}
