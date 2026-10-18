import type { Order, OrderStatus } from '../types/order'
import { apiRequest } from './client'

export function fetchOrders() {
  return apiRequest<Order[]>('/api/orders')
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return apiRequest<Order>(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}
