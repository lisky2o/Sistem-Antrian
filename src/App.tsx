import { useEffect, useState } from 'react'
import { DashboardPage } from './components/dashboard/DashboardPage'
import { KioskPage } from './components/kiosk/KioskPage'
import { OperatorPage } from './components/operator/OperatorPage'
import { SettingsPage } from './components/settings/SettingsPage'
import { TvDisplay } from './components/tv/TvDisplay'
import { AppFooter } from './components/layout/AppFooter'
import { Sidebar } from './components/layout/Sidebar'
import { Toast } from './components/layout/Toast'
import { Topbar } from './components/layout/Topbar'
import { useClock } from './hooks/useClock'
import { useQueueData } from './hooks/useQueueData'
import type { AppSection } from './types/queue'
import { playCallChime, speakQueueCall } from './utils/audio'
import { createTicket, getCurrentCall, getWaitingTickets } from './utils/queue'
import { printTicket } from './utils/ticketPrint'
import './styles.css'

export default function App() {
  const { data, setData } = useQueueData()
  const now = useClock()
  const mode = new URLSearchParams(window.location.search).get('mode')
  const [section, setSection] = useState<AppSection>('overview')
  const [selectedCounter, setSelectedCounter] = useState('loket-1')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (data.counters.some((counter) => counter.id === selectedCounter && counter.active)) return
    const firstActiveCounter = data.counters.find((counter) => counter.active)
    if (firstActiveCounter) setSelectedCounter(firstActiveCounter.id)
  }, [data.counters, selectedCounter])

  useEffect(() => {
    if (!notice) return
    const timeoutId = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  const activeCounters = data.counters.filter((counter) => counter.active)
  const waitingList = getWaitingTickets(data)
  const selectedCall = getCurrentCall(data, selectedCounter)

  const openWindow = (target: 'tv' | 'kiosk') => {
    window.open(`${window.location.pathname}?mode=${target}`, '_blank', 'noopener,noreferrer')
  }

  const issueTicket = (serviceId: string) => {
    const ticket = createTicket(data, serviceId)
    setData((current) => ({ ...current, tickets: [...current.tickets, ticket] }))
    printTicket(ticket, data.services.find((service) => service.id === serviceId)?.name ?? 'Layanan')
    return ticket
  }

  const callNext = (repeat = false) => {
    if (repeat) {
      if (!selectedCall) {
        setNotice('Belum ada nomor aktif untuk dipanggil ulang.')
        return
      }
      const calledAt = Date.now()
      setData((current) => ({
        ...current,
        tickets: current.tickets.map((ticket) => ticket.id === selectedCall.id ? { ...ticket, calledAt } : ticket),
      }))
      if (data.soundEnabled) {
        playCallChime()
        const counterName = data.counters.find((counter) => counter.id === selectedCounter)?.name ?? selectedCounter
        speakQueueCall(selectedCall.number, counterName)
      }
      setNotice(`Nomor ${selectedCall.number} dipanggil ulang.`)
      return
    }

    const nextTicket = waitingList[0]
    if (!nextTicket) {
      setNotice('Tidak ada antrian yang menunggu.')
      return
    }

    const calledAt = Date.now()
    setData((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) => {
        if (ticket.id === nextTicket.id) return { ...ticket, status: 'called', counterId: selectedCounter, calledAt }
        if (ticket.status === 'called' && ticket.counterId === selectedCounter) return { ...ticket, status: 'done' }
        return ticket
      }),
    }))
    const counterName = data.counters.find((counter) => counter.id === selectedCounter)?.name ?? selectedCounter
    if (data.soundEnabled) {
      playCallChime()
      speakQueueCall(nextTicket.number, counterName)
    }
    setNotice(`${nextTicket.number} dipanggil ke ${counterName}.`)
  }

  const finishTicket = (ticketId: string, status: 'done' | 'skipped') => {
    setData((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) => ticket.id === ticketId ? { ...ticket, status } : ticket),
    }))
    setNotice(status === 'done' ? 'Antrian selesai dilayani.' : 'Antrian dilewati.')
  }

  const resetQueue = () => {
    if (!window.confirm('Hapus seluruh data antrian dan mulai kembali? Pengaturan layanan tetap dipertahankan.')) return
    setData((current) => ({ ...current, tickets: [] }))
    setNotice('Data antrian hari ini telah direset.')
  }

  if (mode === 'tv') return <TvDisplay data={data} now={now} />
  if (mode === 'kiosk') return <KioskPage data={data} now={now} onIssue={issueTicket} />

  return (
    <div className="app-shell">
      <Sidebar
        section={section}
        waitingCount={waitingList.length}
        onNavigate={setSection}
        onOpenTv={() => openWindow('tv')}
        onOpenKiosk={() => openWindow('kiosk')}
      />
      <main className="main-area">
        <Topbar
          section={section}
          now={now}
          soundEnabled={data.soundEnabled}
          onToggleSound={() => setData((current) => ({ ...current, soundEnabled: !current.soundEnabled }))}
        />
        {section === 'overview' && (
          <DashboardPage
            data={data}
            activeCounterCount={activeCounters.length}
            waitingList={waitingList}
            currentCall={(counterId) => getCurrentCall(data, counterId)}
            onOpenKiosk={() => openWindow('kiosk')}
            onOpenTv={() => openWindow('tv')}
            onOpenOperator={() => setSection('operator')}
          />
        )}
        {section === 'operator' && (
          <OperatorPage
            data={data}
            selectedCounter={selectedCounter}
            waitingList={waitingList}
            selectedCall={selectedCall}
            onSelectCounter={setSelectedCounter}
            onCallNext={() => callNext()}
            onRecall={() => callNext(true)}
            onFinish={finishTicket}
          />
        )}
        {section === 'settings' && <SettingsPage data={data} setData={setData} onReset={resetQueue} />}
        <AppFooter />
      </main>
      <Toast message={notice} onClose={() => setNotice('')} />
    </div>
  )
}
