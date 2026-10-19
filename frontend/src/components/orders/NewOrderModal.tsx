import { useState, type FormEvent } from 'react'
import { Loader2, MapPin, Plus, Trash2, User } from 'lucide-react'
import { ApiError } from '../../api/client'
import { createOrder } from '../../api/orders'
import type { Order } from '../../types/order'
import { formatCurrency, maskCurrency, parseCurrency } from '../../utils/format'
import { TextField } from '../TextField'
import { Modal } from '../ui/Modal'

type NewOrderModalProps = {
  open: boolean
  onClose: () => void
  onCreated: (order: Order) => void
  onUnauthorized: () => void
}

type ItemForm = {
  key: number
  productName: string
  quantity: string
  unitPrice: string
}

let nextItemKey = 1

function emptyItem(): ItemForm {
  return { key: nextItemKey++, productName: '', quantity: '1', unitPrice: '' }
}

const inputClass = (error?: string) =>
  `h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-1
  ${error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'}`

export function NewOrderModal({ open, onClose, onCreated, onUnauthorized }: NewOrderModalProps) {
  const [customerName, setCustomerName] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [items, setItems] = useState<ItemForm[]>(() => [emptyItem()])
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const total = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * parseCurrency(item.unitPrice), 0)

  function updateItem(key: number, field: keyof Omit<ItemForm, 'key'>, value: string) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, [field]: value } : item)))
  }

  function removeItem(key: number) {
    setItems((current) => current.filter((item) => item.key !== key))
  }

  function reset() {
    setCustomerName('')
    setDeliveryAddress('')
    setItems([emptyItem()])
    setError(null)
    setFieldErrors({})
  }

  function handleClose() {
    if (saving) return
    reset()
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setSaving(true)

    try {
      const order = await createOrder({
        customerName,
        deliveryAddress,
        items: items.map((item) => ({
          productName: item.productName,
          quantity: Number(item.quantity),
          unitPrice: parseCurrency(item.unitPrice),
        })),
      })
      reset()
      onCreated(order)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized()
        return
      }
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setError('Não foi possível criar o pedido.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Novo pedido"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Voltar
          </button>
          <button
            type="submit"
            form="new-order-form"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? 'Criando…' : 'Criar pedido'}
          </button>
        </>
      }
    >
      <form id="new-order-form" onSubmit={handleSubmit} className="space-y-6 pt-2">
        <TextField
          label="Cliente"
          placeholder="Nome do cliente"
          icon={<User size={16} />}
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          error={fieldErrors.customerName}
          required
        />

        <TextField
          label="Endereço de entrega"
          placeholder="Rua, número e complemento"
          icon={<MapPin size={16} />}
          value={deliveryAddress}
          onChange={(event) => setDeliveryAddress(event.target.value)}
          error={fieldErrors.deliveryAddress}
          required
        />

        <div>
          <div className="mb-2 grid grid-cols-[1fr_4.5rem_7rem_2rem] gap-2 text-xs font-medium text-gray-500">
            <span>Produto</span>
            <span>Qtd.</span>
            <span>Preço</span>
          </div>

          <ul className="space-y-2">
            {items.map((item, index) => {
              const errors = [
                fieldErrors[`items[${index}].productName`],
                fieldErrors[`items[${index}].quantity`],
                fieldErrors[`items[${index}].unitPrice`],
              ]
              return (
                <li key={item.key}>
                  <div className="grid grid-cols-[1fr_4.5rem_7rem_2rem] items-center gap-2">
                    <input
                      aria-label="Produto"
                      placeholder="Ex.: Pizza Margherita"
                      value={item.productName}
                      onChange={(event) => updateItem(item.key, 'productName', event.target.value)}
                      className={inputClass(errors[0])}
                      required
                    />
                    <input
                      aria-label="Quantidade"
                      type="number"
                      min={1}
                      step={1}
                      value={item.quantity}
                      onChange={(event) => updateItem(item.key, 'quantity', event.target.value)}
                      className={inputClass(errors[1])}
                      required
                    />
                    <input
                      aria-label="Preço unitário"
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      value={item.unitPrice}
                      onChange={(event) => updateItem(item.key, 'unitPrice', maskCurrency(event.target.value))}
                      className={inputClass(errors[2])}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      disabled={items.length === 1}
                      aria-label="Remover item"
                      className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {errors.some(Boolean) && (
                    <p className="mt-1 text-xs text-red-500">{errors.filter(Boolean).join(' · ')}</p>
                  )}
                </li>
              )
            })}
          </ul>

          {fieldErrors.items && <p className="mt-1 text-xs text-red-500">{fieldErrors.items}</p>}

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setItems((current) => [...current, emptyItem()])}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-600"
            >
              <Plus size={15} />
              Adicionar item
            </button>
            <span className="text-sm text-gray-500">
              Total <span className="ml-1 font-semibold text-gray-900">{formatCurrency(total)}</span>
            </span>
          </div>
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </form>
    </Modal>
  )
}
