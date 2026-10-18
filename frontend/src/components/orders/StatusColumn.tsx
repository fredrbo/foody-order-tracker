import { STATUS_CONFIG } from '../../constants/orderStatus'
import type { Order, OrderStatus } from '../../types/order'
import { OrderCard } from './OrderCard'

type StatusColumnProps = {
  status: OrderStatus
  orders: Order[]
  onAdvance: (order: Order) => void
  onCancel: (order: Order) => void
}

export function StatusColumn({ status, orders, onAdvance, onCancel }: StatusColumnProps) {
  const config = STATUS_CONFIG[status]

  return (
    <section className={`flex w-72 shrink-0 flex-col rounded-2xl p-3 lg:w-auto lg:min-w-0 lg:flex-1 ${config.column}`}>
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
          <span className={`size-2.5 rounded-full ${config.dot}`} />
          {config.label}
        </h2>
        <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${config.badge}`}>{orders.length}</span>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} onAdvance={onAdvance} onCancel={onCancel} />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-gray-300 px-3 py-6 text-center text-xs text-gray-400">
            Nenhum pedido
          </p>
        )}
      </div>
    </section>
  )
}
