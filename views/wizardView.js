import { getUiLanguage, uiTexts } from "../i18n/i18n.js";
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
    toInput: document.getElementById("toInput"),
    themeSelect: document.getElementById("themeSelect"),
    stepProgress: document.getElementById("stepProgress"),
    btnCreateDefault: document.getElementById("btnCreateDefault"),
    btnAddCustom: document.getElementById("btnAddCustom"),

    // Step 2
    dailyNumber: document.getElementById("dailyNumber"),
    messageEditor: document.getElementById("messageEditor"),
    btnPrevDay: document.getElementById("btnPrevDay"),
    btnNextDay: document.getElementById("btnNextDay"),

    // Step 3
    previewFrom: document.getElementById("previewFrom"),
    previewTo: document.getElementById("previewTo"),
    previewMessages: document.getElementById("previewMessages"),
    btnBackToEdit: document.getElementById("btnBackToEdit"),
    btnGenerateUrl: document.getElementById("btnGenerateUrl"),
    btnShowGenerated: document.getElementById("btnShowGenerated"),

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
    ...messages.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }),
  );
}

// Open generated Url dialog popup
export function openUrlDialog(dialogEl, inputEl, url) {
  if ((!dialogEl, !inputEl)) return;
  inputEl.value = url;
  if (!dialogEl.open) dialogEl.showModal();
}

// COPY URL
// Temp text change for button (copy -> copied!)
export function flashCopyButtonText(btnEl, durationMs = 900) {
  if (!btnEl) return;

  const lang = getUiLanguage();
  const dict = uiTexts[lang] || uiTexts.en;

  const copyText = dict?.buttons?.copy ?? uiTexts.en?.buttons.copy ?? "Copy";
  const copiedText =
    dict?.buttons?.copied ?? uiTexts.en?.buttons?.copied ?? "Copied!";

  btnEl.textContent = copiedText;

  window.setTimeout(() => {
    btnEl.textContent = copyText;
  }, durationMs);
}

export function selectInputText(inputEl) {
  if (!inputEl) return;
  (inputEl.focus(), inputEl.select());
  inputEl.setSelectionRange(0, inputEl.value.length);
}

export async function copyUrlFromWizard(inputEl) {
  const url = inputEl?.value?.trim?.() ?? "";
  if (!url) return;
  // 1. Modern with Clipboard API
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    //
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

export function setWizardStep(dom, stepIndex){
  if(!dom?.createTrack || !Array.isArray(dom.createSteps)) return;

  // Safe min-max select (can't be lower than min, can't be over max)
  const maxIndex = dom.createSteps.length - 1;
  const safeIndex = Math.max(0, Math.min(stepIndex, maxIndex));
  
  // Animation 0%, -100%, -200%...
  dom.createTrack.style.transform = `translateX(-${safeIndex * 100}%)`;

  syncCreateContainerHeight(dom, stepIndex);

  return safeIndex;
}

// For different STEP (generate 1-3)
// Make border fit content
export function syncCreateContainerHeight(dom, stepIndex) {
  // Wenn die Page nicht sichtbar ist: NICHT messen und NICHT überschreiben
  if (!dom?.pageCreate?.classList.contains("active")) return;

  const activeStep = dom.createSteps?.[stepIndex];
  const container = dom.createContainer;
  if (!activeStep || !dom.createContainer) return;

  // Erst nach Layout-Update messen (wichtig bei Transition/Fonts)
  requestAnimationFrame(() => {
    const h = activeStep.getBoundingClientRect().height;
    if (h > 0) container.style.height = `${Math.ceil(h)}px`;
  });
}