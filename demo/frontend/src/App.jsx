import { useState, useEffect, useCallback } from 'react'
import MapView from './components/MapView'
import ZoneControls from './components/ZoneControls'
import AlertBanner from './components/AlertBanner'
import ReportForm from './components/ReportForm'
import './index.css'

const API = 'http://localhost:8000'

function App() {
  const [zones, setZones] = useState([])
  const [reports, setReports] = useState([])
  const [alerts, setAlerts] = useState([])
  const [selectedZoneId, setSelectedZoneId] = useState(null)
  const [reportLocation, setReportLocation] = useState(null)
  const [pickingLocation, setPickingLocation] = useState(false)

  // Fetch zones
  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch(`${API}/zones`)
      const data = await res.json()
      setZones(data)
      if (!selectedZoneId && data.length > 0) {
        setSelectedZoneId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch zones:', err)
    }
  }, [selectedZoneId])

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(`${API}/reports`)
      const data = await res.json()
      setReports(data)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    }
  }, [])

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/alerts`)
      const data = await res.json()
      setAlerts(data)
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchZones()
    fetchReports()
    fetchAlerts()
  }, [])

  // Poll alerts every 3 seconds
  useEffect(() => {
    const interval = setInterval(fetchAlerts, 3000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  // Update zone via API
  const handleZoneUpdate = async (zoneId, rainfall, soilMoisture) => {
    try {
      const res = await fetch(`${API}/zones/${zoneId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rainfall, soil_moisture: soilMoisture }),
      })
      const updatedZone = await res.json()
      setZones(prev =>
        prev.map(z => (z.id === zoneId ? updatedZone : z))
      )
    } catch (err) {
      console.error('Failed to update zone:', err)
    }
  }

  // Submit report
  const handleReportSubmit = async (formData) => {
    try {
      const res = await fetch(`${API}/reports`, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        fetchReports()
        setReportLocation(null)
        setPickingLocation(false)
      }
    } catch (err) {
      console.error('Failed to submit report:', err)
    }
  }

  // Map click for report location
  const handleMapClick = (lat, lng) => {
    if (pickingLocation) {
      setReportLocation({ lat, lng })
      setPickingLocation(false)
    }
  }

  const selectedZone = zones.find(z => z.id === selectedZoneId)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <span className="logo-icon">⛰</span>
          Landslide Risk Monitor — NER
        </h1>
        <div className="header-meta">
          <span>SIH 26001</span>
          <span>MDoNER</span>
          <span>Meghalaya District</span>
        </div>
      </header>

      <AlertBanner alerts={alerts} />

      <div className="app-main">
        <div className="map-container">
          <MapView
            zones={zones}
            reports={reports}
            onMapClick={handleMapClick}
            pickingLocation={pickingLocation}
          />
          <div className="map-legend">
            <h4>Risk Levels</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot low"></span> Low (0–30)
              </div>
              <div className="legend-item">
                <span className="legend-dot moderate"></span> Moderate (31–55)
              </div>
              <div className="legend-item">
                <span className="legend-dot high"></span> High (56–75)
              </div>
              <div className="legend-item">
                <span className="legend-dot severe"></span> Severe (76–100)
              </div>
              <div className="legend-item">
                <span className="legend-pin">📍</span> Field Report
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <ZoneControls
            zones={zones}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
            onUpdate={handleZoneUpdate}
            selectedZone={selectedZone}
          />

          <ReportForm
            reportLocation={reportLocation}
            pickingLocation={pickingLocation}
            onStartPicking={() => setPickingLocation(true)}
            onSubmit={handleReportSubmit}
          />

          <div className="sidebar-section">
            <div className="section-header">
              Alert Log
              <span className="sim-badge sms">Simulated SMS</span>
            </div>
            {alerts.length === 0 ? (
              <p className="no-alerts">No alerts yet. Increase risk to trigger one.</p>
            ) : (
              <div className="alerts-log">
                {alerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className="alert-log-entry">
                    <div>{alert.message}</div>
                    <div className="alert-time">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
