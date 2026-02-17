import { getLangAndDictThanResolveKey } from "../i18n/i18n.js";
import { getPreviewItemPrefix } from "../services/calendarDayServices.js";
/* Wizard view responsibilities:
- Step 1-3 rendering
- Progress bar and day index UI
- Preview list output
- URL dialog helper UI
One wizard = one view module. */
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

    // Step slider track and container
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

// Render preview messages for Step 3.
export function renderPreviewList(listEl, messages) {
  if (!listEl) return;

  listEl.replaceChildren(
    ...messages.map((text, i) => {
      // Build one row per day.
      const li = document.createElement("li");

      // Prefix for date/day label.
      const spanPrefix = document.createElement("span");
      spanPrefix.classList = "preview-prefixdate-lbl";

      // Message text container.
      const spanMessage = document.createElement("span");
      spanMessage.className = "preview-message";

      const prefix = getPreviewItemPrefix(i + 1);

      /* // If TEXT longer than 60 char cut it (only for preview)
      // Not used ->  it breaks the css format
      if (text.length > 50) {
        text = text.slice(0, 50);
        text = text + "...";
      } */

      spanPrefix.textContent = prefix + " ";
      spanMessage.textContent = text;

      // Combine prefix and message.
      li.append(spanPrefix, spanMessage);

      return li;
    }),
  );
}

// Open generated URL dialog and preselect URL text.
export function openUrlDialog(dialogEl, inputEl, url) {
  if (!dialogEl || !inputEl) return;
  inputEl.value = url;
  if (!dialogEl.open) dialogEl.showModal();

  // Select content in textfield
  selectInputText(inputEl);
}

// Temporarily swap "Copy" to "Copied!" on success.
export function flashCopyButtonText(btnEl, durationMs = 900) {
  if (!btnEl) return;

  // Resolve labels from i18n dictionary.
  const copyText = getLangAndDictThanResolveKey("buttons.copy");
  const copiedText = getLangAndDictThanResolveKey("buttons.copied");

  btnEl.textContent = copiedText || "Copied!";

  window.setTimeout(() => {
    btnEl.textContent = copyText || "Copy";
  }, durationMs);
}

// Focus input and select all text.
export function selectInputText(inputEl) {
  if (!inputEl) return;
  inputEl.focus();
  inputEl.select();

  inputEl.setSelectionRange(0, inputEl.value.length);
}

export function selectInputTextSafe(inputEl, { preventScroll = false } = {}) {
  if (!inputEl) return;

  // preventScroll avoids slider jump while focusing.
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

// Copy URL to clipboard with modern API and legacy fallback.
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

  // Legacy fallback for older browsers.
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

  // Clamp step index to valid range.
  const maxIndex = dom.createSteps.length - 1;
  const safeIndex = Math.max(0, Math.min(stepIndex, maxIndex));

  // Set active step class for opacity transition.
  dom.createSteps.forEach((el, index) => {
    el.classList.toggle("is-active", index === safeIndex);
  });

  // Slide track by full step widths.
  dom.createTrack.style.transform = `translateX(-${safeIndex * 100}%)`;

  syncCreateContainerHeight(dom, safeIndex);

  return safeIndex;
}

// Keep container height aligned with active step content.
export function syncCreateContainerHeight(dom, stepIndex) {
  // Not visible -> no measure
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

// Resize observer references for active step.
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

  // Apply height immediately after switching observer target.
  syncCreateContainerHeight(dom, stepIndex);
}

export function deactivateCreateRO() {
  if (!ro || !observed) return;
  ro.unobserve(observed);
  observed = null;
}
