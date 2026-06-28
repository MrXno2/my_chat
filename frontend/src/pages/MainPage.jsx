import React, { useState } from 'react'
import { apiPostJson, clearTokens } from '../lib/api.js'

const GROUP_ERROR_MESSAGES = {
  GroupAlreadyExists: 'Group already exists.',
  GroupNotFound: 'Group not found.',
  UserBannedInGroup: 'You are banned in this group.',
  UserAlreadyInGroup: 'You are already in this group.',
  InvalidPassword: 'Invalid password.',
  TokenExpiredError: 'Session expired, please log in again.',
  MissingTokenError: 'Authorization required, please log in.'
}

export default function MainPage() {
  const [showExitModal, setShowExitModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [createGroupName, setCreateGroupName] = useState('')
  const [createGroupPass, setCreateGroupPass] = useState('')
  const [joinGroupName, setJoinGroupName] = useState('')
  const [joinGroupPass, setJoinGroupPass] = useState('')
  const [createError, setCreateError] = useState(null)
  const [joinError, setJoinError] = useState(null)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [joinSubmitting, setJoinSubmitting] = useState(false)

  async function handleCreateGroup() {
    setCreateError(null)
    if (createGroupName.length < 4) {
      setCreateError('Group name must be at least 4 characters.')
      return
    }
    if (createGroupPass.length < 6) {
      setCreateError('Password must be at least 6 characters.')
      return
    }
    setCreateSubmitting(true)
    try {
      const { res, data } = await apiPostJson('/api/group/create', {
        name: createGroupName,
        password: createGroupPass
      })
      if (!res.ok) {
        const errorType = data?.error_type
        throw new Error(GROUP_ERROR_MESSAGES[errorType] || 'Unknown error, please try again later')
      }
      setShowCreateModal(false)
      setCreateGroupName('')
      setCreateGroupPass('')
    } catch (err) {
      setCreateError(err?.message || 'Unknown error, please try again later')
    } finally {
      setCreateSubmitting(false)
    }
  }

  async function handleJoinGroup() {
    setJoinError(null)
    if (joinGroupName.length < 4) {
      setJoinError('Group name must be at least 4 characters.')
      return
    }
    if (joinGroupPass.length < 6) {
      setJoinError('Password must be at least 6 characters.')
      return
    }
    setJoinSubmitting(true)
    try {
      const { res, data } = await apiPostJson('/api/group/connect', {
        name: joinGroupName,
        password: joinGroupPass
      })
      if (!res.ok) {
        const errorType = data?.error_type
        throw new Error(GROUP_ERROR_MESSAGES[errorType] || 'Unknown error, please try again later')
      }
      setShowJoinModal(false)
      setJoinGroupName('')
      setJoinGroupPass('')
    } catch (err) {
      setJoinError(err?.message || 'Unknown error, please try again later')
    } finally {
      setJoinSubmitting(false)
    }
  }

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
                  <button className="bb-main-btn" type="button" onClick={() => setShowCreateModal(true)}>Create Group</button>
                  <button className="bb-main-btn" type="button" onClick={() => setShowJoinModal(true)}>Connect Group</button>
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

        {showCreateModal ? (
          <div
            className="bb-group-modal-overlay"
            role="presentation"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="bb-group-modal"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bb-group-modal-titlebar">
                <span>Create Group</span>
                <button
                  type="button"
                  className="bb-group-modal-close-btn"
                  aria-label="Close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="bb-group-modal-body">
                {createError ? <div className="bb-group-modal-error">{createError}</div> : null}
                <label className="bb-group-modal-field">
                  <div className="bb-group-modal-label">Group name:</div>
                  <input
                    className="bb-group-modal-input"
                    type="text"
                    value={createGroupName}
                    onChange={(e) => setCreateGroupName(e.target.value)}
                  />
                </label>
                <label className="bb-group-modal-field">
                  <div className="bb-group-modal-label">Password:</div>
                  <input
                    className="bb-group-modal-input"
                    type="password"
                    value={createGroupPass}
                    onChange={(e) => setCreateGroupPass(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="bb-group-modal-submit-btn"
                  disabled={createSubmitting}
                  onClick={handleCreateGroup}
                >
                  {createSubmitting ? 'Please wait...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showJoinModal ? (
          <div
            className="bb-group-modal-overlay"
            role="presentation"
            onClick={() => setShowJoinModal(false)}
          >
            <div
              className="bb-group-modal"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bb-group-modal-titlebar">
                <span>Connect Group</span>
                <button
                  type="button"
                  className="bb-group-modal-close-btn"
                  aria-label="Close"
                  onClick={() => setShowJoinModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="bb-group-modal-body">
                {joinError ? <div className="bb-group-modal-error">{joinError}</div> : null}
                <label className="bb-group-modal-field">
                  <div className="bb-group-modal-label">Group name:</div>
                  <input
                    className="bb-group-modal-input"
                    type="text"
                    value={joinGroupName}
                    onChange={(e) => setJoinGroupName(e.target.value)}
                  />
                </label>
                <label className="bb-group-modal-field">
                  <div className="bb-group-modal-label">Password:</div>
                  <input
                    className="bb-group-modal-input"
                    type="password"
                    value={joinGroupPass}
                    onChange={(e) => setJoinGroupPass(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="bb-group-modal-submit-btn"
                  disabled={joinSubmitting}
                  onClick={handleJoinGroup}
                >
                  {joinSubmitting ? 'Please wait...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
