import { Clock3, Volume2, VolumeX, Wifi } from 'lucide-react'
import type { AppSection } from '../../types/queue'
import { formatTime } from '../../utils/formatters'

type TopbarProps = {
  section: AppSection
  now: Date
  soundEnabled: boolean
  onToggleSound: () => void
}

const sectionLabels: Record<AppSection, string> = {
  overview: 'Ringkasan',
  operator: 'Panel Operator',
  settings: 'Pengaturan',
}

export function Topbar({ section, now, soundEnabled, onToggleSound }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="breadcrumb">Operasional <span>/</span> <b>{sectionLabels[section]}</b></div>
      <div className="topbar-tools">
        <div className="online-status"><Wifi size={15} /> Sistem aktif</div>
        <div className="date-chip"><Clock3 size={16} /><span>{formatTime(now.getTime())}</span></div>
        <button
          className="icon-button"
          aria-label="Aktifkan atau matikan suara panggilan di layar TV"
          title="Suara panggilan layar TV"
          onClick={onToggleSound}
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </div>
    </header>
  )
}
