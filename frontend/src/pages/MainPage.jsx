import React, { useState, useEffect, useRef, useCallback } from 'react'
import { apiGet, apiPostJson, clearTokens } from '../lib/api.js'

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

  const [groups, setGroups] = useState([])
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const groupsOffset = useRef(0)
  const groupsContainerRef = useRef(null)
  const GROUP_LIMIT = 20

  const [selectedGroup, setSelectedGroup] = useState(null)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messageText, setMessageText] = useState('')
  const messagesContainerRef = useRef(null)
  const messagesOffset = useRef(0)
  const MESSAGE_LIMIT = 50

  const fetchGroups = useCallback(async (offset, append) => {
    if (groupsLoading) return
    setGroupsLoading(true)
    try {
      const res = await apiGet('/api/group/get', { limit: GROUP_LIMIT, offset })
      if (res.status === 401) {
        window.location.assign('/auth')
        return
      }
      if (res.ok) {
        const data = await res.json()
        if (append) {
          setGroups(prev => [...prev, ...data])
        } else {
          setGroups(data)
        }
        setHasMore(data.length === GROUP_LIMIT)
        groupsOffset.current = offset + data.length
      }
    } catch {
      // ignore — groups stay empty
    } finally {
      setGroupsLoading(false)
    }
  }, [groupsLoading])

  useEffect(() => {
    fetchGroups(0, false)
  }, [])

  function handleGroupsScroll(e) {
    const el = e.target
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40 && hasMore && !groupsLoading) {
      fetchGroups(groupsOffset.current, true)
    }
  }

  const fetchMessages = useCallback(async (groupId, offset, append) => {
    if (messagesLoading) return
    setMessagesLoading(true)
    try {
      const res = await apiGet('/api/chat/load', { group_id: groupId, limit: MESSAGE_LIMIT, offset })
      if (res.status === 401) {
        window.location.assign('/auth')
        return
      }
      if (res.ok) {
        const data = await res.json()
        if (append) {
          setMessages(prev => [...data.reverse(), ...prev])
        } else {
          setMessages(data.reverse())
        }
        messagesOffset.current = offset + data.length
      }
    } catch {
      // ignore
    } finally {
      setMessagesLoading(false)
    }
  }, [messagesLoading])

  function handleSelectGroup(group) {
    setSelectedGroup(group)
    setMessages([])
    messagesOffset.current = 0
    fetchMessages(group.id, 0, false)
  }

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedGroup) return
    const text = messageText.trim()
    setMessageText('')
    try {
      const { res } = await apiPostJson('/api/chat/save', {
        group_id: String(selectedGroup.id),
        message: text
      })
      if (res.status === 401) {
        window.location.assign('/auth')
        return
      }
      if (res.ok) {
        fetchMessages(selectedGroup.id, 0, false)
      }
    } catch {
      // ignore
    }
  }

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
        if (res.status === 401) {
          window.location.assign('/auth')
          return
        }
        const errorType = data?.error_type
        if (errorType === 'TokenExpiredError' || errorType === 'MissingTokenError') {
          window.location.assign('/auth')
          return
        }
        throw new Error(GROUP_ERROR_MESSAGES[errorType] || 'Unknown error, please try again later')
      }
      setShowCreateModal(false)
      setCreateGroupName('')
      setCreateGroupPass('')
      fetchGroups(0, false)
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
        if (res.status === 401) {
          window.location.assign('/auth')
          return
        }
        const errorType = data?.error_type
        if (errorType === 'TokenExpiredError' || errorType === 'MissingTokenError') {
          window.location.assign('/auth')
          return
        }
        throw new Error(GROUP_ERROR_MESSAGES[errorType] || 'Unknown error, please try again later')
      }
      setShowJoinModal(false)
      setJoinGroupName('')
      setJoinGroupPass('')
      fetchGroups(0, false)
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
                <div
                  className="bb-main-left"
                  ref={groupsContainerRef}
                  onScroll={handleGroupsScroll}
                >
                  {groups.map(g => (
                    <div
                      key={g.id}
                      className={`bb-group-item${selectedGroup?.id === g.id ? ' bb-group-item--active' : ''}`}
                      data-id={g.id}
                      onClick={() => handleSelectGroup(g)}
                    >
                      {g.name}
                    </div>
                  ))}
                  {groupsLoading && <div className="bb-group-loading">Loading...</div>}
                </div>
                <div className="bb-main-right">
                  {selectedGroup ? (
                    <>
                      <div className="bb-chat-header">{selectedGroup.name}</div>
                      <div className="bb-chat-messages" ref={messagesContainerRef}>
                        {messagesLoading && messages.length === 0 && (
                          <div className="bb-chat-loading">Loading...</div>
                        )}
                        {messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`bb-message${msg.user_resp_id === msg.user_id ? ' bb-message--own' : ' bb-message--other'}`}
                          >
                            <div className="bb-message-name">{msg.user_name}</div>
                            <div className="bb-message-text">{msg.content}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bb-chat-placeholder">Select a group</div>
                  )}
                </div>
              </div>

              <div className="bb-main-bottom">
                <div className="bb-main-bottom-left">
                  <button className="bb-main-btn" type="button" onClick={() => setShowCreateModal(true)}>Create Group</button>
                  <button className="bb-main-btn" type="button" onClick={() => setShowJoinModal(true)}>Connect Group</button>
                </div>
                <div className="bb-main-bottom-right">
                  <input
                    className="bb-input-message"
                    type="text"
                    style={{ width: '80%', height: '100%', boxSizing: 'border-box' }}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                    disabled={!selectedGroup}
                  />
                  <button
                    className="bb-btn-message"
                    type="button"
                    style={{ width: '20%', height: '100%', boxSizing: 'border-box', margin: 0 }}
                    onClick={handleSendMessage}
                    disabled={!selectedGroup || !messageText.trim()}
                  >Send</button>
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
