import { useState } from 'react'
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from 'lucide-react'
import type { QueueData, QueueTicket } from '../../types/queue'
import { formatDate, formatTime } from '../../utils/formatters'

type KioskPageProps = {
  data: QueueData
  now: Date
  onIssue: (serviceId: string) => QueueTicket
}

export function KioskPage({ data, now, onIssue }: KioskPageProps) {
  const [issuedNumber, setIssuedNumber] = useState('')

  const issueTicket = (serviceId: string) => {
    const ticket = onIssue(serviceId)
    setIssuedNumber(ticket.number)
  }

  return (
    <div className="kiosk-page">
      <header className="kiosk-header">
        <div className="brand-lockup"><div className="brand-mark"><ShieldCheck size={23} /></div><div><strong>LAYANAN PAJAK</strong><span>KANTOR PELAYANAN PAJAK</span></div></div>
        <div className="kiosk-clock"><strong>{formatTime(now.getTime())}</strong><span>{formatDate(now)}</span></div>
      </header>
      <main className="kiosk-main">
        <div className="kiosk-eyebrow"><span className="live-dot" /> SELAMAT DATANG</div>
        <h1>Silakan pilih<br /><em>jenis layanan</em></h1>
        <p>Tekan tombol layanan yang Anda tuju untuk mengambil nomor antrian.</p>
        <div className="kiosk-options">
          {data.services.map((service) => (
            <button className="kiosk-option" key={service.id} onClick={() => issueTicket(service.id)}>
              <span className={`kiosk-service-icon ${service.color}`}><FileText size={23} /></span>
              <span><strong>{service.name}</strong><small>Ambil nomor antrian {service.prefix}</small></span>
              <ArrowRight size={19} />
            </button>
          ))}
        </div>
        {issuedNumber && <div className="ticket-confirmation"><CheckCircle2 size={19} /><span>Nomor <strong>{issuedNumber}</strong> siap dicetak. Silakan ambil tiket Anda.</span></div>}
        <div className="kiosk-help"><ShieldCheck size={16} /> Mohon siapkan dokumen pendukung saat nomor Anda dipanggil.</div>
      </main>
      <footer className="kiosk-footer">KANTOR PELAYANAN PAJAK <span>•</span> PELAYANAN PRIMA, MUDAH, DAN TERPERCAYA</footer>
    </div>
  )
}
