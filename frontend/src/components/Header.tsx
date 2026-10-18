import { LogOut, UtensilsCrossed } from 'lucide-react'

type HeaderProps = {
  onLogout: () => void
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <UtensilsCrossed size={18} />
          </span>
          <div className="leading-tight">
            <p className="font-bold text-gray-900">Foody Delivery</p>
            <p className="text-xs text-gray-500">Rastreamento de pedidos</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </header>
  )
}
