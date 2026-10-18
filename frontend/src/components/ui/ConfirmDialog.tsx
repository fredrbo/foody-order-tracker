import type { ReactNode } from 'react'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Modal } from './Modal'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconClass: 'bg-rose-50 text-rose-600',
    buttonClass: 'bg-rose-600 hover:bg-rose-700',
  },
  primary: {
    icon: ArrowRight,
    iconClass: 'bg-brand-50 text-brand-600',
    buttonClass: 'bg-brand-500 hover:bg-brand-600',
  },
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Voltar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { icon: Icon, iconClass, buttonClass } = VARIANTS[variant]

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${buttonClass}`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
          <Icon size={18} />
        </span>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
    </Modal>
  )
}
