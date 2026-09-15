# Antigravity Build Spec — copy/paste prompts

This is the file that makes the demo actually buildable by an AI coding tool.
The other 3 docs tell a human what and why; this tells the AI tool exactly
what to type/build, in order. Paste each prompt separately — don't paste them
all at once. Check the output of each step before moving to the next.

## Fixed data contracts (do not let the AI tool improvise these)

### Zone object
```json
{
  "id": "zone_1",
  "name": "Sohra Road - KM 12",
  "lat": 25.2840,
  "lng": 91.7330,
  "slope_value": 70,
  "rainfall": 20,
  "soil_moisture": 30,
  "risk_score": 42,
  "risk_level": "Moderate"
}
```

### Risk formula (backend must implement exactly this)
```
risk_score = round(0.4 * rainfall + 0.4 * soil_moisture + 0.2 * slope_value)
risk_level:
  0-30   -> "Low"
  31-55  -> "Moderate"
  56-75  -> "High"
  76-100 -> "Severe"
```
`rainfall` and `soil_moisture` are 0-100 sliders. `slope_value` is fixed per
zone (set once when creating sample data, doesn't change at runtime).

### Alert log entry
```json
{
  "id": "alert_1",
  "zone_id": "zone_1",
  "risk_level": "High",
  "message": "Simulated SMS sent to District Officer: High risk at Sohra Road - KM 12",
  "timestamp": "2026-09-15T10:22:00Z"
}
```
Created automatically whenever a zone's risk_level changes to "High" or
"Severe" (not on every update — only on a level change, to avoid spamming the
log).

### Field report object
```json
{
  "id": "report_1",
  "lat": 25.2810,
  "lng": 91.7355,
  "note": "Crack visible near culvert",
  "photo_path": "/uploads/report_1.jpg",
  "timestamp": "2026-09-15T11:05:00Z"
}
```

## API endpoints (backend must expose exactly these)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/zones` | — | list of zone objects |
| POST | `/zones/{id}/update` | `{ "rainfall": 0-100, "soil_moisture": 0-100 }` | updated zone object |
| GET | `/alerts` | — | list of alert log entries, newest first |
| GET | `/reports` | — | list of field report objects |
| POST | `/reports` | multipart form: `photo` (file), `note` (text), `lat`, `lng` | created report object |

## File structure (have the AI tool create exactly this)

```
demo/
  backend/
    main.py
    data/
      zones.json       # seeded with 4-5 sample zones
      alerts.json       # starts empty: []
      reports.json       # starts empty: []
    uploads/            # empty folder, gitkeep
  frontend/
    src/
      App.jsx
      components/
        MapView.jsx        # Leaflet map, zone markers colored by risk_level, report pins
        ZoneControls.jsx    # dropdown to pick a zone + two sliders (rainfall, soil_moisture)
        AlertBanner.jsx     # shows latest alert if risk just crossed High/Severe
        ReportForm.jsx      # photo upload + note + click-to-set-location on map
    package.json
  README.md
```

## Prompt 1 — backend scaffold

```
Create a FastAPI backend in backend/main.py with these exact endpoints:
GET /zones, POST /zones/{id}/update, GET /alerts, GET /reports, POST /reports.
Use the data contracts and risk formula below exactly as specified — do not
change field names or the formula. Store data in backend/data/zones.json,
alerts.json, reports.json (read/write these files directly, no real database).
Seed zones.json with 5 sample zones along a real road corridor in Meghalaya,
NER, India, with varied slope_value between 40 and 90.
Enable CORS for all origins (this is a demo).
[paste the "Fixed data contracts" and "Risk formula" sections above]
```

## Prompt 2 — frontend map scaffold

```
Create a React app (Vite) in frontend/ with a MapView component using
Leaflet.js. Fetch zones from GET http://localhost:8000/zones and render each
as a colored circle marker: green for Low, yellow for Moderate, orange for
High, red for Severe. Center the map on the zones' average lat/lng.
```

## Prompt 3 — zone controls wired to backend

```
Add a ZoneControls component: a dropdown to select one zone, and two sliders
(0-100) for rainfall and soil_moisture, initialized to that zone's current
values. On slider change, call POST /zones/{id}/update with the new values,
then update that zone's marker color on the map using the response.
```

## Prompt 4 — alert banner

```
Add an AlertBanner component. Poll GET /alerts every 3 seconds. If the newest
alert's timestamp is within the last 10 seconds, show it as a dismissible
banner at the top of the page with the alert's message text.
```

## Prompt 5 — field report form and pins

```
Add a ReportForm component: a simple form with a note text field, a photo
file input, and a "click on the map to set location" interaction that fills
in lat/lng. On submit, POST to /reports as multipart/form-data. After a
successful submit, refetch GET /reports and render each as a distinct pin
icon (different from zone markers) on the same map.
```

## Prompt 6 — polish pass (do last)

```
Add a small "Simulated sensor feed" label near the sliders and a "Simulated
SMS" label near the alert banner, styled as a subtle badge, not hidden. Add a
legend to the map showing what each marker color means. Make the layout
usable on a narrow/mobile viewport.
```

## How to use this with Antigravity

Paste prompts one at a time, in order. After each one, actually run the app
and check it matches the contract above before moving to the next prompt —
if you paste all 6 at once, small inconsistencies (a renamed field, a
different endpoint shape) compound and get harder to debug on day 2. Keep
this file open next to Antigravity so you can correct it immediately if its
output drifts from the exact field names/endpoints specified above.
