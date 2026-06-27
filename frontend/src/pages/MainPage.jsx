import React, { useState } from 'react'
import { clearTokens } from '../lib/api.js'

export default function MainPage() {
  const [showExitModal, setShowExitModal] = useState(false)

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
            100_GRAMM
            <button
              type="button"
              className="bb-close-btn"
              aria-label="Close"
              onClick={() => setShowExitModal(true)}
            >
              ×
            </button>
          </div>

          <div className="bb-window__content">
            <div className="bb-main-layout">
              <div className="bb-main-top">
                <div className="bb-main-left" />
                <div className="bb-main-right" />
              </div>

              <div className="bb-main-bottom">
                <div className="bb-main-bottom-left">
                  <button className="bb-main-btn" type="button">Create Group</button>
                  <button className="bb-main-btn" type="button">Search Group</button>
                </div>
                <div className="bb-main-bottom-right">
                  <input className="bb-input-message" type="text" style={{ width: '80%', height: '100%', boxSizing: 'border-box' }} />
                  <button className="bb-btn-message" type="button" style={{ width: '20%', height: '100%', boxSizing: 'border-box', margin: 0 }}>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showExitModal ? (
          <div
            className="bb-modal-overlay"
            role="presentation"
            onClick={() => setShowExitModal(false)}
          >
            <div
              className="bb-modal"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bb-modal-titlebar">
                <span>Exit</span>
                <button
                  type="button"
                  className="bb-modal-close-btn"
                  aria-label="Close"
                  onClick={() => setShowExitModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="bb-modal-body">
                <div className="bb-modal-question">
                  Are you sure you
                  <br />
                  want to exit?
                </div>
                <button
                  type="button"
                  className="bb-modal-exit-btn"
                  onClick={() => {
                    clearTokens()
                    setShowExitModal(false)
                    window.location.assign('/auth')
                  }}
                >
                  EXIT
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
