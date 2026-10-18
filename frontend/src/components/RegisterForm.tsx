import { useState, type FormEvent } from 'react'
import { Mail, User } from 'lucide-react'
import { register } from '../api/auth'
import { ApiError } from '../api/client'
import { PasswordField } from './PasswordField'
import { TextField } from './TextField'

type RegisterFormProps = {
  onRegistered: (email: string) => void
  onBackToLogin: () => void
}

export function RegisterForm({ onRegistered, onBackToLogin }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)

    try {
      const user = await register(name, email, password)
      onRegistered(user.email)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setError('Ocorreu um erro inesperado.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h1 className="mb-10 text-center text-3xl font-bold text-gray-900">Crie sua conta</h1>

      <div className="space-y-6">
        <TextField
          label="Nome"
          placeholder="Seu nome"
          autoComplete="name"
          icon={<User size={16} />}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          required
        />

        <TextField
          label="E-mail"
          type="email"
          placeholder="seuemail@mail.com"
          autoComplete="email"
          icon={<Mail size={16} />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          required
        />

        <PasswordField
          label="Senha"
          placeholder="Crie uma senha"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          required
        />
      </div>

      {error && <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 h-11 w-full rounded-md bg-brand-500 font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>

      <p className="mt-12 text-center text-sm text-gray-500">
        Já tem uma conta?{' '}
        <button type="button" onClick={onBackToLogin} className="font-medium text-brand-500 hover:text-brand-600">
          Faça login
        </button>
      </p>
    </form>
  )
}
