import { useState } from 'react'
import { clearToken, getToken } from './auth/token'
import { AuthPage } from './pages/AuthPage'

function App() {
  const [token, setToken] = useState(getToken)

  if (!token) {
    return <AuthPage onLogin={() => setToken(getToken())} />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg text-gray-700">Login realizado com sucesso.</p>
      <button
        type="button"
        onClick={() => {
          clearToken()
          setToken(null)
        }}
        className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
      >
        Sair
      </button>
    </main>
  )
}

export default App
