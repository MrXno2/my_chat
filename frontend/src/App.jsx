import React, { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import MainPage from './pages/MainPage.jsx'

export default function App() {
  const [authKey, setAuthKey] = useState(0)

  const refreshAuth = useMemo(() => () => setAuthKey((x) => x + 1), [])

  return (
    <Routes>
      <Route path="/" element={<MainPage key={authKey} />} />
      <Route path="/auth" element={<AuthPage onAuthSuccess={refreshAuth} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
