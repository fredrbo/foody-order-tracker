import type { Order, OrderStatus } from '../types/order'

type StatusConfig = {
  label: string
  dot: string
  badge: string
  column: string
}

export const ORDER_STATUSES: OrderStatus[] = ['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO']

export const DELIVERY_FLOW: OrderStatus[] = ['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE']

export const CANCELLABLE_STATUSES: OrderStatus[] = ['RECEBIDO', 'EM_PREPARO']

export const DELAY_THRESHOLD_MINUTES = 60

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  RECEBIDO: { label: 'Recebido', dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', column: 'bg-violet-50' },
  EM_PREPARO: { label: 'Em preparo', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', column: 'bg-amber-50' },
  SAIU_PARA_ENTREGA: { label: 'Saiu para entrega', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', column: 'bg-blue-50' },
  ENTREGUE: { label: 'Entregue', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', column: 'bg-emerald-50' },
  CANCELADO: { label: 'Cancelado', dot: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700', column: 'bg-rose-50' },
}

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  const index = DELIVERY_FLOW.indexOf(status)
  if (index === -1 || index === DELIVERY_FLOW.length - 1) return null
  return DELIVERY_FLOW[index + 1]
}

export function isDelayed(order: Order) {
  if (order.status === 'ENTREGUE' || order.status === 'CANCELADO') return false
  const minutesSinceCreation = (Date.now() - new Date(order.createdAt).getTime()) / 60_000
  return minutesSinceCreation > DELAY_THRESHOLD_MINUTES
}
