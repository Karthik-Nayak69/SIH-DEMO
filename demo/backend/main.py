import json
import os
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Landslide Risk Monitoring API")

# CORS for all origins (demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

ZONES_FILE = os.path.join(DATA_DIR, "zones.json")
ALERTS_FILE = os.path.join(DATA_DIR, "alerts.json")
REPORTS_FILE = os.path.join(DATA_DIR, "reports.json")

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


# --- Helpers ---

def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def compute_risk(rainfall, soil_moisture, slope_value):
    """Exact formula from build spec."""
    risk_score = round(0.4 * rainfall + 0.4 * soil_moisture + 0.2 * slope_value)
    if risk_score <= 30:
        risk_level = "Low"
    elif risk_score <= 55:
        risk_level = "Moderate"
    elif risk_score <= 75:
        risk_level = "High"
    else:
        risk_level = "Severe"
    return risk_score, risk_level


# --- Endpoints ---

@app.get("/zones")
def get_zones():
    """Return list of zone objects."""
    return read_json(ZONES_FILE)


@app.post("/zones/{zone_id}/update")
def update_zone(zone_id: str, body: dict):
    """
    Update rainfall and soil_moisture for a zone.
    Body: { "rainfall": 0-100, "soil_moisture": 0-100 }
    Returns: updated zone object.
    """
    zones = read_json(ZONES_FILE)

    target = None
    for zone in zones:
        if zone["id"] == zone_id:
            target = zone
            break

    if target is None:
        return {"error": "Zone not found"}, 404

    old_risk_level = target["risk_level"]

    # Update values
    target["rainfall"] = body["rainfall"]
    target["soil_moisture"] = body["soil_moisture"]

    # Recompute risk using exact formula
    risk_score, risk_level = compute_risk(
        target["rainfall"], target["soil_moisture"], target["slope_value"]
    )
    target["risk_score"] = risk_score
    target["risk_level"] = risk_level

    # Create alert only on risk_level CHANGE to High or Severe
    if risk_level != old_risk_level and risk_level in ("High", "Severe"):
        alerts = read_json(ALERTS_FILE)
        alert_id = f"alert_{len(alerts) + 1}"
        alert = {
            "id": alert_id,
            "zone_id": zone_id,
            "risk_level": risk_level,
            "message": f"Simulated SMS sent to District Officer: {risk_level} risk at {target['name']}",
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
        alerts.append(alert)
        write_json(ALERTS_FILE, alerts)

    write_json(ZONES_FILE, zones)
    return target


@app.get("/alerts")
def get_alerts():
    """Return list of alert log entries, newest first."""
    alerts = read_json(ALERTS_FILE)
    alerts.sort(key=lambda a: a["timestamp"], reverse=True)
    return alerts


@app.get("/reports")
def get_reports():
    """Return list of field report objects."""
    return read_json(REPORTS_FILE)


@app.post("/reports")
async def create_report(
    photo: UploadFile = File(...),
    note: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
):
    """
    Create a field report.
    Multipart form: photo (file), note (text), lat, lng.
    Returns: created report object.
    """
    reports = read_json(REPORTS_FILE)
    report_id = f"report_{len(reports) + 1}"

    # Save photo
    photo_filename = f"{report_id}_{photo.filename}"
    photo_path = f"/uploads/{photo_filename}"
    file_path = os.path.join(UPLOADS_DIR, photo_filename)
    with open(file_path, "wb") as f:
        content = await photo.read()
        f.write(content)

    report = {
        "id": report_id,
        "lat": lat,
        "lng": lng,
        "note": note,
        "photo_path": photo_path,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    reports.append(report)
    write_json(REPORTS_FILE, reports)
    return report


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
