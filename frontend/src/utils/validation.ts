const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  if (!email.trim()) return 'Informe o e-mail.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Informe um e-mail válido.'
  return undefined
}
