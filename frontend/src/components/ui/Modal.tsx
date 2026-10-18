import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'lg'
}

export function Modal({ open, onClose, title, children, footer, size = 'lg' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      className={`m-auto w-[calc(100%-2rem)] rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-xl
        backdrop:bg-gray-900/40 backdrop:backdrop-blur-[2px]
        ${size === 'sm' ? 'max-w-sm' : 'max-w-lg'}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-[65vh] overflow-y-auto px-6 py-5">{children}</div>

      {footer && <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">{footer}</div>}
    </dialog>
  )
}
