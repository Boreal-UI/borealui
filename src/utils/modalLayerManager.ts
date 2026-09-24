const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=\"hidden\"])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable=\"true\"]",
  "[tabindex]:not([tabindex=\"-1\"])",
].join(",");

export type ModalLayerId = symbol;

export interface ModalLayerOptions {
  getLayerElement: () => HTMLElement | null;
  getFocusScope: () => HTMLElement | null;
  onEscape?: () => void;
  restoreFocus?: boolean;
}

interface ModalLayer extends ModalLayerOptions {
  id: ModalLayerId;
  opener: HTMLElement | null;
}

interface IsolationState {
  ariaHidden: string | null;
  inert: string | null;
}

const layers: ModalLayer[] = [];
const isolatedElements = new Map<HTMLElement, IsolationState>();
const pendingRestorations = new Map<
  ModalLayerId,
  { cancelled: boolean; opener: HTMLElement | null }
>();

let bodyHadNoScroll = false;
let listeningDocument: Document | null = null;

const isBrowser = () => typeof document !== "undefined";

const isUnavailable = (element: HTMLElement) =>
  element.hasAttribute("hidden") ||
  element.getAttribute("aria-hidden") === "true" ||
  element.closest("[inert]") !== null;

export const getFocusableElements = (scope: HTMLElement): HTMLElement[] =>
  Array.from(scope.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.tabIndex >= 0 && !isUnavailable(element),
  );

const focusInside = (layer: ModalLayer, fromEnd = false) => {
  const scope = layer.getFocusScope();
  if (!scope) return;

  const focusable = getFocusableElements(scope);
  const target = fromEnd ? focusable.at(-1) : focusable[0];
  (target ?? scope).focus();
};

const getTopLayer = () => layers.at(-1);

const handleKeyDown = (event: globalThis.KeyboardEvent) => {
  const layer = getTopLayer();
  if (!layer) return;

  if (event.key === "Escape") {
    if (!layer.onEscape) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    layer.onEscape();
    return;
  }

  if (event.key !== "Tab") return;

  const scope = layer.getFocusScope();
  if (!scope) return;

  const focusable = getFocusableElements(scope);
  if (focusable.length === 0) {
    event.preventDefault();
    scope.focus();
    return;
  }

  const active = document.activeElement;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!scope.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  } else if (event.shiftKey && (active === first || active === scope)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

const handleFocusIn = (event: FocusEvent) => {
  const layer = getTopLayer();
  const scope = layer?.getFocusScope();
  const target = event.target;

  if (!layer || !scope || !(target instanceof Node) || scope.contains(target)) {
    return;
  }

  focusInside(layer);
};

const restoreIsolation = () => {
  isolatedElements.forEach((state, element) => {
    if (state.ariaHidden === null) element.removeAttribute("aria-hidden");
    else element.setAttribute("aria-hidden", state.ariaHidden);

    if (state.inert === null) element.removeAttribute("inert");
    else element.setAttribute("inert", state.inert);
  });
  isolatedElements.clear();
};

const isolateElement = (element: HTMLElement) => {
  if (!isolatedElements.has(element)) {
    isolatedElements.set(element, {
      ariaHidden: element.getAttribute("aria-hidden"),
      inert: element.getAttribute("inert"),
    });
  }
  element.setAttribute("aria-hidden", "true");
  element.setAttribute("inert", "");
};

const refreshIsolation = () => {
  restoreIsolation();

  const topElement = getTopLayer()?.getLayerElement();
  if (!topElement || !document.body.contains(topElement)) return;

  let current: HTMLElement = topElement;
  while (current !== document.body) {
    const parent = current.parentElement;
    if (!parent) break;

    Array.from(parent.children).forEach((sibling) => {
      if (sibling !== current && sibling instanceof HTMLElement) {
        isolateElement(sibling);
      }
    });
    current = parent;
  }
};

const beginGlobalOwnership = () => {
  if (!isBrowser()) return;

  bodyHadNoScroll = document.body.classList.contains("noScroll");
  document.body.classList.add("noScroll");
  document.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener("focusin", handleFocusIn, true);
  listeningDocument = document;
};

const endGlobalOwnership = () => {
  restoreIsolation();

  if (listeningDocument) {
    listeningDocument.removeEventListener("keydown", handleKeyDown, true);
    listeningDocument.removeEventListener("focusin", handleFocusIn, true);
    if (!bodyHadNoScroll) {
      listeningDocument.body.classList.remove("noScroll");
    }
  }

  listeningDocument = null;
  bodyHadNoScroll = false;
};

const scheduleFocusRestoration = (layer: ModalLayer) => {
  if (layer.restoreFocus === false) return;

  const pending = { cancelled: false, opener: layer.opener };
  pendingRestorations.set(layer.id, pending);

  queueMicrotask(() => {
    if (pending.cancelled || pendingRestorations.get(layer.id) !== pending) {
      return;
    }
    pendingRestorations.delete(layer.id);

    const nextLayer = getTopLayer();
    const nextScope = nextLayer?.getFocusScope();
    const opener = layer.opener;
    const canRestoreOpener =
      opener?.isConnected && (!nextScope || nextScope.contains(opener));

    if (canRestoreOpener) opener.focus();
    else if (nextLayer) focusInside(nextLayer);
  });
};

export const registerModalLayer = (
  id: ModalLayerId,
  options: ModalLayerOptions,
) => {
  const pending = pendingRestorations.get(id);
  const replayOpener = pending?.opener;
  if (pending) {
    pending.cancelled = true;
    pendingRestorations.delete(id);
  }

  const existingIndex = layers.findIndex((layer) => layer.id === id);
  if (existingIndex >= 0) layers.splice(existingIndex, 1);

  const wasEmpty = layers.length === 0;
  const layer: ModalLayer = {
    ...options,
    id,
    opener:
      replayOpener ??
      (isBrowser() ? (document.activeElement as HTMLElement | null) : null),
  };

  layers.push(layer);
  if (wasEmpty) beginGlobalOwnership();
  refreshIsolation();

  let active = true;
  return () => {
    if (!active) return;
    active = false;

    const index = layers.findIndex((candidate) => candidate.id === id);
    if (index < 0) return;

    const wasTop = index === layers.length - 1;
    layers.splice(index, 1);

    if (layers.length === 0) endGlobalOwnership();
    else refreshIsolation();

    if (wasTop) scheduleFocusRestoration(layer);
  };
};

export const __resetModalLayerManagerForTests = () => {
  layers.splice(0, layers.length);
  pendingRestorations.forEach((pending) => {
    pending.cancelled = true;
  });
  pendingRestorations.clear();
  endGlobalOwnership();
};
