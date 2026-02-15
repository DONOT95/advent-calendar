import { getLangAndDictThanResolveKey } from "../i18n/i18n.js";
import { getPreviewItemPrefix } from "../services/calendarDayServices.js";
/* Zuständig für: Section „Create / Generate“
Step 1–3 Rendering
Progressbar
Tagesnummer / Textarea
Preview-Liste
Fehlermeldungen im Wizard
Ein Wizard = eine View */
export function bindWizardDom() {
  return {
    // Step 1
    fromInput: document.getElementById("fromInput"),
    fromInputCharactersCounter: document.getElementById("charactersFromCount"),
    toInput: document.getElementById("toInput"),
    toInputCharactersCounter: document.getElementById("charactersToCount"),
    themeSelect: document.getElementById("themeSelect"),
    stepProgress: document.getElementById("stepProgress"),
    btnCreateDefault: document.getElementById("btnCreateDefault"),
    btnAddCustom: document.getElementById("btnAddCustom"),

    // Step 2
    dailyNumber: document.getElementById("dailyNumber"),
    messageEditor: document.getElementById("messageEditor"),
    messageEditorCharactersCounter: document.getElementById(
      "charactersMessageEditor",
    ),
    btnPrevDay: document.getElementById("btnPrevDay"),
    btnNextDay: document.getElementById("btnNextDay"),

    // Step 3
    previewFrom: document.getElementById("previewFrom"),
    previewTo: document.getElementById("previewTo"),
    previewMessages: document.getElementById("previewMessages"),
    btnBackToEdit: document.getElementById("btnBackToEdit"),
    btnGenerateUrl: document.getElementById("btnGenerateUrl"),
    /* btnShowGenerated: document.getElementById("btnShowGenerated"), */

    // Track/Container (für Steps)
    pageCreate: document.getElementById("page-create"),
    createContainer: document.getElementById("create-container"),
    createTrack: document.getElementById("create-track"),
    createSteps: Array.from(document.querySelectorAll(".create-step")),

    // URL Dialog
    urlDialog: document.getElementById("urlDialog"),
    generatedUrl: document.getElementById("generatedUrl"),
    btnCopyUrl: document.getElementById("btnCopyUrl"),
    btnOpenUrl: document.getElementById("btnOpenUrl"),

    // Global (Header)
    pageLanguage: document.getElementById("pageLanguage"),
  };
}

// DOM guard
export function isWizardDomReady(dom) {
  return Boolean(
    dom?.pageCreate &&
    dom?.createTrack &&
    dom?.createContainer &&
    dom?.fromInput &&
    dom?.toInput &&
    dom?.themeSelect &&
    dom?.previewMessages &&
    dom?.urlDialog &&
    dom?.generatedUrl,
  );
}

// Display Preview messages
export function renderPreviewList(listEl, messages) {
  if (!listEl) return;

  listEl.replaceChildren(
    ...messages.map((text, i) => {
      // Flexible li for HTML
      const li = document.createElement("li");

      // message LBL, own class
      const spanPrefix = document.createElement("span");
      spanPrefix.classList = "preview-prefixdate-lbl";

      // messge TEXT, own class
      const spanMessage = document.createElement("span");
      spanMessage.className = "preview-message";

      const prefix = getPreviewItemPrefix(i + 1);

      // If TEXT longer than 60 char cut it (only for preview)
      if (text.length > 60) {
        text = text.slice(0, 60);
        text = text + "...";
      }

      spanPrefix.textContent = prefix + " ";
      spanMessage.textContent = text;

      // Add up the LBL + TEXT
      li.append(spanPrefix, spanMessage);

      return li;
    }),
  );
}

// Open generated Url dialog
export function openUrlDialog(dialogEl, inputEl, url) {
  if (!dialogEl || !inputEl) return;
  inputEl.value = url;
  if (!dialogEl.open) dialogEl.showModal();

  // Select content in textfield
  selectInputText(inputEl);
}

