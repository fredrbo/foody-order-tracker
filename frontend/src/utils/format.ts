const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const relativeFormatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatRelativeTime(isoDate: string) {
  const diffInMinutes = Math.round((new Date(isoDate).getTime() - Date.now()) / 60_000)

  if (Math.abs(diffInMinutes) < 1) return 'agora'
  if (Math.abs(diffInMinutes) < 60) return relativeFormatter.format(diffInMinutes, 'minute')

  const diffInHours = Math.round(diffInMinutes / 60)
  if (Math.abs(diffInHours) < 24) return relativeFormatter.format(diffInHours, 'hour')

  return relativeFormatter.format(Math.round(diffInHours / 24), 'day')
}

export function maskCurrency(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  return digits ? formatCurrency(Number(digits) / 100) : ''
}

export function parseCurrency(value: string) {
  return Number(value.replace(/\D/g, '')) / 100
}
