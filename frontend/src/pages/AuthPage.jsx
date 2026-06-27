import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPostJson, setTokens } from '../lib/api.js'

function Field({ label, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="bb-form__field">
      <div className="bb-label">{label}</div>
      <input
        className="bb-input"
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export default function AuthPage({ onAuthSuccess }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // login | register
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const endpoint = useMemo(() => {
    // mode: login | register
    return mode === 'login'
      ? '/api/auth/login'
      : '/api/auth/register'
  }, [mode])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const { res, data } = await apiPostJson(endpoint, { login, password })

      if (!res.ok) {
        const msg =
          data?.detail ||
          data?.message ||
          `Request failed with status ${res.status}`
        throw new Error(Array.isArray(msg) ? 'Validation error' : msg)
      }

      // backend returns tokens in JSON; store them in cookies
      setTokens(data)

      onAuthSuccess?.()
      // redirect on successful auth (backend responded ok)
      navigate('/')
      return
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bb-screen">
      <div className="bb-bg" />
      <div className="bb-auth-wrap">
        <div className="bb-window">
          <div className="bb-titlebar">100_GRAMM</div>

          <div className="bb-tabs">
            <div
              className={`bb-tab ${mode === 'register' ? 'bb-tab--active' : ''}`}
              onClick={() => {
                setMode('register')
                setError(null)
              }}
            >
              Register
            </div>
            <div
              className={`bb-tab ${mode === 'login' ? 'bb-tab--active' : ''}`}
              onClick={() => {
                setMode('login')
                setError(null)
              }}
            >
              Login
            </div>
          </div>

          <div className="bb-window__content" style={{ padding: '7px' }}>
            <form className="bb-form" onSubmit={onSubmit}>
              {error ? <div className="bb-error">{error}</div> : null}

              <Field
                label="Login:"
                value={login}
                onChange={setLogin}
                autoComplete="username"
              />

              <Field
                label="Password:"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />

              <button className="bb-btn" disabled={submitting} type="submit">
                {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>

              <div className="bb-status">
                <b>Note:</b> Tokens are stored in cookies. After auth, you will be redirected automatically.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
