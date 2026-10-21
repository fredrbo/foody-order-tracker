import { useCallback, useState } from 'react'
import { Loader2, Plus, RefreshCw, WifiOff } from 'lucide-react'
import { ApiError } from '../api/client'
import { updateOrderStatus } from '../api/orders'
import { Header } from '../components/Header'
import { NewOrderModal } from '../components/orders/NewOrderModal'
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal'
import { OrderSearch } from '../components/orders/OrderSearch'
import { StatusColumn } from '../components/orders/StatusColumn'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ORDER_STATUSES, STATUS_CONFIG, getNextStatus } from '../constants/orderStatus'
import { useOrders } from '../hooks/useOrders'
import { useToast } from '../toast/ToastContext'
import type { Order, OrderStatus } from '../types/order'
import { playNewOrderSound } from '../utils/notificationSound'

const HIGHLIGHT_DURATION_MS = 15_000

type OrdersPageProps = {
  onLogout: () => void
  onSessionExpired: () => void
}

function byOldestFirst(a: Order, b: Order) {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
}

export function OrdersPage({ onLogout, onSessionExpired }: OrdersPageProps) {
  const toast = useToast()
  const [orderToAdvance, setOrderToAdvance] = useState<Order | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)
  const [newOrderOpen, setNewOrderOpen] = useState(false)
  const [detailsOrderId, setDetailsOrderId] = useState<number | null>(null)
  const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set())
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())

  const handleNewOrders = useCallback(
    (newOrders: Order[]) => {
      playNewOrderSound()
      newOrders.forEach((order) => toast.success(`Novo pedido #${order.id} · ${order.customerName}`))

      const ids = newOrders.map((order) => order.id)
      setHighlightedIds((current) => new Set([...current, ...ids]))
      setTimeout(() => {
        setHighlightedIds((current) => new Set([...current].filter((id) => !ids.includes(id))))
      }, HIGHLIGHT_DURATION_MS)
    },
    [toast],
  )

  const { orders, setOrders, addOrder, loading, error, lastUpdatedAt, reload } = useOrders({
    onNewOrders: handleNewOrders,
    onUnauthorized: onSessionExpired,
  })

  const inProgress = orders.filter((order) => order.status !== 'ENTREGUE' && order.status !== 'CANCELADO').length

  async function changeStatus(order: Order, status: OrderStatus, successMessage: string) {
    setPendingIds((current) => new Set(current).add(order.id))
    try {
      const updated = await updateOrderStatus(order.id, status)
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      toast.success(successMessage)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired()
        return
      }
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível atualizar o pedido.')
      void reload()
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(order.id)
        return next
      })
    }
  }

  function handleCreated(order: Order) {
    addOrder(order)
    setNewOrderOpen(false)
    toast.success(`Pedido #${order.id} criado para ${order.customerName}.`)
  }

  function handleConfirmAdvance() {
    const order = orderToAdvance
    if (!order) return
    const nextStatus = getNextStatus(order.status)
    setOrderToAdvance(null)
    if (!nextStatus) return

    void changeStatus(order, nextStatus, `Pedido #${order.id} avançou para ${STATUS_CONFIG[nextStatus].label}.`)
  }

  function handleConfirmCancel() {
    const order = orderToCancel
    if (!order) return
    setOrderToCancel(null)

    void changeStatus(order, 'CANCELADO', `Pedido #${order.id} cancelado.`)
  }

  const firstLoadFailed = error !== null && lastUpdatedAt === null
  const nextStatusToConfirm = orderToAdvance ? getNextStatus(orderToAdvance.status) : null

  return (
    <div className="min-h-screen bg-white">
      <Header onLogout={onLogout} />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
            {!loading && !firstLoadFailed && (
              <p className="mt-1 text-sm text-gray-500">
                {orders.length} pedidos · {inProgress} em andamento
              </p>
            )}
            <OrderSearch onSearch={setDetailsOrderId} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {lastUpdatedAt && (
              <p
                className={`flex items-center gap-1.5 text-xs ${error ? 'text-rose-600' : 'text-gray-400'}`}
                title="A lista é atualizada automaticamente a cada 10 segundos"
              >
                {error ? <WifiOff size={13} /> : <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />}
                {error
                  ? 'Falha ao atualizar, tentando novamente…'
                  : `Atualizado às ${lastUpdatedAt.toLocaleTimeString('pt-BR')}`}
              </p>
            )}

            <button
              type="button"
              onClick={() => setNewOrderOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              <Plus size={16} />
              Novo pedido
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Carregando pedidos…
          </div>
        ) : firstLoadFailed ? (
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-24 text-center">
            <WifiOff size={28} className="text-gray-400" />
            <p className="text-sm text-gray-600">{error}</p>
            <button
              type="button"
              onClick={() => void reload()}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              <RefreshCw size={15} />
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0">
            {ORDER_STATUSES.map((status) => (
              <StatusColumn
                key={status}
                status={status}
                orders={orders.filter((order) => order.status === status).sort(byOldestFirst)}
                highlightedIds={highlightedIds}
                pendingIds={pendingIds}
                onOpen={(order) => setDetailsOrderId(order.id)}
                onAdvance={setOrderToAdvance}
                onCancel={setOrderToCancel}
              />
            ))}
          </div>
        )}
      </main>

      <OrderDetailsModal
        key={detailsOrderId ?? 'closed'}
        orderId={detailsOrderId}
        onClose={() => setDetailsOrderId(null)}
        onAdvance={(order) => {
          setDetailsOrderId(null)
          setOrderToAdvance(order)
        }}
        onCancel={(order) => {
          setDetailsOrderId(null)
          setOrderToCancel(order)
        }}
        onUnauthorized={onSessionExpired}
      />

      <NewOrderModal
        open={newOrderOpen}
        onClose={() => setNewOrderOpen(false)}
        onCreated={handleCreated}
        onUnauthorized={onSessionExpired}
      />

      <ConfirmDialog
        open={orderToAdvance !== null}
        variant="primary"
        title="Avançar pedido"
        description={
          orderToAdvance && nextStatusToConfirm && (
            <>
              Avançar o pedido #{orderToAdvance.id} de {orderToAdvance.customerName} de{' '}
              <strong className="text-gray-900">{STATUS_CONFIG[orderToAdvance.status].label}</strong> para{' '}
              <strong className="text-gray-900">{STATUS_CONFIG[nextStatusToConfirm].label}</strong>?
            </>
          )
        }
        confirmLabel={nextStatusToConfirm ? `Avançar para ${STATUS_CONFIG[nextStatusToConfirm].label}` : 'Avançar'}
        onConfirm={handleConfirmAdvance}
        onCancel={() => setOrderToAdvance(null)}
      />

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
