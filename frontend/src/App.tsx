import { useState } from 'react'
import { clearToken, getToken } from './auth/token'
import { AuthPage } from './pages/AuthPage'
import { OrdersPage } from './pages/OrdersPage'
import { useToast } from './toast/ToastContext'

function App() {
  const toast = useToast()
  const [token, setToken] = useState(getToken)

  function handleLogout() {
    clearToken()
    setToken(null)
  }

  function handleSessionExpired() {
    handleLogout()
    toast.error('Sua sessão expirou. Faça login novamente.')
  }

  if (!token) {
    return <AuthPage onLogin={() => setToken(getToken())} />
  }

  return <OrdersPage onLogout={handleLogout} onSessionExpired={handleSessionExpired} />
}

export default App
