import type { Order, OrderItem, OrderStatus, PaymentMethod } from '../types/order'

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

let nextItemId = 1

function item(productName: string, quantity: number, unitPrice: number): OrderItem {
  return { id: nextItemId++, productName, quantity, unitPrice, subtotal: quantity * unitPrice }
}

function order(
  id: number,
  customerName: string,
  deliveryAddress: string,
  status: OrderStatus,
  paymentMethod: PaymentMethod,
  items: OrderItem[],
  createdMinutesAgo: number,
  updatedMinutesAgo: number,
): Order {
  return {
    id,
    customerName,
    deliveryAddress,
    status,
    paymentMethod,
    items,
    total: items.reduce((sum, current) => sum + current.subtotal, 0),
    createdAt: minutesAgo(createdMinutesAgo),
    updatedAt: minutesAgo(updatedMinutesAgo),
  }
}

export const MOCK_ORDERS: Order[] = [
  order(1042, 'Maria Silva', 'Rua das Flores, 123 - Centro', 'RECEBIDO', 'PIX',
    [item('Pizza Margherita', 2, 45.9), item('Refrigerante 2L', 1, 12.5)], 3, 3),
  order(1041, 'João Souza', 'Av. Brasil, 500 - apto 32', 'RECEBIDO', 'CARTAO',
    [item('Hambúrguer artesanal', 1, 32), item('Batata frita', 1, 14)], 6, 6),
  order(1040, 'Carla Dias', 'Rua Verde, 10 - Jardim América', 'EM_PREPARO', 'CARTAO',
    [item('Combinado de sushi (20 peças)', 1, 79.9)], 18, 9),
  order(1039, 'Rafael Lima', 'Rua XV de Novembro, 845', 'EM_PREPARO', 'DINHEIRO',
    [item('Açaí 500ml', 2, 18.5), item('Granola extra', 2, 3)], 22, 14),
  order(1038, 'Ana Costa', 'Alameda Santos, 1200 - bloco B', 'EM_PREPARO', 'PIX',
    [item('Strogonoff de frango', 1, 36.9), item('Suco de laranja', 1, 9.9)], 95, 75),
  order(1037, 'Pedro Alves', 'Rua das Acácias, 45', 'SAIU_PARA_ENTREGA', 'DINHEIRO',
    [item('Pizza Calabresa', 1, 42.9), item('Pizza Quatro Queijos', 1, 48.9)], 41, 7),
  order(1036, 'Beatriz Rocha', 'Av. Paulista, 2000 - sala 81', 'SAIU_PARA_ENTREGA', 'CARTAO',
    [item('Salada Caesar', 1, 29.9)], 38, 12),
  order(1035, 'Lucas Martins', 'Rua Augusta, 300', 'ENTREGUE', 'PIX',
    [item('Pastel de carne', 3, 8), item('Caldo de cana 500ml', 2, 7)], 95, 52),
  order(1034, 'Fernanda Gomes', 'Rua Harmonia, 77 - casa 2', 'ENTREGUE', 'CARTAO',
    [item('Marmita fitness', 2, 27.5)], 130, 88),
  order(1033, 'Gustavo Ribeiro', 'Rua dos Pinheiros, 950', 'CANCELADO', 'DINHEIRO',
    [item('Lasanha à bolonhesa', 1, 39.9)], 70, 64),
]
