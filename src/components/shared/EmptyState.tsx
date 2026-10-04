import { CheckCircle2 } from 'lucide-react'

type EmptyStateProps = {
  text: string
}

export function EmptyState({ text }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><CheckCircle2 size={21} /></div>
      <span>{text}</span>
    </div>
  )
}
