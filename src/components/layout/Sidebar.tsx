import { Activity, ArrowRight, Bell, Monitor, MoreHorizontal, Settings2, ShieldCheck, Ticket } from 'lucide-react'
import type { AppSection } from '../../types/queue'

type SidebarProps = {
  section: AppSection
  waitingCount: number
  onNavigate: (section: AppSection) => void
  onOpenTv: () => void
  onOpenKiosk: () => void
}

export function Sidebar({ section, waitingCount, onNavigate, onOpenTv, onOpenKiosk }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-lockup"><div className="brand-mark"><ShieldCheck size={23} /></div><div><strong>LAYANAN PAJAK</strong><span>SISTEM ANTRIAN</span></div></div>
      <div className="branch-label">KANTOR PELAYANAN</div>
      <div className="branch-name">KPP Pratama<br />Pelayanan Terpadu</div>
      <div className="sidebar-divider" />
      <div className="nav-caption">MENU UTAMA</div>
      <nav className="side-nav">
        <button className={section === 'overview' ? 'active' : ''} onClick={() => onNavigate('overview')}><Activity size={18} /> Ringkasan</button>
        <button className={section === 'operator' ? 'active' : ''} onClick={() => onNavigate('operator')}><Bell size={18} /> Panel Operator<span className="nav-count">{waitingCount}</span></button>
        <button onClick={onOpenTv}><Monitor size={18} /> Layar TV<ArrowRight className="nav-arrow" size={15} /></button>
        <button onClick={onOpenKiosk}><Ticket size={18} /> Ambil Antrian<ArrowRight className="nav-arrow" size={15} /></button>
        <button className={section === 'settings' ? 'active' : ''} onClick={() => onNavigate('settings')}><Settings2 size={18} /> Pengaturan</button>
      </nav>
      <div className="sidebar-bottom">
        <div className="connection"><span className="live-dot" /><span>Data tersimpan di perangkat</span></div>
        <div className="profile"><div className="avatar">OP</div><div><strong>Operator Layanan</strong><span>Administrator</span></div><MoreHorizontal size={18} /></div>
      </div>
    </aside>
  )
}
