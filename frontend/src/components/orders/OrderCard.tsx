import { AlertCircle, ArrowRight, Clock, Loader2, MapPin } from 'lucide-react'
import { CANCELLABLE_STATUSES, STATUS_CONFIG, getNextStatus, isDelayed } from '../../constants/orderStatus'
import type { Order } from '../../types/order'
import { formatCurrency, formatRelativeTime } from '../../utils/format'

type OrderCardProps = {
  order: Order
  highlighted?: boolean
  pending?: boolean
  onOpen: (order: Order) => void
  onAdvance: (order: Order) => void
  onCancel: (order: Order) => void
}

export function OrderCard({ order, highlighted = false, pending = false, onOpen, onAdvance, onCancel }: OrderCardProps) {
  const isCanceled = order.status === 'CANCELADO'
  const delayed = isDelayed(order)
  const nextStatus = getNextStatus(order.status)
  const canCancel = CANCELLABLE_STATUSES.includes(order.status)

  return (
    <article
      onClick={() => onOpen(order)}
      className={`cursor-pointer rounded-xl border p-4 shadow-xs transition hover:shadow-md
        ${delayed ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-white'}
        ${isCanceled ? 'opacity-70' : ''}
        ${highlighted ? 'animate-new-order ring-2 ring-brand-400' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-gray-400">#{order.id}</span>
          {highlighted && (
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Novo
            </span>
          )}
        </span>
        {delayed ? (
          <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
            <AlertCircle size={12} />
            Atrasado · {formatRelativeTime(order.createdAt)}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {formatRelativeTime(order.createdAt)}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
      <p className="mt-1 flex items-start gap-1.5 text-xs text-gray-500">
        <MapPin size={13} className="mt-px shrink-0" />
        {order.deliveryAddress}
      </p>

      <ul className="mt-3 space-y-1 border-t border-dashed border-gray-200 pt-3">
        {order.items.map((item) => (
          <li key={item.id} className="truncate text-sm text-gray-600">
            <span className="font-medium text-gray-900">{item.quantity}×</span> {item.productName}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">Total</span>
        <span className={`font-semibold text-gray-900 ${isCanceled ? 'line-through' : ''}`}>
          {formatCurrency(order.total)}
        </span>
      </div>

      {(nextStatus || canCancel) && (
        <div className="mt-4 flex gap-2">
          {canCancel && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onCancel(order)
              }}
              disabled={pending}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:border-rose-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          {nextStatus && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onAdvance(order)
              }}
              title={`Avançar para ${STATUS_CONFIG[nextStatus].label}`}
              disabled={pending}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  Avançar
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </article>
  )
}
