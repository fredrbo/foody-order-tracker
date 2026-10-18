import { useState } from 'react'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'

type AuthPageProps = {
  onLogin: () => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [registeredEmail, setRegisteredEmail] = useState<string>()

  function handleRegistered(email: string) {
    setRegisteredEmail(email)
    setMode('login')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 px-6 py-10 sm:px-10">
        {mode === 'login' ? (
          <LoginForm
            key={registeredEmail}
            initialEmail={registeredEmail}
            successMessage={registeredEmail ? 'Conta criada com sucesso! Faça seu login.' : undefined}
            onLogin={onLogin}
            onCreateAccount={() => setMode('register')}
          />
        ) : (
          <RegisterForm onRegistered={handleRegistered} onBackToLogin={() => setMode('login')} />
        )}
      </div>
    </main>
  )
}
