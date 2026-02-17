# Advent Calendar Web App

Client-side JavaScript app for creating and sharing an Advent calendar.
It supports:
- Demo mode (default content)
- URL mode (open a shared calendar from a `?data=...` link)
- A 3-step wizard to create custom calendars

## Requirements

- Modern browser with ES module support
- A local web server (recommended for module loading and fetch behavior)

## Run Locally

1. Open this folder in your editor.
2. Start a static server in the project root.
3. Open `index.html` through that server.

Examples:

```powershell
# Python 3
python -m http.server 5500
```

Then open:

`http://localhost:5500`

## How It Works

1. `main.js` reads config from URL (`services/urlDataService.js`).
2. Sanitized config is applied to `appState` (`state/appState.js`).
3. UI is initialized (`controllers/uiController.js`).
4. Calendar is initialized (`controllers/calendarController.js`).
5. Wizard is initialized (`controllers/wizardController.js`).

## URL Data Format

Shared links use a Base64-encoded JSON payload in query param `data`.

Example (decoded shape):

```json
{
  "lang": "en",
  "theme": "classic",
  "from": "Alice",
  "to": "Bob",
  "messages": ["...", "..."]
}
```

The app validates and sanitizes all URL values. If data is broken or incomplete, fallback defaults are applied and URL status is tracked (`ok`, `repaired`, `invalid`, `none`).

## Project Structure

- `controllers/`: event flow and orchestration
- `views/`: DOM rendering and UI-only logic
- `services/`: pure data transformations and helpers
- `state/`: central app state + defaults
- `validation/`: sanitizer and validator helpers
- `i18n/`: language dictionaries and translation helpers
- `styles/`: global, section, and responsive CSS

## Architecture Rules

- View modules do DOM operations only.
- Controller modules bind events and call services/views.
- Service modules hold reusable logic and transformations.
- `appState` is the single source of truth at runtime.

## Notes

- Clock sync uses a `HEAD` request against the current page and computes local offset.
- Wizard preview keeps line breaks by rendering message text as plain text (`textContent`) and using CSS `white-space: pre-wrap`.
- Clipboard copy uses modern Clipboard API with a legacy fallback.

## Troubleshooting

- If modules do not load, run through a local server instead of opening the file directly.
- If shared links fail, check that `data` exists and is valid Base64 JSON.
- If a URL is partially invalid, app fallback behavior is expected and reported through the URL status dialog.
