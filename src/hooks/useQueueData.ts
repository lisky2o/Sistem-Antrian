import { useEffect, useState } from 'react'
import type { QueueData } from '../types/queue'
import { createInitialQueueData, QUEUE_CHANNEL_NAME, QUEUE_STORAGE_KEY } from '../data/queueDefaults'

function loadQueueData(): QueueData {
  const defaults = createInitialQueueData()

  try {
    const saved = localStorage.getItem(QUEUE_STORAGE_KEY)
    if (!saved) return defaults

    const parsed = JSON.parse(saved) as Partial<QueueData>
    return {
      ...defaults,
      ...parsed,
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : defaults.tickets,
      counters: Array.isArray(parsed.counters) ? parsed.counters : defaults.counters,
      services: Array.isArray(parsed.services) ? parsed.services : defaults.services,
    }
  } catch {
    return defaults
  }
}

function isSameQueueData(first: QueueData, second: QueueData): boolean {
  return JSON.stringify(first) === JSON.stringify(second)
}

export function useQueueData() {
  const [data, setData] = useState<QueueData>(loadQueueData)

  useEffect(() => {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Aplikasi tetap berjalan apabila penyimpanan browser tidak tersedia.
    }

    try {
      const channel = new BroadcastChannel(QUEUE_CHANNEL_NAME)
      channel.postMessage(data)
      channel.close()
    } catch {
      // Perubahan tetap disimpan di localStorage untuk tab pada origin yang sama.
    }
  }, [data])

  useEffect(() => {
    const applyIncomingData = (incoming: QueueData) => {
      setData((current) => isSameQueueData(current, incoming) ? current : incoming)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== QUEUE_STORAGE_KEY || !event.newValue) return

      try {
        applyIncomingData(JSON.parse(event.newValue) as QueueData)
      } catch {
        // Abaikan data tab lain yang tidak valid.
      }
    }

    const channel = new BroadcastChannel(QUEUE_CHANNEL_NAME)
    channel.onmessage = (event: MessageEvent<QueueData>) => {
      const incoming = event.data
      if (incoming?.tickets && incoming?.counters && incoming?.services) {
        applyIncomingData(incoming)
      }
    }

    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      channel.close()
    }
  }, [])

  return { data, setData }
}
