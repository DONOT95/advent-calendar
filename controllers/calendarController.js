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

  messages = Array.isArray(msgs) ? msgs : [];
  onDoorOpen = callB;
  offsetMs = Number.isFinite(off) ? off : 0;

  if (!initialized) {
    initialized = true;

    // Once binden
    calendarEl = container;
    tpl = template;

    // Buttons + listener (Doors)
    buildCalendar();
    // Set today, locked
    updateDoorClassesControll();
    // Set next refresh (midnight)
    scheduleMidnightRefresh();
  } else {
    updateDoorClassesControll();
  }
}

function buildCalendar() {
  // Doors

  buttons = renderDoors(calendarEl, tpl, DAYS);

  // All door
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

function updateDoorClassesControll() {
  // Check Date, set openable/locked/today state for doors
  const now = new Date(Date.now() + offsetMs);

  const allowedDay = getAllowedDay(now, DAYS);

  updateDoorClassesView(buttons, { allowedDay });
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
    updateDoorClassesControll();
    scheduleMidnightRefresh();
  }, msUntil);

  // TEST REFRESH IN CONSOLE
  /* midnightTimeoutId = setTimeout(() => {
    console.log("MIDNIGHT REFRESH FIRED", new Date(Date.now() + offsetMs));
    updateDoorClassesC();
    scheduleMidnightRefresh();
  }, msUntil); */
}

function getAllowedDay(now, daysCount) {
  const month = now.getMonth() + 1; // 1–12
  const day = now.getDate();

  // Not December → no doors available
  if (month !== 2) return 0;

  // December 1–24
  if (day >= 1 && day <= daysCount) return day;

  // After Advent (25+): all doors available, but no "today"
  return null;
}
