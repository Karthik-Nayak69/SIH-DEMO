# Landslide Risk Monitoring Demo — NER

**SIH 26001 | MDoNER | Disaster Management**

AI-Based Early Warning and Landslide Risk Monitoring System for North-Eastern Region, India.

## Quick Start

### 1. Backend (FastAPI)

```bash
cd demo/backend
pip install fastapi uvicorn python-multipart
python main.py
```

Backend runs at **http://localhost:8000**

### 2. Frontend (React + Vite)

```bash
cd demo/frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

## Demo Script

1. **Map View** — Open the app, see 5 zones along Meghalaya road corridors
2. **Adjust Risk** — Select a zone, slide Rainfall and Soil Moisture up
3. **Watch Alert** — When risk crosses "High", an alert banner fires
4. **Field Report** — Submit a photo + note + map location → pin appears
5. **Alert Log** — Check the sidebar for all simulated SMS alerts

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/zones` | List all zones |
| POST | `/zones/{id}/update` | Update rainfall/soil_moisture |
| GET | `/alerts` | List alerts (newest first) |
| GET | `/reports` | List field reports |
| POST | `/reports` | Submit field report (multipart) |

## Risk Formula

```
risk_score = round(0.4 × rainfall + 0.4 × soil_moisture + 0.2 × slope_value)

Low: 0–30 | Moderate: 31–55 | High: 56–75 | Severe: 76–100
```
