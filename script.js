document.addEventListener("DOMContentLoaded", () => {
  const DAYS = 24;

  const calendarEl = document.getElementById("calendar");
  const tpl = document.getElementById("door-tpl");
  const todayLabel = document.getElementById("todayLabel");

  // Sicherheits-Check: Sind die Elemente da?
  if (!calendarEl || !tpl) {
    console.error("calendar oder door-tpl nicht gefunden – stimmen die IDs?");
    return;
  }

  const messages = [
    "1. Dezember: ⭐ Ein kleiner Start ins Advent-Glück!",
    "2. Dezember: ☕ Zeit für Kakao und eine Pause.",
    "3. Dezember: ❄️ Ein Spaziergang in der Kälte wärmt das Herz.",
    "4. Dezember: 🎵 Ein Lied summen – wirkt Wunder.",
    "5. Dezember: 🍪 Back' dir was Leckeres!",
    "6. Dezember: 🎅 Nikolaus-Tag! Ein Lächeln verschenken.",
    "7. Dezember: 📚 10 Minuten lesen – für dich.",
    "8. Dezember: 🕯️ Kerzenlicht an – Ruhe an.",
    "9. Dezember: 💌 Jemandem Danke sagen.",
    "10. Dezember: 🌟 Du machst das gut.",
    "11. Dezember: 📸 Einen schönen Moment festhalten.",
    "12. Dezember: 🧣 Warm einpacken, tief durchatmen.",
    "13. Dezember: 🎁 Eine Kleinigkeit für dich selbst.",
    "14. Dezember: 🤝 Jemandem helfen – klein reicht.",
    "15. Dezember: 🍊 Mandarine? Der Duft von Advent!",
    "16. Dezember: 🧩 Etwas Neues ausprobieren.",
    "17. Dezember: 🫶 Drei Dinge notieren, für die du dankbar bist.",
    "18. Dezember: ☺️ Jemanden anlächeln.",
    "19. Dezember: 📞 Kurz anrufen, statt chatten.",
    "20. Dezember: 🌌 Sterne ansehen.",
    "21. Dezember: 💤 Früh ins Bett – Quality-Sleep.",
    "22. Dezember: 🎬 Lieblingsfilm an!",
    "23. Dezember: 🧁 Süßes und Gemütlichkeit.",
    "24. Dezember: 🎄 Frohe Weihnachten! ❤️",
  ];

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1..12
  const d = now.getDate();
  todayLabel.textContent = `Heute: ${String(d).padStart(2, "0")}.${String(
    m
  ).padStart(2, "0")}.${y}`;

  // nur im Dezember freischalten, sonst alle gesperrt (aber sichtbar)
  const allowedDay = m === 11 ? Math.min(d, DAYS) : 0;

  const frag = document.createDocumentFragment();
  for (let i = 1; i <= DAYS; i++) {
    const btn = tpl.content.firstElementChild.cloneNode(true);
    btn.querySelector(".num").textContent = i;

    if (i > allowedDay) btn.classList.add("locked");
    if (i === allowedDay && allowedDay !== 0) btn.classList.add("today");

    btn.addEventListener("click", () => {
      if (btn.classList.contains("locked")) return;
      alert(messages[i - 1] || `Türchen ${i}`);
      btn.classList.add("opened");
    });

    frag.appendChild(btn);
  }
  calendarEl.replaceChildren(frag);
});
