// ===============   FILE TO Create Calendar, handle access (timer)   ===============
import { LIMITS } from "../config/constants.js";
import {
  renderDoors,
  updateDoorClassesView,
  markDoorOpened,
} from "../views/calendarView.js";

// Variable to check if initCalendar is already called (No double)
let initialized = false;
let midnightTimeoutId = null;

let calendarEl = null;
let tpl = null;

// Saved state for later re-render (auto middnight update usw.)
let buttons = [];
let messages = [];
let onDoorOpen = null;
let offsetMs = 0;

// Get the days from one source
const DAYS = LIMITS.messagesCount;

export function initCalendar({
  container,
  template,
  messages: msgs,
  offsetMs: off,
  onDoorOpen: callB,
}) {
  // Guard clause to prevent double function call
  if (!container || !template) return;
  // Once binden
  calendarEl = container;
  tpl = template;

  messages = Array.isArray(msgs) ? msgs : [];
  onDoorOpen = callB;
  offsetMs = Number.isFinite(off) ? off : 0;

  if (!initialized) {
    initialized = true;

    // Buttons + listener (Doors)
    buildCalendar();
    // Set today, locked schedules midnight refresh
    refreshCalendar();
  } else {
    refreshCalendar();
  }
}
// Replace messages array. Used by click handlers (calendar day buttons). (replace if demo messages and lang change)
export function setCalendarMessages(newMessages) {
  if (!Array.isArray(newMessages)) return;

  // Only set new Array if it is not the same
  if (messages.length === newMessages.length) {
    let same = true;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i] !== newMessages[i]) {
        same = false;
        break;
      }
    }
    // nothing changed
    if (same) return;
  }

  messages = newMessages;
}

// Update offset if needed NOT IN USE!!!!!!!!!!!!!!!!!
export function setCalendarOffsetMs(newOffsetMs) {
  offsetMs = Number.isFinite(newOffsetMs) ? newOffsetMs : 0;
}

// Refresh view state (locked/today) and midnight timer
export function refreshCalendar() {
  if (!initialized) return;
  const allowedDay = getAllowedDay(offsetMs, DAYS);

  updateDoorClassesView(buttons, { allowedDay });

  scheduleMidnightRefresh();
}

// Actual DOM manipulation (create), bind listener
function buildCalendar() {
  // Doors in DOM
  buttons = renderDoors(calendarEl, tpl, DAYS);

  // Bind click handlers
  for (let i = 1; i <= DAYS; i++) {
    const btn = buttons[i];

    if (!btn) continue;

    btn.addEventListener("click", () => {
      // Check invalid request (try open locked door)
      if (btn.classList.contains("locked")) return;

      // Mark already opened door
      markDoorOpened(btn);

      // message if found, empty
      const msg = messages?.[i - 1] ?? "";

      // callback feuer insead of here the Opened window (popup) logic
      if (typeof onDoorOpen === "function") {
        onDoorOpen?.(i, msg);
      }
    });
  }
}

function scheduleMidnightRefresh() {
  // Clear old timer
  if (midnightTimeoutId) clearTimeout(midnightTimeoutId);

  const now = new Date(Date.now() + offsetMs);

  // Next Midnight in "Servertime"
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 150);

  const msUntil = nextMidnight.getTime() - now.getTime();

  midnightTimeoutId = setTimeout(() => {
    refreshCalendar();
  }, msUntil);
}

function getAllowedDay(offsetMs, days) {
  const now = new Date(Date.now() + offsetMs);
  const month = now.getMonth() + 1; // 1–12
  const day = now.getDate();

  // Not December → no doors available
  if (month !== 2) return null;

  // No today. Current date > 24
  if (day > days) return null;

  // Return the current days to mark as today
  return Math.min(day, days);
}
