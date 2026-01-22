// The Starting Point of the APP
import { readConfigFromUrl } from "./urlData.js";
import { initCalendar } from "./calendar.js";
import { initUI, openPopup } from "./ui.js";
import { initGenerator } from "./generator.js";
import { getServerDate } from "./clock.js";

document.addEventListener("DOMContentLoaded", async () => {
  const dateNow = await getServerDate();
  // Get Data from URL
  const config = readConfigFromUrl();

  // Assign HTML with JS values
  initUI(config, dateNow);

  // Bild Default or Custom Calendar
  initCalendar({
    container: document.getElementById("calendar"),
    template: document.getElementById("door-tpl"),
    messages: config.messages,
    now: dateNow,
    onDoorOpen: (day, message) => {
      openPopup(day, message);
    },
  });

  // Create custom calendar option
  initGenerator();
});
