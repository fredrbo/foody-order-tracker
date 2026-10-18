import { Banknote, CreditCard, QrCode, type LucideIcon } from 'lucide-react'
import type { PaymentMethod } from '../types/order'

type PaymentConfig = {
  label: string
  icon: LucideIcon
}

export const PAYMENT_CONFIG: Record<PaymentMethod, PaymentConfig> = {
  DINHEIRO: { label: 'Dinheiro', icon: Banknote },
  CARTAO: { label: 'Cartão', icon: CreditCard },
  PIX: { label: 'Pix', icon: QrCode },
}
