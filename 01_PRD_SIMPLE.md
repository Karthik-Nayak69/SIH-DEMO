# PRD (Simplified) — 2-Day Demo Scope
## AI-Based Early Warning and Landslide Risk Monitoring System — NER
SIH 26001 | MDoNER | Disaster Management

## What we're actually demoing

**One district. One risk model. One live scenario: rain increases → risk rises
→ alert fires → a field report shows up on the map.**

Everything else in the full problem statement is real (we'll list it), but not
built for this demo — it's shown as "roadmap" on one slide.

## The demo story (this is your build target, not a document)

1. Dashboard opens on a map of one real NER district, with 4–5 zones marked.
   Each zone shows a risk level: Low / Moderate / High / Severe.
2. A small control on the page lets you push up "rainfall" and "soil moisture"
   for one zone (this is your simulated sensor — say so on screen, a small
   label like "simulated sensor feed" is enough).
3. Risk score for that zone recalculates and visibly changes color on the map.
4. When it crosses "High," an alert banner appears + one log line ("SMS sent
   to District Officer" — this can just be a line in a table, doesn't need
   real SMS).
5. A second simple page/form lets you submit a photo + note + location
   ("field report"). It appears as a pin on the same map.
6. That's it. That is a complete, honest, working demo of the core loop.

## Feature list — build only these

| # | Feature | Why it's enough |
|---|---|---|
| 1 | District map with 4–5 zone polygons or markers | Shows the GIS requirement |
| 2 | Risk score per zone (simple formula, not deep ML) | Shows the AI/prediction requirement |
| 3 | Manual sliders/inputs to change rainfall & soil moisture | Stands in for sensors + weather API, and makes the demo interactive |
| 4 | Alert banner + log entry when risk crosses a threshold | Shows the early-warning requirement |
| 5 | Field report form (photo + note + location pin) | Shows the citizen/field-reporting requirement |
| 6 | One dashboard view combining map + risk + alerts + reports | Shows "the platform" as one coherent thing, not four disconnected pieces |

## Explicitly NOT building (say this out loud in the pitch, don't hide it)

- Real IoT sensors — described as future work, not built
- Real satellite imagery processing — mention it's a planned data input
- Real IMD/ISRO API integration — architecture supports it, not connected live
- Multiple languages — pick one extra language for one alert message as a token gesture, nothing more
- Offline sync — mention as roadmap only
- Login/roles — skip entirely for the demo unless you have spare time on day 2

## Risk score formula (keep it this simple)

```
risk_score = (rainfall_weight × rainfall_level)
           + (soil_moisture_weight × soil_moisture_level)
           + (slope_weight × fixed_slope_value_per_zone)

Low: 0-30   Moderate: 31-55   High: 56-75   Severe: 76-100
```

A transparent weighted formula is faster to build, impossible to get wrong
under time pressure, and easy to explain to a judge — call it "a rule-based AI
risk model" honestly rather than claiming a trained ML model you didn't have
time to validate. If you do have a few spare hours, swap it for a simple
scikit-learn model trained on made-up sample data — same interface either way.

## One-slide roadmap (what a real pilot adds)

Real IoT sensor nodes → IMD/ISRO data integration → district admin roles &
login → full multilingual alerts → offline sync for no-network villages →
government cloud hosting + security audit.
