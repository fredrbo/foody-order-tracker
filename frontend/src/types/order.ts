export type OrderStatus = 'RECEBIDO' | 'EM_PREPARO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'CANCELADO'

export type PaymentMethod = 'DINHEIRO' | 'CARTAO' | 'PIX'

export type OrderItem = {
  id: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type Order = {
  id: number
  customerName: string
  deliveryAddress: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  items: OrderItem[]
  total: number
  createdAt: string
  updatedAt: string
}