// COPY URL
// Temp text change for button (copy -> copied!)
export function flashCopyButtonText(btnEl, durationMs = 900) {
  if (!btnEl) return;

  // Get Lang, Dictionary[lang] select
  // Set text from dictionary
  const copyText = getLangAndDictThanResolveKey("buttons.copy");
  const copiedText = getLangAndDictThanResolveKey("buttons.copied");

  btnEl.textContent = copiedText || "Copied!";

  window.setTimeout(() => {
    btnEl.textContent = copyText || "Copy";
  }, durationMs);
}

// Select input field content
export function selectInputText(inputEl) {
  if (!inputEl) return;
  inputEl.focus();
  inputEl.select();

  inputEl.setSelectionRange(0, inputEl.value.length);
}

export function selectInputTextSafe(inputEl, { preventScroll = false } = {}) {
  if (!inputEl) return;

  // preventScroll: avoids "jumping" the slider
  if (preventScroll && typeof inputEl.focus === "function") {
    try {
      inputEl.focus({ preventScroll: true });
    } catch {
      inputEl.focus();
    }
  } else {
    inputEl.focus();
  }

  if (typeof inputEl.select === "function") inputEl.select();
}

// Copy BTN, copy HTML inhalt to clipboard
export async function copyUrlFromWizard(inputEl) {
  const url = inputEl?.value?.trim?.() ?? "";
  if (!url) return false;
  // 1. Modern with Clipboard API
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // nothing, go to 2. try
  }

  // 2. exeCommand old but works
  try {
    inputEl.focus();
    inputEl.select();
    inputEl.setSelectionRange(0, inputEl.value.length);

    return document.execCommand("copy");
  } catch {
    return false;
  }
}

export function setWizardStep(dom, stepIndex) {
  if (!dom?.createTrack || !Array.isArray(dom.createSteps)) return;

  // Safe min-max select (can't be lower than min, can't be over max)
  const maxIndex = dom.createSteps.length - 1;
  const safeIndex = Math.max(0, Math.min(stepIndex, maxIndex));

  // For "ghost to visible" effect, class list
  dom.createSteps.forEach((el, index) => {
    el.classList.toggle("is-active", index === safeIndex);
  });

  // Animation 0%, -100%, -200%...
  dom.createTrack.style.transform = `translateX(-${safeIndex * 100}%)`;

  syncCreateContainerHeight(dom, safeIndex);

  return safeIndex;
}

// For different STEP (generate 1-3)
// Make border fit content
export function syncCreateContainerHeight(dom, stepIndex) {
  // Wenn die Page nicht sichtbar ist: NICHT messen und NICHT überschreiben
  if (!dom?.pageCreate?.classList.contains("active")) return;

  const activeStep = dom.createSteps?.[stepIndex];
  const container = dom.createContainer;
  if (!activeStep || !container) return;

  requestAnimationFrame(() => {
    // Use the larger value so wrapped text / dynamic overflow never gets clipped.
    const h = Math.max(activeStep.offsetHeight, activeStep.scrollHeight);
    if (h > 0) container.style.height = `${Math.ceil(h) + 2}px`;
  });
}

// NEW RESIZE FOR STEPS IN WIZARD
let ro = null;
let observed = null;

export function ensureCreateRO(dom, getStepIndex) {
  if (ro) return;

  ro = new ResizeObserver(() => {
    const idx = getStepIndex();
    syncCreateContainerHeight(dom, idx);
  });

  window.addEventListener("resize", () => {
    const idx = getStepIndex();
    syncCreateContainerHeight(dom, idx);
  });
}

export function activateCreateRO(dom, stepIndex) {
  if (!ro || !dom?.createSteps?.length) return;

  const el = dom.createSteps[stepIndex];
  if (!el) return;

  if (observed) ro.unobserve(observed);
  observed = el;
  ro.observe(observed);

  // sofort korrekt setzen (wichtig!)
  syncCreateContainerHeight(dom, stepIndex);
}

export function deactivateCreateRO() {
  if (!ro || !observed) return;
  ro.unobserve(observed);
  observed = null;
}
