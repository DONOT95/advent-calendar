import { getUiLanguage, uiTexts } from "./i18n.js";
//===========================================================================
// ---   TIME FUNCTION   ---
// Set, display time
let lastUpdateFn = null;
let intervalId = null;

export function startClock(currentHour, currentDate) {
  if (!currentHour || !currentDate) return;
  const pad = (n) => String(n).padStart(2, "0");

  // Get Current Date
  function updateTime() {
    const lang = getUiLanguage();
    const now = new Date();

    const dict = uiTexts[lang] || uiTexts.en;
    var tmplHour = dict.currentHour || uiTexts.en.currentHour;
    var tmplDate = dict.currentDate || uiTexts.en.currentDate;

    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const h = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    tmplDate = tmplDate
      .replace("{d}", `${pad(d)}`)
      .replace("{m}", `${pad(m)}`)
      .replace("{y}", `${pad(y)}`);

    currentDate.textContent = tmplDate;

    // Formatted datum + actual values
    tmplHour = tmplHour
      .replace("{h}", `${pad(h)}`)
      .replace("{min}", `${pad(min)}`)
      .replace("{sec}", `${pad(sec)}`);

    currentHour.textContent = tmplHour;
  }

  lastUpdateFn = updateTime;

  if (intervalId) clearInterval(intervalId);

  // Init time, UI element
  updateTime();
  // Refresh time every second
  intervalId = setInterval(updateTime, 1000);
}

export function refreshClock() {
  if (lastUpdateFn) lastUpdateFn();
}
