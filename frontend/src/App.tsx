import { useState } from 'react'
import { clearToken, getToken } from './auth/token'
import { AuthPage } from './pages/AuthPage'
import { OrdersPage } from './pages/OrdersPage'

function App() {
  const [token, setToken] = useState(getToken)

  function handleLogout() {
    clearToken()
    setToken(null)
  }

  if (!token) {
    return <AuthPage onLogin={() => setToken(getToken())} />
  }

  return <OrdersPage onLogout={handleLogout} />
}

export default App
