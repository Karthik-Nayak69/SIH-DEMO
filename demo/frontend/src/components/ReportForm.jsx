import { useState, useRef } from 'react'

export default function ReportForm({
  reportLocation,
  pickingLocation,
  onStartPicking,
  onSubmit,
}) {
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!photo || !note || !reportLocation) return

    setSubmitting(true)
    const formData = new FormData()
    formData.append('photo', photo)
    formData.append('note', note)
    formData.append('lat', reportLocation.lat)
    formData.append('lng', reportLocation.lng)

    await onSubmit(formData)
    setNote('')
    setPhoto(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setSubmitting(false)
  }

  const canSubmit = photo && note.trim() && reportLocation && !submitting

  return (
    <div className="sidebar-section">
      <div className="section-header">
        Field Report
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe the observation (e.g., Crack visible near culvert)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div
          className={`file-upload-area ${photo ? 'has-file' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0] || null)}
          />
          {photo ? (
            <span>📸 {photo.name}</span>
          ) : (
            <span>📷 Click to attach a photo</span>
          )}
        </div>

        <div
          className={`location-hint ${reportLocation ? 'set' : ''}`}
          onClick={!pickingLocation ? onStartPicking : undefined}
          style={{ cursor: pickingLocation ? 'default' : 'pointer' }}
        >
          {pickingLocation ? (
            <span>🖱️ Click on the map to set location...</span>
          ) : reportLocation ? (
            <span>
              📍 Location set: {reportLocation.lat.toFixed(4)}, {reportLocation.lng.toFixed(4)}
            </span>
          ) : (
            <span>📍 Click here, then click on the map to set location</span>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!canSubmit}
        >
          {submitting ? 'Submitting...' : 'Submit Field Report'}
        </button>
      </form>
    </div>
  )
}
