# 2-Day Build Plan

Assumes a team of 3-4. Adjust split based on who's strong at what.

## Day 1

**Morning**
- Agree on the one demo district/AOI and 4-5 zone locations (just pick real
  lat/long points along a known road/slope area)
- Set up the repo, basic FastAPI/Express app, basic React/HTML page that loads
  a blank Leaflet map
- Person A: backend skeleton (JSON/SQLite + risk endpoint)
- Person B: frontend map + zone markers
- Person C: risk formula + the manual rainfall/soil-moisture input controls

**Afternoon**
- Wire frontend to backend: changing the sliders calls the API, risk score
  updates, marker color changes
- Get the alert banner working when a zone crosses "High"
- Checkpoint: by end of day 1 you should have the core loop (slider → risk →
  color change → alert) working end to end, even if ugly

**Evening (light)**
- Fix bugs from the checkpoint
- Start the field-report form (photo + note + location) as a separate simple
  page

## Day 2

**Morning**
- Finish the field-report form → pin appears on map
- Add the "simulated sensor feed" / "simulated SMS" labels in the UI (this
  matters — do it now, not last-minute)
- Polish map styling, zone colors, legend

**Afternoon**
- Full run-through of the demo script (see below) at least 3 times
- Fix anything that breaks during run-throughs
- Record a backup demo video on a phone/screen-recorder in case venue WiFi or
  a laptop issue happens on stage

**Evening**
- Build the PPT using the PRD's feature list + roadmap slide
- Final run-through, then stop touching the code — no last-minute changes
  right before presenting

## Live demo script (rehearse this exact sequence)

1. Show the map, explain the district and zones
2. Move the rainfall/soil-moisture sliders for one zone → risk visibly rises
3. Point out the alert banner + log line when it crosses High
4. Switch to the field-report form → submit a photo → show the pin appear
5. Close with the roadmap slide: real sensors, real weather API, login/roles,
   multilingual, offline sync — all named as next steps, not hidden gaps

## If something breaks on stage

Have the backup video ready and say so plainly: "here's a recorded run in case
of connectivity issues" — judges expect this at hackathons and it reads as
prepared, not as a failure.
