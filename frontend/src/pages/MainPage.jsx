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
      <div
        className="bb-center"
        style={{ height: '100%', padding: 18, position: 'relative', zIndex: 1 }}
      >
        <div
          className="bb-window"
          style={{
            width: 'min(560px, 92vw)',
            height: 'min(560px, 92vw)',
          }}
        >
          <div className="bb-titlebar" style={{ position: 'relative', paddingRight: 7 }}>
            MyChat Main
            <button
              type="button"
              className="bb-close-btn"
              aria-label="Close"
              onClick={() => {
                // Later: show popup
                // eslint-disable-next-line no-console
                console.log('close clicked')
              }}
            >
              ×
            </button>
          </div>

          <div className="bb-window__content">
            {ready ? (
                <div className="bb-main-layout">
                  <div className="bb-main-top">
                    <div className="bb-main-left" />
                    <div className="bb-main-right" />
                  </div>

                  <div className="bb-main-bottom">
                    <div className="bb-main-bottom-left" />
                    <div className="bb-main-bottom-right" />
                  </div>
                </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
