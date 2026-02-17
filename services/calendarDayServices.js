import { formatText, formatPlaceholder } from "../i18n/i18n.js";

// Preview list before every message datum + day
// CALENDAR Dialog -> daily message before message datum + day
export function getPreviewItemPrefix(day) {
  return formatPlaceholder("labels.dayPrefix", { day }, "Dec {day}:");
}

// CALENDAR Dialog -> Title
export function getCalendarDialogTitle() {
  return formatText("labels.popupTitle", "Today's message");
}

// Only for Demo mod -> from (me) to (you) should be
// dynamic set with language change
// Change property when -> lang change && appState.calendar.source === "demo"
export function getFrom() {
  return formatText("labels.fromPerson", "Me");
}

export function getTo() {
  return formatText("labels.toPerson", "You");
}

export function getUrlErrorMessage() {
  return formatText(
    "labels.invalidLink",
    "Warning! Invalid url. Please paste a valid calendar link.",
  );
}
