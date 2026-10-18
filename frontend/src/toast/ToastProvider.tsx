import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Toast, type ToastVariant } from '../components/ui/Toast'
import { ToastContext, type ToastApi } from './ToastContext'

const DURATION_MS = 4000

type ToastItem = {
  id: number
  variant: ToastVariant
  message: string
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, variant, message }])
      setTimeout(() => dismiss(id), DURATION_MS)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
    }),
    [show],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (container.matches(':popover-open')) container.hidePopover()
    if (toasts.length > 0) container.showPopover()
  }, [toasts.length])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        ref={containerRef}
        popover="manual"
        aria-live="polite"
        className="fixed inset-auto right-4 bottom-4 m-0 flex flex-col gap-2 overflow-visible border-0 bg-transparent p-0"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.variant} message={toast.message} onClose={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
