import React, { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import MainPage from './pages/MainPage.jsx'
import { apiGet } from './lib/api.js'

function AuthGate({ children }) {
  const [status, setStatus] = useState('checking') // checking | ok | unauthorized | error
  const location = useLocation()

  React.useEffect(() => {
    let cancelled = false

    async function check() {
      if (cancelled) return
      try {
        const res = await apiGet('/api/auth/check_user')

        if (cancelled) return

        // Любые неуспешные ответы считаем неавторизованным
        if (res.status === 401 || res.status === 403 || res.status === 404 || !res.ok) {
          setStatus('unauthorized')
          return
        }

        setStatus('ok')
      } catch (e) {
        // Network/CORS/other fetch errors: для UX просто считаем как unauthorized
        // Причину можно будет увидеть в консоли
        // eslint-disable-next-line no-console
        console.error('Failed to check auth:', e)
        if (cancelled) return
        setStatus('unauthorized')
      }
    }

    setStatus('checking')
    check()

    return () => {
      cancelled = true
    }
  }, [location.pathname])

  if (status === 'checking') {
    return (
      <div className="bb-center bb-screen">
        <div className="bb-window bb-window--small bb-pulse">Checking authorization...</div>
      </div>
    )
  }

  if (status === 'unauthorized') {
    return <Navigate to="/auth" replace />
  }

  if (status === 'error') {
    return (
      <div className="bb-center bb-screen">
        <div className="bb-window bb-window--small">
          <div className="bb-titlebar">Authorization</div>
          <div className="bb-window__content">Failed to check auth. Reload page.</div>
        </div>
      </div>
    )
  }

  return children
}

export default function App() {
  const [authKey, setAuthKey] = useState(0)

  // меняем key после успешной авторизации, чтобы gate снова сделал проверку
  const refreshAuth = useMemo(() => () => setAuthKey((x) => x + 1), [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGate key={authKey}>
            <MainPage onNeedRecheck={refreshAuth} />
          </AuthGate>
        }
      />
      <Route path="/auth" element={<AuthPage onAuthSuccess={refreshAuth} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
