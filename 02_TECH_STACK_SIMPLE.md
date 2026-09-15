# Tech Stack (Simplified) — 2-Day Demo

Pick the single simplest option in each row. Don't split into microservices,
don't set up auth, don't containerize — none of that helps a 2-day demo.

| Layer | Use this | Why |
|---|---|---|
| Frontend | React (Vite) or even plain HTML/JS if no one knows React well | Whatever your team is already fastest in |
| Map | Leaflet.js | Free, no API key needed, simple marker + polygon support |
| Backend | One small FastAPI (Python) or Express (Node) app | A single file/app is fine — no need for multiple services |
| "Database" | A JSON file or SQLite | You do not need PostgreSQL/PostGIS for 4–5 zones in a demo — a JSON file with zone coordinates and a live risk value is enough, and it's zero setup time |
| Risk logic | A plain function in your backend (the formula from the PRD) | No ML library needed unless you have spare hours |
| Photo upload | Save to a local folder, store the file path in your JSON/SQLite | No cloud storage setup needed for a demo |
| Alerts | A banner in the UI + append a row to a simple "alerts log" table on screen | No real SMS needed — label it "simulated SMS" |
| Hosting for demo day | Run it locally on your laptop, or deploy free-tier (Render/Vercel/Railway) the night before as backup | Don't depend on live internet at the venue if avoidable — have a local fallback |

## What to skip entirely for 2 days

- Authentication/login
- Role-based access
- Real database (Postgres/PostGIS) — use JSON/SQLite
- Docker
- CI/CD
- Real SMS/notification provider
- Satellite/terrain data processing
- Multi-language beyond one demo string

## If you finish early (stretch, in priority order)

1. Swap the formula for a tiny trained model (scikit-learn, a few lines) —
   keeps the same input/output shape so nothing else changes.
2. Add a second district/AOI to show it's not hardcoded to one place.
3. Add one login screen (even fake/local) just to show role separation exists
   conceptually.
4. Add a genuine free-tier weather API call for rainfall instead of a manual
   slider, for one zone.

Stop there. More than this risks breaking something the night before the
demo — a working simple thing beats a half-working ambitious thing.
