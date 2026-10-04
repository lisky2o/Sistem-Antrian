import { Check, X } from 'lucide-react'

type ToastProps = {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null

  return (
    <div className="toast" role="status">
      <Check size={16} />
      {message}
      <button onClick={onClose} aria-label="Tutup"><X size={15} /></button>
    </div>
  )
}
