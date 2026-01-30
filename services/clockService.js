import { formatPlaceholder } from "../i18n/i18n.js";
//===========================================================================
// ---   TIME FUNCTION   ---
// Set, display time
let lastUpdateFn = null;
let intervalId = null;

export async function getServerDate() {
  try {
    const res = await fetch(window.location.href, {
      method: "HEAD",
      cache: "no-store",
    });
    const dateHeader = res.headers.get("date");
    return dateHeader ? new Date(dateHeader) : new Date();
  } catch {
    return new Date();
  }
}

export function startClock(currentHour, currentDate, offsetMs) {
  if (!currentHour || !currentDate) return;

  const pad = (n) => String(n).padStart(2, "0");

  // Get Current Date
  function updateTime() {
    //const now = new Date();
    const now = new Date(Date.now() + offsetMs);

    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const h = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    currentDate.textContent = formatPlaceholder("currentDate", {
      d: pad(d),
      m: pad(m),
      y: pad(y),
    });

    // Formatted datum + actual values
    currentHour.textContent = formatPlaceholder("currentHour", {
      h: pad(h),
      min: pad(min),
      sec: pad(sec),
    });
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
