import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../api/client'
import { fetchOrders } from '../api/orders'
import type { Order } from '../types/order'

const POLL_INTERVAL_MS = 10_000

type UseOrdersOptions = {
  onNewOrders: (orders: Order[]) => void
  onUnauthorized: () => void
}

export function useOrders({ onNewOrders, onUnauthorized }: UseOrdersOptions) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)

  const knownIds = useRef<Set<number> | null>(null)
  const callbacks = useRef({ onNewOrders, onUnauthorized })

  useEffect(() => {
    callbacks.current = { onNewOrders, onUnauthorized }
  })

  const load = useCallback(async () => {
    try {
      const data = await fetchOrders()

      // Na primeira carga só registra os pedidos existentes; os alertas são para os que chegarem depois
      if (knownIds.current) {
        const newOrders = data.filter((order) => !knownIds.current!.has(order.id))
        if (newOrders.length > 0) callbacks.current.onNewOrders(newOrders)
      }
      knownIds.current = new Set(data.map((order) => order.id))

      setOrders(data)
      setError(null)
      setLastUpdatedAt(new Date())
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        callbacks.current.onUnauthorized()
        return
      }
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os pedidos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    let running = false
    let timeoutId: ReturnType<typeof setTimeout>

    // A próxima busca só é agendada quando a atual termina, evitando requisições sobrepostas
    async function poll() {
      if (running) return
      running = true
      clearTimeout(timeoutId)
      await load()
      running = false
      if (active) timeoutId = setTimeout(poll, POLL_INTERVAL_MS)
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') void poll()
    }

    timeoutId = setTimeout(poll, 0)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      active = false
      clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [load])

  const addOrder = useCallback((order: Order) => {
    knownIds.current?.add(order.id)
    setOrders((current) => [order, ...current])
  }, [])

  return { orders, setOrders, addOrder, loading, error, lastUpdatedAt, reload: load }
}
