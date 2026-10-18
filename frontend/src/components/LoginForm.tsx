import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { login } from '../api/auth'
import { ApiError } from '../api/client'
import { saveToken } from '../auth/token'
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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
    <form onSubmit={handleSubmit} className="w-full">
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
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <div>
          <PasswordField
            label="Senha"
            placeholder="Sua senha"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className="mt-3 flex justify-end text-sm text-gray-500">
            <button type="button" className="transition hover:text-gray-700">
              Esqueci minha senha
            </button>
          </div>
        </div>
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
