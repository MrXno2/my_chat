import React from 'react'

export default function MainPage() {
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
          </div>
        </div>
      </div>
    </div>
  )
}
