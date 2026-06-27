import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearTokens } from '../lib/api.js'

export default function MainPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <div className="bb-screen">
      <div className="bb-bg" />
      <div className="bb-center" style={{ height: '100%', padding: 18, position: 'relative', zIndex: 1 }}>
        <div className="bb-window" style={{ width: 'min(520px, 92vw)' }}>
          <div className="bb-titlebar">MyChat Main (placeholder)</div>
          <div className="bb-window__content">
            {ready ? (
              <>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>You are authorized ✅</div>
                <div style={{ lineHeight: 1.4, marginBottom: 14 }}>
                  This page is a placeholder for the future app.
                  <br />
                  Tokens are stored in cookies by the backend auth endpoints.
                </div>
                <button
                  className="bb-btn"
                  type="button"
                  onClick={() => {
                    clearTokens()
                    navigate('/auth', { replace: true })
                  }}
                >
                  Go to Authorization
                </button>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
