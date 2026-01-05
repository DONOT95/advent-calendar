// ===============   FILE TO Create Calendar, handle access (timer)   ===============

const DAYS = 24;

export function initCalendar({
  container,
  template,
  messages,
  now,
  onDoorOpen,
}) {
  const calendarEl = container;
  const tpl = template;

  if (!calendarEl || !tpl) return;
  // Check Date, set openable/closed state for days
  const m = now.getMonth() + 1; // 1..12
  const d = now.getDate();
  const allowedDay = m === 1 ? Math.min(d, DAYS) : 0;

  // Doors
  const frag = document.createDocumentFragment();

  // All door
  for (let i = 1; i <= DAYS; i++) {
    const btn = tpl.content.firstElementChild.cloneNode(true);
    btn.querySelector(".num").textContent = i;
    // Locked doors
    if (i > allowedDay) btn.classList.add("locked");
    // Today door
    if (i === allowedDay && allowedDay !== 0) btn.classList.add("today");

    btn.addEventListener("click", () => {
      // Check invalid request (try open locked door)
      if (btn.classList.contains("locked")) return;

      // message if found, empty (should never bee) URL or default...
      const msg = messages[i - 1] || "";

      // Mark already opened door
      btn.classList.add("opened");

      // callback feuern insead of here the Opened window (popup) logic
      if (typeof onDoorOpen === "function") {
        onDoorOpen(i, msg);
      }
    });

    frag.appendChild(btn);
  }
  // Swap Fragments ins DOM
  calendarEl.replaceChildren(frag);
}
