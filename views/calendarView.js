/* Section „Calendar“
Türen rendern
Klassen setzen (locked / today / opened)
Popup-Content setzen (oder Popup anstoßen)
Ein Kalender = eine View */
export function renderDoors(containerEl, templateEl, daysCount) {
  if (!containerEl || !templateEl) return [];

  const frag = document.createDocumentFragment();
  const buttons = new Array(daysCount + 1);

  for (let day = 1; day <= daysCount; day++) {
    const btn = templateEl.content.firstElementChild.cloneNode(true);

    const numEl = btn.querySelector(".num");
    if (numEl) numEl.textContent = day;

    btn.dataset.day = String(day);

    buttons[day] = btn;
    frag.appendChild(btn);
  }

  containerEl.replaceChildren(frag);
  return buttons;
}

export function updateDoorClassesView(buttons, { allowedDay }) {
  if (!buttons) return;

  for (let day = 1; day < buttons.length; day++) {
    const btn = buttons[day];
    if (!btn) continue;

    // locked: only when allowedDay is a number and day > allowedDay
    const isLocked = typeof allowedDay === "number" ? day > allowedDay : false;
    btn.classList.toggle("locked", isLocked);

    // Make today only if allowedDay is a number AND equals day
    btn.classList.toggle(
      "today",
      typeof allowedDay === "number" && day === allowedDay,
    );
  }
}

export function markDoorOpened(buttonEl) {
  if (!buttonEl) return;
  buttonEl.classList.add("opened");
}
