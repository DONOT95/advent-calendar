// ===============   FILE TO Create Calendar, handle access (timer)   ===============
import { LIMITS } from "./generator.js";

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
    updateDoorClasses();
    // Set next refresh (midnight)
    scheduleMidnightRefresh();
  } else {
    updateDoorClasses();
  }
}

function buildCalendar() {
  // Doors
  const frag = document.createDocumentFragment();
  buttons = new Array(DAYS + 1);

  // All door
  for (let i = 1; i <= DAYS; i++) {
    const btn = tpl.content.firstElementChild.cloneNode(true);
    btn.querySelector(".num").textContent = i;

    btn.addEventListener("click", () => {
      // Check invalid request (try open locked door)
      if (btn.classList.contains("locked")) return;

      // Mark already opened door
      btn.classList.add("opened");

      // message if found, empty (should never bee) URL or default...
      const msg = messages?.[i - 1] ?? "";

      // callback feuer insead of here the Opened window (popup) logic
      if (typeof onDoorOpen === "function") {
        onDoorOpen?.(i, msg);
      }
    });

    buttons[i] = btn;
    frag.appendChild(btn);
  }
  // Swap Fragments ins DOM
  calendarEl.replaceChildren(frag);
}

function updateDoorClasses() {
  // Check Date, set openable/locked/today state for doors
  const now = new Date(Date.now() + offsetMs);
  const m = now.getMonth() + 1; // 1..12
  const d = now.getDate();

  const allowedDay = m === 1 ? Math.min(d, DAYS) : 0;

  for (let i = 1; i <= DAYS; i++) {
    const btn = buttons[i];
    if (!btn) continue;

    // Remove locked if day allowed
    btn.classList.toggle("locked", i > allowedDay);

    // From yesterday btn "today" remove, today -> add
    btn.classList.toggle("today", allowedDay !== 0 && i === allowedDay);
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
    updateDoorClasses();
    scheduleMidnightRefresh();
  }, msUntil);

  // TEST REFRESH IN CONSOLE
  /* midnightTimeoutId = setTimeout(() => {
    console.log("MIDNIGHT REFRESH FIRED", new Date(Date.now() + offsetMs));
    updateDoorClasses();
    scheduleMidnightRefresh();
  }, msUntil); */
}
