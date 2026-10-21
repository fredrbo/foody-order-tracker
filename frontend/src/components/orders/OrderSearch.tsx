import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'

type OrderSearchProps = {
  onSearch: (orderId: number) => void
}

export function OrderSearch({ onSearch }: OrderSearchProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const orderId = Number(value)
    if (!Number.isInteger(orderId) || orderId <= 0) return

    onSearch(orderId)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <input
        aria-label="ID do pedido"
        inputMode="numeric"
        placeholder="ID do pedido"
        value={value}
        onChange={(event) => setValue(event.target.value.replace(/\D/g, ''))}
        className="h-9 w-40 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
      <button
        type="submit"
        disabled={!value}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Search size={15} />
        Buscar
      </button>
    </form>
  )
}
