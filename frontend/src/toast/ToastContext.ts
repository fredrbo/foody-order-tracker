import { createContext, useContext } from 'react'

export type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast precisa ser usado dentro de um ToastProvider.')
  return context
}
