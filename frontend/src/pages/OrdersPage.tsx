import { useState } from 'react'
import { Header } from '../components/Header'
import { StatusColumn } from '../components/orders/StatusColumn'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ORDER_STATUSES, STATUS_CONFIG, getNextStatus } from '../constants/orderStatus'
import { MOCK_ORDERS } from '../mocks/orders'
import { useToast } from '../toast/ToastContext'
import type { Order, OrderStatus } from '../types/order'

type OrdersPageProps = {
  onLogout: () => void
}

function byOldestFirst(a: Order, b: Order) {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
}

export function OrdersPage({ onLogout }: OrdersPageProps) {
  const toast = useToast()
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)

  const inProgress = orders.filter((order) => order.status !== 'ENTREGUE' && order.status !== 'CANCELADO').length

  function updateStatus(orderId: number, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order,
      ),
    )
  }

  function handleAdvance(order: Order) {
    const nextStatus = getNextStatus(order.status)
    if (!nextStatus) return

    updateStatus(order.id, nextStatus)
    toast.success(`Pedido #${order.id} avançou para ${STATUS_CONFIG[nextStatus].label}.`)
  }

  function handleConfirmCancel() {
    if (!orderToCancel) return

    updateStatus(orderToCancel.id, 'CANCELADO')
    setOrderToCancel(null)
    toast.success(`Pedido #${orderToCancel.id} cancelado.`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onLogout={onLogout} />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length} pedidos · {inProgress} em andamento
          </p>
        </div>

        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0">
          {ORDER_STATUSES.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              orders={orders.filter((order) => order.status === status).sort(byOldestFirst)}
              onAdvance={handleAdvance}
              onCancel={setOrderToCancel}
            />
          ))}
        </div>
      </main>

      <ConfirmDialog
        open={orderToCancel !== null}
        title="Cancelar pedido"
        description={`Tem certeza que deseja cancelar o pedido #${orderToCancel?.id} de ${orderToCancel?.customerName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Cancelar pedido"
        onConfirm={handleConfirmCancel}
        onCancel={() => setOrderToCancel(null)}
      />
    </div>
  )
}
