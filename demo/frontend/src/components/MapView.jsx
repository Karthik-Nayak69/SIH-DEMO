import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon path issue in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom report pin icon
const reportIcon = new L.DivIcon({
  html: '<div style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))">📍</div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

// Risk level → color mapping (exact spec)
const RISK_COLORS = {
  Low: '#22C55E',       // green
  Moderate: '#EAB308',  // yellow
  High: '#F97316',      // orange
  Severe: '#EF4444',    // red
}

function MapClickHandler({ onMapClick, pickingLocation }) {
  useMapEvents({
    click(e) {
      if (pickingLocation) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export default function MapView({ zones, reports, onMapClick, pickingLocation }) {
  // Compute center from zones' average lat/lng
  const center = zones.length > 0
    ? [
        zones.reduce((sum, z) => sum + z.lat, 0) / zones.length,
        zones.reduce((sum, z) => sum + z.lng, 0) / zones.length,
      ]
    : [25.28, 91.72] // Default Meghalaya

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      cursor={pickingLocation ? 'crosshair' : 'grab'}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onMapClick} pickingLocation={pickingLocation} />

      {/* Zone markers — colored circle markers */}
      {zones.map(zone => (
        <CircleMarker
          key={zone.id}
          center={[zone.lat, zone.lng]}
          radius={14}
          pathOptions={{
            fillColor: RISK_COLORS[zone.risk_level] || '#999',
            fillOpacity: 0.85,
            color: '#FFFFFF',
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", minWidth: 180 }}>
              <strong style={{ fontSize: 14 }}>{zone.name}</strong>
              <div style={{ margin: '6px 0', fontSize: 12, color: '#4B5563' }}>
                Slope: {zone.slope_value}° &middot; Score: {zone.risk_score}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 600,
                background: RISK_COLORS[zone.risk_level],
                color: zone.risk_level === 'Moderate' ? '#854D0E' : '#FFF',
              }}>
                {zone.risk_level}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Report pins — distinct from zone markers */}
      {reports.map(report => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={reportIcon}
        >
          <Popup>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", minWidth: 160 }}>
              <strong style={{ fontSize: 13 }}>Field Report</strong>
              <p style={{ fontSize: 12, margin: '4px 0', color: '#4B5563' }}>{report.note}</p>
              {report.photo_path && (
                <img
                  src={`http://localhost:8000${report.photo_path}`}
                  alt="Report"
                  style={{ width: '100%', borderRadius: 4, marginTop: 4 }}
                />
              )}
              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                {new Date(report.timestamp).toLocaleString()}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
