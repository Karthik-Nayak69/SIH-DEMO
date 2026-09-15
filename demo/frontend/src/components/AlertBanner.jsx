import { useState, useEffect } from 'react'

export default function AlertBanner({ alerts }) {
  const [dismissed, setDismissed] = useState(null)

  // Show banner if newest alert timestamp is within last 10 seconds
  const latestAlert = alerts.length > 0 ? alerts[0] : null
  const now = Date.now()
  const alertTime = latestAlert ? new Date(latestAlert.timestamp).getTime() : 0
  const isRecent = (now - alertTime) < 10000 // within 10 seconds

  const shouldShow = latestAlert && isRecent && dismissed !== latestAlert.id

  if (!shouldShow) return null

  return (
    <div className="alert-banner">
      <span className="alert-icon">🚨</span>
      <span className="alert-text">{latestAlert.message}</span>
      <button
        className="dismiss-btn"
        onClick={() => setDismissed(latestAlert.id)}
      >
        Dismiss
      </button>
    </div>
  )
}
