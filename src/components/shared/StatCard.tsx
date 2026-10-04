import type { ReactNode } from 'react'

type StatCardProps = {
  icon: ReactNode
  label: string
  value: string | number
  detail: string
  tone: string
}

export function StatCard({ icon, label, value, detail, tone }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
      <div className={`stat-accent ${tone}`} />
    </div>
  )
}
