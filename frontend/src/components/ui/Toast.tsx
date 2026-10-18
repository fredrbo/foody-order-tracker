import { CheckCircle2, X, XCircle } from 'lucide-react'

export type ToastVariant = 'success' | 'error'

type ToastProps = {
  variant: ToastVariant
  message: string
  onClose: () => void
}

const VARIANTS = {
  success: { icon: CheckCircle2, iconClass: 'text-emerald-500', accent: 'bg-emerald-500' },
  error: { icon: XCircle, iconClass: 'text-rose-500', accent: 'bg-rose-500' },
}

export function Toast({ variant, message, onClose }: ToastProps) {
  const { icon: Icon, iconClass, accent } = VARIANTS[variant]

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className="relative flex w-80 max-w-[calc(100vw-2rem)] animate-toast-in items-start gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white py-3 pr-3 pl-4 shadow-lg"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
      <Icon size={20} className={`mt-px shrink-0 ${iconClass}`} />
      <p className="flex-1 text-sm text-gray-700">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  )
}
