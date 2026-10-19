import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { login } from '../api/auth'
import { ApiError } from '../api/client'
import { saveToken } from '../auth/token'
import { validateEmail } from '../utils/validation'
import { PasswordField } from './PasswordField'
import { TextField } from './TextField'

type LoginFormProps = {
  initialEmail?: string
  successMessage?: string
  onLogin: () => void
  onCreateAccount: () => void
}

export function LoginForm({ initialEmail = '', successMessage, onLogin, onCreateAccount }: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleEmailChange(value: string) {
    setEmail(value)
    if (emailError) setEmailError(validateEmail(value))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const invalidEmail = validateEmail(email)
    setEmailError(invalidEmail)
    if (invalidEmail) return
    setError(null)
    setLoading(true)

    try {
      const { token } = await login(email, password)
      saveToken(token)
      onLogin()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Ocorreu um erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <h1 className="mb-10 text-center text-3xl font-bold text-gray-900">Faça seu login</h1>

      {successMessage && (
        <p className="mb-6 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>
      )}

      <div className="space-y-6">
        <TextField
          label="E-mail"
          type="email"
          placeholder="seuemail@mail.com"
          autoComplete="email"
          icon={<Mail size={16} />}
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          onBlur={() => setEmailError(validateEmail(email))}
          error={emailError}
          required
        />

        <PasswordField
          label="Senha"
          placeholder="Sua senha"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error && <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 h-11 w-full rounded-md bg-brand-500 font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="mt-12 text-center text-sm text-gray-500">
        Não tem conta ainda?{' '}
        <button type="button" onClick={onCreateAccount} className="font-medium text-brand-500 hover:text-brand-600">
          Crie agora
        </button>
      </p>
    </form>
  )
}
