import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Loader2, MapPin, User } from 'lucide-react'
import { ApiError } from '../../api/client'
import { fetchOrder } from '../../api/orders'
import { CANCELLABLE_STATUSES, STATUS_CONFIG, getNextStatus } from '../../constants/orderStatus'
import type { Order } from '../../types/order'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { Modal } from '../ui/Modal'

type OrderDetailsModalProps = {
  orderId: number | null
  onClose: () => void
  onAdvance: (order: Order) => void
  onCancel: (order: Order) => void
  onUnauthorized: () => void
}

export function OrderDetailsModal({ orderId, onClose, onAdvance, onCancel, onUnauthorized }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const onUnauthorizedRef = useRef(onUnauthorized)

  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized
  })

  useEffect(() => {
    if (orderId === null) return

    fetchOrder(orderId)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          onUnauthorizedRef.current()
          return
        }
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o pedido.')
      })
  }, [orderId])

  const nextStatus = order ? getNextStatus(order.status) : null
  const canCancel = order ? CANCELLABLE_STATUSES.includes(order.status) : false

  return (
    <Modal
      open={orderId !== null}
      onClose={onClose}
      title={`Pedido #${orderId ?? ''}`}
      footer={
        order && (nextStatus || canCancel) && (
          <>
            {canCancel && (
              <button
                type="button"
                onClick={() => onCancel(order)}
                className="mr-auto rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
              >
                Cancelar pedido
              </button>
            )}
            {nextStatus && (
              <button
                type="button"
                onClick={() => onAdvance(order)}
                className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
              >
                Avançar para {STATUS_CONFIG[nextStatus].label}
                <ArrowRight size={15} />
              </button>
            )}
          </>
        )
      }
    >
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      ) : !order ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <Loader2 size={18} className="animate-spin" />
          Carregando pedido…
        </div>
      ) : (
        <div className="space-y-5">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CONFIG[order.status].badge}`}>
            {STATUS_CONFIG[order.status].label}
          </span>

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 font-medium text-gray-900">
              <User size={15} className="text-gray-400" />
              {order.customerName}
            </p>
            <p className="flex items-start gap-2 text-gray-600">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />
              {order.deliveryAddress}
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                <th className="pb-2 font-medium">Produto</th>
                <th className="pb-2 text-right font-medium">Qtd.</th>
                <th className="pb-2 text-right font-medium">Preço</th>
                <th className="pb-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-dashed border-gray-100 text-gray-700">
                  <td className="py-2">{item.productName}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 text-right">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-3 text-gray-500">Total</td>
                <td className="pt-3 text-right font-semibold text-gray-900">{formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 px-4 py-3 text-xs">
            <div>
              <dt className="text-gray-500">Criado em</dt>
              <dd className="mt-0.5 font-medium text-gray-900">{formatDateTime(order.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Atualizado em</dt>
              <dd className="mt-0.5 font-medium text-gray-900">{formatDateTime(order.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  )
}
