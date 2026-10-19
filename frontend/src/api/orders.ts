import type { Order, OrderStatus } from '../types/order'
import { apiRequest } from './client'

export function fetchOrders() {
  return apiRequest<Order[]>('/api/orders')
}

export type NewOrder = {
  customerName: string
  deliveryAddress: string
  items: OrderItem[]
}

export type OrderItem = { 
  productName: string
  quantity: number;
  unitPrice: number
 }

export function createOrder(order: NewOrder) {
  return apiRequest<Order>('/api/orders', { method: 'POST', body: order })
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return apiRequest<Order>(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}
