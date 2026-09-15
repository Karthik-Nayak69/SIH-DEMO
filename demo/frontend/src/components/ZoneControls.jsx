import { useState, useEffect } from 'react'

export default function ZoneControls({
  zones,
  selectedZoneId,
  onSelectZone,
  onUpdate,
  selectedZone,
}) {
  const [rainfall, setRainfall] = useState(0)
  const [soilMoisture, setSoilMoisture] = useState(0)

  // Sync sliders when selected zone changes
  useEffect(() => {
    if (selectedZone) {
      setRainfall(selectedZone.rainfall)
      setSoilMoisture(selectedZone.soil_moisture)
    }
  }, [selectedZoneId, selectedZone])

  const handleRainfallChange = (e) => {
    const val = Number(e.target.value)
    setRainfall(val)
    if (selectedZoneId) {
      onUpdate(selectedZoneId, val, soilMoisture)
    }
  }

  const handleSoilMoistureChange = (e) => {
    const val = Number(e.target.value)
    setSoilMoisture(val)
    if (selectedZoneId) {
      onUpdate(selectedZoneId, rainfall, val)
    }
  }

  const riskClass = selectedZone
    ? selectedZone.risk_level.toLowerCase()
    : ''

  return (
    <div className="sidebar-section">
      <div className="section-header">
        Zone Controls
        <span className="sim-badge">⚡ Simulated Sensor Feed</span>
      </div>

      <select
        className="zone-select"
        value={selectedZoneId || ''}
        onChange={(e) => onSelectZone(e.target.value)}
      >
        {zones.map(zone => (
          <option key={zone.id} value={zone.id}>
            {zone.name}
          </option>
        ))}
      </select>

      <div className="slider-group">
        <div className="slider-label">
          <span>Rainfall</span>
          <span className="slider-value">{rainfall}</span>
        </div>
        <input
          type="range"
          className="slider-track"
          min="0"
          max="100"
          value={rainfall}
          onChange={handleRainfallChange}
        />
      </div>

      <div className="slider-group">
        <div className="slider-label">
          <span>Soil Moisture</span>
          <span className="slider-value">{soilMoisture}</span>
        </div>
        <input
          type="range"
          className="slider-track"
          min="0"
          max="100"
          value={soilMoisture}
          onChange={handleSoilMoistureChange}
        />
      </div>

      {selectedZone && (
        <div className={`risk-display ${riskClass}`}>
          <div>
            <div className="risk-level-label">{selectedZone.risk_level}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Risk Level</div>
          </div>
          <div className="risk-score-num">{selectedZone.risk_score}</div>
        </div>
      )}
    </div>
  )
}
